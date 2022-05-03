import React, {useEffect} from 'react';
import {
    Badge, Box, Button,
    Container,
    Heading,
    HStack,
    IconButton,
    Image, Link,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import AccountServices from "../../services/accountServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import SpeciesMediaServices from "../../services/speciesMediaService";
import {DeleteIcon, ExternalLinkIcon, ViewIcon} from "@chakra-ui/icons";
import {Link as RouterLink} from "react-router-dom";

const mediaStatus = [
    {
        value: "1",
        label: "Pending"
    },
    {
        value: "2",
        label: "Accepted"
    },
    {
        value: "3",
        label: "Rejected"
    }
];


export default function SpeciesMediaManagement() {
    const [medias, setMedias] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);
    const [species, setSpecies] = React.useState<any[]>([]);

    useEffect(() => {
        loadData();
        loadMedia();
    }, []);


    const loadMedia = () => {
        SpeciesMediaServices.getAll().then(res => {
            setMedias(res.data);
        });
    }

    const loadData = () => {
        AccountServices.getAll().then(res => {
            setUsers(res.data);
        });
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data);
        });
    }

    const data = medias.map((d: any) => {
        d.species = species.find((s: any) => s.coralSpeciesId == d.coralSpeciesId);
        d.account = users.find((u: any) => u.accountId == d.createdBy);
        return {
            url: 'https://images.weserv.nl/?url=' + d.mediaURL,
            name: d.species ? d.species.scientificName : '',
            author: d.account ? d.account.firstName + ' ' + (d.account.lastName ? d.account.lastName : '') : '',
            status: mediaStatus.find((s: any) => s.value == d.status)?.label,
            date: d.createdTime,
            media: d
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
                accessor: 'name',
            },
            {
                Header: 'Author',
                accessor: 'author' as const,
            },
            {
                Header: 'Status',
                accessor: 'status' as const,
                Cell: ({cell}: { cell: any }) => (
                    <>
                        {cell.value == 'Pending' ? <Badge colorScheme={'blue'}>Pending</Badge> : ''}
                        {cell.value == 'Accepted' ? <Badge colorScheme={'green'}>Accepted</Badge> : ''}
                        {cell.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
                    </>
                ),
                Filter: OptionFilter,
                filter: 'includes',
                disableSortBy: true
            },
            {
                Header: 'Created date',
                accessor: 'date' as const,
                Cell: (props: any) => <>{(new Date(props.value)).toLocaleString()}</>,
                disableFilters: true,
            },
            {
                id: 'edit-button',
                Cell: ({row}: { row: any }) =>
                    <HStack spacing={2}>
                        <MediaViewer media={row.original.media} reload={loadMedia}/>
                        <DeleteMedia media={row.original.media} reload={loadMedia}/>
                    </HStack>,
            },
        ],
        [],
    ) as any

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

function MediaViewer({media, reload = () => {}}: { media: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const changeStatus = (status: number) => {
        media.status = status;
        SpeciesMediaServices.update(media).then(() => {
            onClose();
            reload();
        });
    }

    return (
        <>
            <IconButton aria-label='Delete' icon={<ViewIcon/>}
                        onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose}
                   closeOnOverlayClick={false} size={'6xl'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton/>
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                            <Box height={['50vh', '50vh', '70vh']} bg={'black'} alignContent={'center'}
                                 display={'flex'}>
                                <Image
                                    boxSize={'100%'}
                                    objectFit={'contain'}
                                    src={'https://images.weserv.nl/?url=' + media.mediaURL}/>
                            </Box>
                            <Box>
                                <Stack>
                                    <Text>
                                        <strong>Description: </strong>
                                        <em>
                                            {media?.caption}</em>
                                    </Text>
                                </Stack>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'blue'} mr={2} onClick={() => changeStatus(2)} disabled={media.status != 1}>
                            Accept
                        </Button>
                        <Button colorScheme={'red'} onClick={() => changeStatus(3)} disabled={media.status != 1}>
                            Reject
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

function DeleteMedia({media, reload = () => {}}: { media: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const deleteMedia = () => {
        SpeciesMediaServices.delete(media?.speciesMediaId).then(() => {
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
