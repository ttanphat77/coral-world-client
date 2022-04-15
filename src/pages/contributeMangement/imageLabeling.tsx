import React, {useEffect, useState} from 'react';
import {
    Container,
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    HStack,
    Link,
    Image,
    Badge,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    SimpleGrid,
    Box,
    Stack,
    FormControl,
    FormLabel, Textarea, Flex, Spacer, Button, useDisclosure, Select, Text,
} from "@chakra-ui/react";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Link as RouterLink} from 'react-router-dom';
import CoralGenusServices from "../../services/coralGenusServices";
import {ExternalLinkIcon, ViewIcon} from '@chakra-ui/icons';
import DraftTable from "./draftTable";
import MediaContributeTable from "./mediaContributeTable";
import CroppedImageServices from "../../services/croppedImageServices";
import {useFormik} from "formik";
import SpeciesMediaServices from "../../services/speciesMediaService";
import {useAuth} from "../../hooks/useAuth";
import AccountServices from "../../services/accountServices";

export default function ImageLabeling() {
    const [labelImages, setLabelImages] = useState<any[]>([]);
    const [species, setSpecies] = useState<any[]>([]);
    const [verifyImages, setVerifyImages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const user = useAuth().user;

    useEffect(() => {
        loadData();
        loadImages();
    }, []);


    const loadImages = () => {
        CroppedImageServices.getAll().then(res => {
            const images = res.data.reverse();
            setLabelImages([]);
            setLabelImages(images.filter((image: any) => image.status == 1));
            setVerifyImages([]);
            setVerifyImages(images.filter((image: any) => image.status == 2 && image.labeledBy != user.account?.accountId));
        });
    };

    const loadData = () =>{
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data);
        });
        AccountServices.getAll().then(res => {
            setUsers(res.data);
        });
    };


    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                Label coral images
            </Heading>
            <Tabs>
                <TabList>
                    <Tab>Suggest label</Tab>
                    <Tab>Verify label</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <LabelingTable images={labelImages} species={species} reload={loadImages}/>
                    </TabPanel>
                    <TabPanel>
                        <VerifyingTable images={verifyImages} users={users} reload={loadImages}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

function LabelingTable ({images, species, reload} : {images: any[], species: any[], reload: () => void}) {

    const data = images.map((m: any) => {
        return {
            url: m.imageURL,
            // date: m.createdTime,
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
                id: 'edit-button',
                Cell: ({row}: { row: any }) =>
                    <HStack spacing={2}>
                        <ImageLabel image={row.original.image} species={species} reload={reload}/>
                    </HStack>,
            },
        ] as any;

    return  <Datatable columns={columns} data={data}/>
}

function ImageLabel({image, species, reload}: { image: any, species: any[], reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const user = useAuth().user;
    const formik = useFormik({
        initialValues: {
            label: image.label,
        },
        onSubmit: (values) => {
            image.label = values.label;
            image.status = 2;
            image.labeledBy = user?.account?.accountId;
            CroppedImageServices.update(image).then(() => {
                reload();
                onClose();
            })
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
                                            <Select placeholder='Select label' value={formik.values.label} onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}>
                                                {species.map((spe: any) => (
                                                    <option key={spe.coralSpeciesId} value={spe.scientificName}>{spe.scientificName}</option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Flex>
                                            <Spacer/>
                                            <Button colorScheme='blue' type={'submit'} disabled={formik.values.label == 'Undefined'}>
                                                Submit
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

function VerifyingTable ({images, users, reload}: { images: any, users: any[], reload: () => void }) {

    const data = images.map((m: any) => {
        m.user = users.find((u: any) => u.accountId == m.labeledBy);
        return {
            url: m.imageURL,
            label: m.label,
            labelBy: m.user ? m.user?.firstName + ' ' + m.user?.lastName : '',
            // date: m.createdTime,
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
            Header: 'Label',
            accessor: 'label' as const,
        },
        {
            Header: 'Label by',
            accessor: 'labelBy' as const,
        },
        {
            id: 'edit-button',
            Cell: ({row}: { row: any }) =>
                <HStack spacing={2}>
                    <LabelVerify image={row.original.image} reload={reload}/>
                </HStack>,
        },
    ] as any;

    return  <Datatable columns={columns} data={data}/>
}


function LabelVerify({image, reload}: { image: any, reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const user = useAuth().user;

    const changeStatus = (status: number) => {
        image.status = status;
        image.verifiedBy = user?.account?.accountId;
        image.label = status == 1 ? 'Undefined' : image.label;
        CroppedImageServices.update(image).then(() => {
            reload();
        })
    }

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
                                            {image?.label}</em>
                                    </Text>
                                    <Text>
                                        <strong>By: </strong>
                                        <em>
                                            {image.user?.firstName + ' ' + image.user?.lastName}</em>
                                    </Text>
                                    <Flex>
                                        <Spacer/>
                                        <Button colorScheme='blue' type={'submit'} mr={2} onClick={() => changeStatus(3)}>
                                            Verify
                                        </Button>
                                        <Button colorScheme='red' type={'submit'} onClick={() => changeStatus(1)}>
                                            Reject
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
