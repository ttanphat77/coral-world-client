import React, {useEffect} from 'react';
import {
    Badge, Box, Button,
    Container, Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Spacer, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import AccountServices from "../../services/accountServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import SpeciesMediaServices from "../../services/speciesMediaService";
import {DeleteIcon, ViewIcon} from "@chakra-ui/icons";
import CroppedImageServices from "../../services/croppedImageServices";
import {useAuth} from "../../hooks/useAuth";

const imageStatus = [
    {
        value: "1",
        label: "Undefined"
    },
    {
        value: "2",
        label: "Labeled"
    },
    {
        value: "3",
        label: "Verified"
    }
];


export default function LabelImageManagement() {
    const [images, setImages] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);

    useEffect(() => {
        loadData();
        loadImages();
    }, []);


    const loadImages = () => {
        CroppedImageServices.getAll().then(res => {
            setImages(res.data.reverse());
        });
    }

    const loadData = () => {
        AccountServices.getAll().then(res => {
            setUsers(res.data);
        });
    }

    const data = images.map((m: any) => {
        m.labeledByAccount = users.find((u: any) => u.accountId == m.labeledBy);
        m.verifiedByAccount = users.find((u: any) => u.accountId == m.verifiedBy);
        return {
            url: m.imageURL,
            label: m.status != 1 ? m.label : '',
            status: imageStatus.find((s: any) => s.value == m.status)?.label,
            labeledBy: m.status == 1 ? '' : (m.labeledByAccount ? m.labeledByAccount.firstName + ' ' + (m.labeledByAccount.lastName ? m.labeledByAccount.lastName : '') : ''),
            verifiedBy: m.status == 3 ? (m.verifiedByAccount ? m.verifiedByAccount.firstName + ' ' + (m.verifiedByAccount.lastName ? m.verifiedByAccount.lastName : '') : '') : '',
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
                        boxSize="50px"
                        objectFit="cover"/>
                ),
                disableSortBy: true,
                disableFilters: true,
            },
            {
                Header: 'Label',
                accessor: 'label' as const,
            },
            {
                Header: 'Status',
                accessor: 'status' as const,
                Cell: ({cell}: { cell: any }) => (
                    <>
                        {cell.value == 'Undefined' ? <Badge>Undefined</Badge> : ''}
                        {cell.value == 'Labeled' ? <Badge colorScheme={'yellow'}>Labeled</Badge> : ''}
                        {cell.value == 'Verified' ? <Badge colorScheme={'green'}>Verified</Badge> : ''}
                    </>
                ),
                Filter: OptionFilter,
                filter: 'includes',
                disableSortBy: true
            },
            {
                Header: 'Labeled by',
                accessor: 'labeledBy' as const,
            },
            {
                Header: 'Verified by',
                accessor: 'verifiedBy' as const,
            },
            {
                id: 'edit-button',
                Cell: ({row}: { row: any }) =>
                    <HStack spacing={2}>
                        <ImageViewer image={row.original.image}/>
                        {/*<MediaViewer media={row.original.media} reload={loadMedia}/>*/}
                        {/*<DeleteMedia media={row.original.media} reload={loadMedia}/>*/}
                    </HStack>,
            },
        ] as any

    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                Species Media
            </Heading>
            <Datatable data={data} columns={columns}/>
        </Container>
    );
}

function ImageViewer({image}: { image: any}) {
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
                            <Box>
                                <Stack>
                                    <Text>
                                        <strong>Label: </strong>
                                        <em>
                                            {image.status == 1 ? 'Undefined' : image?.label}</em>
                                    </Text>
                                    {
                                        image.status > 1 &&
                                        <Text>
                                            <strong>Labeled by: </strong>
                                            <em>
                                                {image.labeledByAccount?.firstName + ' ' + image.labeledByAccount?.lastName || ''}</em>
                                        </Text>
                                    }
                                    {
                                        image.status == 3 &&
                                        <Text>
                                            <strong>Verified by: </strong>
                                            <em>
                                                {image.verifiedByAccount?.firstName + ' ' + image.labeledByAccount?.lastName || ''}</em>
                                        </Text>
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
