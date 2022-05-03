import React, {useEffect, useState} from 'react';
import {
    Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Image, IconButton, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, SimpleGrid,
    Box, Stack, FormControl, FormLabel, Flex, Spacer, Button, useDisclosure, Select, Text,
} from "@chakra-ui/react";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import Datatable from "../../components/datatable";
import {ViewIcon} from '@chakra-ui/icons';
import CroppedImageServices from "../../services/croppedImageServices";
import {useFormik} from "formik";
import {useAuth} from "../../hooks/useAuth";
import AccountServices from "../../services/accountServices";
import LabelImageServices from "../../services/labelImageService";

export default function ImageLabeling() {
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
        m.myLabel = labels.find((l: any) => l.imageId == m.imageId && l.accountId == user.account.accountId);

        return {
            url: m.imageURL,
            aiLabel: m.aiLabel,
            myLabel: m.myLabel ? m.myLabel.label : '',
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
            Header: 'My label',
            accessor: 'myLabel' as const,
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
                    <ImageLabel image={row.original.image} species={species} labels={labels} reload={loadImages}/>
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
                Label coral images
            </Heading>

            <Datatable columns={columns} data={data} sortBy={sortBy}/>
        </Container>
    );
}

function ImageLabel({image, species, labels, reload}: { image: any, species: any[], labels: any[], reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const user = useAuth().user;
    const formik = useFormik({
        initialValues: {
            label: image.myLabel ? image.myLabel.label : '',
        },
        onSubmit: (values) => {
            if (image.myLabel) {
                LabelImageServices.update({
                    label: values.label,
                    accountId: user?.account?.accountId,
                    imageId: image.imageId,
                    imageAccountId: image.myLabel.imageAccountId,
                }).then(() => {
                    reload();
                    onClose();
                });
            } else {
                LabelImageServices.create({
                    label: values.label,
                    accountId: user?.account?.accountId,
                    imageId: image.imageId,
                }).then(() => {
                    reload();
                    onClose();
                });
            }
        },
    })

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
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack>
                                        <FormControl id="label">
                                            <FormLabel>Label</FormLabel>
                                            <Select placeholder='Select label' value={formik.values.label}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}>
                                                {species.map((spe: any) => (
                                                    <option key={spe.coralSpeciesId}
                                                            value={spe.scientificName}>{spe.scientificName}</option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Flex>
                                            <Spacer/>
                                            <Button colorScheme='blue' type={'submit'}
                                                    disabled={formik.values.label == 'Undefined'}>
                                                Save
                                            </Button>
                                        </Flex>
                                    </Stack>
                                </form>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
