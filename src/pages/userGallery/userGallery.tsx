import React, {useEffect} from "react";
import {
    Button,
    Container, FormControl, FormErrorMessage, FormLabel,
    Heading,
    HStack,
    IconButton, Input, Link,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, Stack,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useTable, useSortBy} from 'react-table'
import {useFormik} from "formik";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Datatable, {OptionFilter} from "../../components/datatable";
import AlbumServices from "../../services/albumServices";
import AreaServices from "../../services/areaServices";
import DivingSessionServices from "../../services/divingSessionServices";
import * as Yup from "yup";
import {useAuth} from "../../hooks/useAuth";

export default function UserGallery() {
    const [albums, setAlbums] = React.useState<any[]>([]);
    const [areas, setAreas] = React.useState<any[]>([]);
    const [sessions, setSessions] = React.useState<any[]>([]);
    const user = useAuth().user;

    useEffect(() => {
        loadOptions();
        loadAlbums();
    }, []);


    const loadAlbums = () => {
        AlbumServices.getByAuthor(user?.account?.accountId).then(response => {
            setAlbums(response.data);
        });
    }

    const loadOptions = () => {
        AreaServices.getAll().then(response => {
            setAreas(response.data);
        });
        DivingSessionServices.getAll().then(response => {
            setSessions(response.data);
        });
    }

    const data = albums.map((album: any) => {
        return {
            id: album.albumId,
            name: album.albumName,
            area: areas.find(area => area.areaId == album.areaId)?.areaName,
            session: sessions.find(session => session.divingSessionId == album.divingSessionId)?.divingSessionName,
            date: album.createdTime,
            album: album
        }
    });

    const columns = [
        {
            Header: 'Album',
            accessor: 'name' as const,
            Cell: ({row}: { row: any }) =>
                <Link as={RouterLink} color={'blue.500'} to={`${row.original.id}`}>{row.original.name}</Link>,
        },
        {
            Header: 'Area',
            accessor: 'area' as const,
            Filter: OptionFilter,
            filter: 'includes',
        },
        {
            Header: 'Session',
            accessor: 'session' as const,
            Filter: OptionFilter,
            filter: 'includes',
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
                    <AlbumForm album={row.original.album} areas={areas} sessions={sessions} reload={loadAlbums}/>
                    <AlbumDelete album={row.original.album} reload={loadAlbums}/>
                </HStack>,
        },
    ];

    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                My Gallery <AlbumForm areas={areas} sessions={sessions} reload={loadAlbums}/>
            </Heading>
            <Datatable columns={columns} data={data}/>
        </Container>
    );
}

const validationSchema = Yup.object({
    albumName: Yup.string()
        .required('Album name is required'),
    areaId: Yup.number()
        .required('Area is required'),
});

export function AlbumForm({
                              album, areas, sessions, reload = () => {
    }
                          }: { album?: any, areas: any[], sessions: any[], reload?: () => void }) {
    const user = useAuth().user;

    const {isOpen, onOpen, onClose} = useDisclosure()
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            albumId: album ? album.albumId : 0,
            accountId: user?.account?.accountId,
            albumName: album ? album.albumName : '',
            areaId: album ? album.areaId : '',
            divingSessionId: album ? album.divingSessionId : '',
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.isValid) {
                if (album) {
                    AlbumServices.update(values).then(() => {
                        onClose();
                        reload();
                    });
                } else {
                    AlbumServices.create(values).then(() => {
                        onClose();
                        reload();
                    });
                }
            }
        },
    })
    return (
        <>
            <IconButton aria-label='Add to friends' icon={album ? <EditIcon/> : <AddIcon/>} color={'#005A80'}
                        onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{album ? 'Edit album info' : 'New album'}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="albumName" isRequired
                                             isInvalid={Boolean(formik.touched?.albumName && formik.errors?.albumName)}>
                                    <FormLabel>Name</FormLabel>
                                    <Input value={formik.values.albumName} onChange={formik.handleChange}
                                           onBlur={formik.handleBlur} placeholder={'Album name'}/>
                                    <FormErrorMessage>{formik.errors.albumName}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="areaId" isRequired
                                             isInvalid={Boolean(formik.touched?.areaId && formik.errors?.areaId)}>
                                    <FormLabel>Area</FormLabel>
                                    <Select placeholder='Select option' value={formik.values.areaId}
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                formik.setFieldValue('divingSessionId', '');
                                            }}>
                                        {areas.map((area: any) => (
                                            <option key={area.areaId} value={area.areaId}>{area.areaName}</option>
                                        ))}
                                    </Select>
                                    <FormErrorMessage>{formik.errors.areaId}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="divingSessionId">
                                    <FormLabel>Diving Session</FormLabel>
                                    <Select placeholder='Select option' value={formik.values.divingSessionId}
                                            onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                        {
                                            sessions.map((session: any) => (
                                                session.areaId == formik.values.areaId ?
                                                    <option key={session.divingSessionId}
                                                            value={session.divingSessionId}>{session.divingSessionName}</option> : ''))
                                        }
                                    </Select>
                                    <FormErrorMessage>{formik.errors.divingSessionId}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'blue'} onClick={() => formik.handleSubmit()}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export function AlbumDelete({
                                album, reload = () => {
    }
                            }: { album?: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const deleteAlbum = () => {
        AlbumServices.remove(album.albumId).then(() => {
            onClose();
            reload();
        })
    }

    return (
        <>
            <IconButton aria-label='Add to friends' icon={<DeleteIcon/>} colorScheme={'red'}
                        onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Delete album</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this album?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'red'} onClick={() => deleteAlbum()}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
