import React, {useEffect, useState} from 'react';
import {
    Badge, Box, Button, Center,
    Container, Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Spacer, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {filterGreaterThan, OptionFilter, SliderColumnFilter} from "../../components/datatable";
import AccountServices from "../../services/accountServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import {DeleteIcon, ViewIcon} from "@chakra-ui/icons";
import CroppedImageServices from "../../services/croppedImageServices";
import {useAuth} from "../../hooks/useAuth";
import LabelImageServices from "../../services/labelImageService";

export default function LabelImageManagement() {
    const [labelImages, setLabelImages] = useState<any[]>([]);
    const [species, setSpecies] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [labels, setLabels] = useState<any[]>([]);

    const user = useAuth().user;

    useEffect(() => {
        loadData();
        loadImages();
    }, []);


    const loadImages = () => {
        CroppedImageServices.getAll().then(res => {
            setLabelImages(res.data);
        });
        LabelImageServices.getAll().then(res => {
            setLabels(res.data);
        });
    };

    const loadData = () => {
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data);
        });
        AccountServices.getAll().then(res => {
            setUsers(res.data);
        });
    };

    const data = labelImages.map((m: any) => {
        m.labels = labels.filter((l: any) => l.imageId == m.imageId);
        let mostLabel = '';
        let mostLabelCount = 0;
        m.labels.forEach((l: any) => {
            var label = l.label;
            var count = m.labels.filter((l: any) => l.label == label).length;
            if (count > mostLabelCount) {
                mostLabel = label;
                mostLabelCount = count;
            }
        });
        return {
            url: m.imageURL,
            aiLabel: m.aiLabel,
            totalLabel: m.labels.length,
            mostLabel: mostLabel,
            mostLabelCount: mostLabelCount,
            date: m.createdTime,
            image: m
        }
    })

    const columns = [
        {
            Header: 'Media',
            accessor: 'url' as const,
            Cell: (props: any) => (
                <Image
                    src={props.value}
                    width={'70%'}
                    height={'75px'}
                    objectFit="cover"/>
            ),
            disableSortBy: true,
            disableFilters: true,
        },
        {
            Header: 'Labeled by AI',
            accessor: 'aiLabel' as const,
        },
        {
            Header: 'Most labeled',
            accessor: 'mostLabel' as const,
        },
        {
            Header: 'Most labeled count',
            accessor: 'mostLabelCount' as const,
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
        },
        {
            Header: 'Total label',
            accessor: 'totalLabel' as const,
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
        },
        {
            Header: 'Created date',
            accessor: 'date' as const,
            disableFilters: true,
            Cell: (props: any) => <>{(new Date(props.value)).toLocaleString()}</>
        },
        {
            id: 'edit-button',
            Cell: ({row}: { row: any }) =>
                <HStack spacing={2}>
                    <ImageViewer image={row.original.image} users={users}/>
                </HStack>,
        },
    ] as any;

    const sortBy = React.useMemo(
        () => [
            {
                id: 'date',
                desc: true,
            },
        ],
        [],
    ) as any


    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                Species Media
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

function ImageViewer({image, users}: { image: any, users: any[] }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<ViewIcon/>}
                        onClick={onOpen}></IconButton>

            <Modal isOpen={isOpen} onClose={onClose}
                   closeOnOverlayClick={false} size={'6xl'}
                   scrollBehavior={'inside'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{image?.species?.scientificName}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                            <Box height={['50vh', '50vh', '70vh']} bg={'black'}
                                 onClick={onOpen} alignContent={'center'}>
                                <Image
                                    height={'100%'}
                                    width={'100%'}
                                    objectFit={'contain'}
                                    src={image.imageURL}/>
                            </Box>
                            <Box height={['50vh', '50vh', '70vh']} overflow={'auto'}>
                                {image.labels.length == 0 && <Center height={'100%'} color={"gray.500"}>
                                    No labels yet
                                </Center>}
                                <Stack>
                                    {
                                        image.labels.map((l: any) => (
                                            <HStack>
                                                <Text>{l.label}</Text>
                                                <Text>-</Text>
                                                <Text>{users.filter(u => u.accountId == l.accountId).map(
                                                    u =>
                                                        <strong>{u.firstName + ' ' + (u.lastName ? u.lastName : '')}</strong>
                                                )}</Text>
                                            </HStack>
                                        ))
                                    }
                                </Stack>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
