import React, {useEffect} from "react";
import {
    Badge, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel,
    HStack,
    IconButton, Image,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select, SimpleGrid, Spacer, Stack, Text, Textarea,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Form, useFormik} from "formik";
import {AddIcon, DeleteIcon, EditIcon, ViewIcon} from "@chakra-ui/icons";
import SpeciesMediaServices from "../../services/speciesMediaService";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import {useAuth} from "../../hooks/useAuth";

const mediaStatus = [
    {
        label: "Pending",
        value: "1"
    },
    {
        label: "Accepted",
        value: "2"
    },
    {
        label: "Rejected",
        value: "3"
    }
];

export default function MediaContributeTable() {
    const user = useAuth().user;
    const [medias, setMedias] = React.useState<any[]>([]);
    const [species, setSpecies] = React.useState<any[]>([]);

    useEffect(() => {
        loadMedia();
        loadSpecies();
    }, []);


    const loadMedia = () => {
        SpeciesMediaServices.getByAuthor(user?.account?.accountId).then(res => {
            setMedias(res.data)
        })
    }

    const loadSpecies = () => {
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data)
        })
    }

    const data = medias.map((m: any) => {
        const draftSpecies = species.find(s => s.coralSpeciesId === m.coralSpeciesId)
        m.species = draftSpecies ? draftSpecies : null;
        return {
            url: 'https://images.weserv.nl/?url=' + m.mediaURL,
            species: draftSpecies ? draftSpecies.scientificName  + ' (' + draftSpecies.authorCitation + ')': '',
            status: mediaStatus.find(s => s.value == m.status)?.label,
            date: m.createdTime,
            media: m
        }
    })

    const columns = React.useMemo(
        () => [
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
                Header: 'Species',
                accessor: 'species' as const,
            },
            {
                Header: 'Status',
                accessor: 'status' as const,
                Cell: (props: any) => (
                    <>
                        {props.value == 'Pending' ? <Badge  colorScheme={'blue'}>Pending</Badge> : ''}
                        {props.value == 'Accepted' ? <Badge colorScheme={'green'}>Accepted</Badge> : ''}
                        {props.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
                    </>
                ),
                Filter: OptionFilter,
                filter: 'includes',
                disableSortBy: true
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
                        <MediaViewer media={row.original.media}/>
                        <DeleteMedia media={row.original.media} reload={loadMedia}/>
                    </HStack>,
            },
        ],
        [],
    ) as any;

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
        <>
            <Datatable columns={columns} data={data} sortBy={sortBy}/>
        </>
    )

}

function MediaViewer({media}: { media: any }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            caption: media.caption,
        },
        onSubmit: (values) => {
            media.caption = values.caption;
            SpeciesMediaServices.update(media).then(() => {
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
                    <ModalHeader>{media?.species?.scientificName}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                            <Box height={['50vh', '50vh', '70vh']} bg={'black'}
                                 onClick={onOpen} alignContent={'center'}>
                                <Image
                                    height={'100%'}
                                    width={'100%'}
                                    objectFit={'contain'}
                                    src={'https://images.weserv.nl/?url=' + media?.mediaURL}/>
                            </Box>
                            <Box>
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack>
                                        <FormControl id="caption">
                                            <FormLabel>Description</FormLabel>
                                            <Textarea value={formik.values.caption}
                                                      onChange={formik.handleChange}
                                                      onBlur={formik.handleBlur}
                                                      name="caption"
                                                      id="caption"
                                                      readOnly={media.status != 1}
                                                      placeholder="Enter description"/>
                                        </FormControl>
                                        <Flex>
                                            <Spacer/>
                                            <Button colorScheme='blue' type={'submit'} disabled={media.status != 1}>
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

function DeleteMedia({media, reload = () => {}}: { media: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const deleteMedia = () => {
        SpeciesMediaServices.delete(media.speciesMediaId).then(() => {
            onClose();
            reload();
        })
    }

    return (
        <>
            <IconButton aria-label='Delete' icon={<DeleteIcon/>} colorScheme={'red'}
                        onClick={onOpen}/>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Delete media</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this media?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'red'} mr={3} onClick={() => deleteMedia()}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
