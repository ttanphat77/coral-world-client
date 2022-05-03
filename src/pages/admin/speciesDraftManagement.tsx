import React, {useEffect} from 'react';
import {
    Badge, Box, Button,
    Container, Divider,
    Heading,
    HStack,
    IconButton, Image, Link, List, ListIcon, ListItem,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Slider, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Simulate} from "react-dom/test-utils";
import SpeciesDraftServices from "../../services/speciesDraftServices";
import AccountServices from "../../services/accountServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import {DeleteDraft} from "../contributeMangement/draftTable";
import {ExternalLinkIcon, ViewIcon} from "@chakra-ui/icons";
import {GrInherit, GrNotes} from "react-icons/gr";
import {Link as RouterLink} from "react-router-dom";
import {GiAlgae, GiDuality, GiFootprint, GiMeshNetwork} from "react-icons/gi";
import {IoIosColorFilter} from "react-icons/io";

const draftStatus = [
    {
        value: "1",
        label: "Pending"
    },
    {
        value: "2",
        label: "Published"
    },
    {
        value: "3",
        label: "Rejected"
    },
    {
        value: "4",
        label: "Overwritten"
    }
];


export default function SpeciesDraftManagement() {
    const [drafts, setDrafts] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);
    const [species, setSpecies] = React.useState<any[]>([]);

    useEffect(() => {
        loadData();
        loadDrafts();
    }, []);


    const loadDrafts = () => {
        SpeciesDraftServices.getAll().then(res => {
            setDrafts(res.data);
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

    const data = drafts.map((d: any) => {
        d.species = species.find((s: any) => s.coralSpeciesId == d.coralSpeciesId);
        d.account = users.find((u: any) => u.accountId == d.author);
        return {
            name: d.species ? d.species.scientificName + ' (' + d.species.authorCitation + ')' : '',
            author: d.account ? d.account.firstName + ' ' + (d.account.lastName ? d.account.lastName : '') : '',
            status: draftStatus.find((s: any) => s.value == d.status)?.label,
            date: d.createdTime,
            draft: d
        }
    })

    const columns = React.useMemo(
        () => [
            {
                Header: 'Species',
                accessor: 'draft',
                Cell: (props: any) =>
                    <Link as={RouterLink} to={'/taxonomy/' + props.value?.species?.coralSpeciesId} target={'_blank'}>
                        {props.value?.species?.scientificName} ({props.value?.species?.authorCitation}) <ExternalLinkIcon mx='2px'/>
                    </Link>
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
                        {cell.value == 'Published' ? <Badge colorScheme={'green'}>Published</Badge> : ''}
                        {cell.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
                        {cell.value == 'Overwritten' ? <Badge>Overwritten</Badge> : ''}
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
                        <ApproveDraft draft={row.original.draft} reload={loadDrafts}/>
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
                Species factsheet draft
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

function ApproveDraft({draft, reload}: { draft: any, reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const approveDraft = (status: any) => {
        SpeciesDraftServices.approve(draft.speciesDraftId, status).then(res => {
            onClose();
            reload();
        });
    }

    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<ViewIcon/>}
                        onClick={onOpen}></IconButton>

            <Modal isOpen={isOpen} onClose={onClose}
                   closeOnOverlayClick={false} size={'6xl'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Heading>{draft.species?.scientificName}</Heading>{draft.species?.authorCitation}
                        <ModalCloseButton/>
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={10}>
                            <Box>
                                <Text fontSize='3xl'>
                                    Current Information
                                </Text>
                                <Divider/>
                                <List fontSize={'lg'}>
                                    <ListItem>
                                        <ListIcon as={GiFootprint}/>
                                        <span>
                                        <strong>Characters: </strong>
                                        <em>{draft.species?.characters}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosColorFilter}/>
                                        <span>
                                        <strong>Color: </strong>
                                        <em>{draft.species?.color}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiDuality}/>
                                        <span>
                                        <strong>Similar Species: </strong>
                                        <em>{draft.species?.similarSpecies}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiAlgae}/>
                                        <span>
                                        <strong>Habitat: </strong>
                                        <em>{draft.species?.habitat}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiMeshNetwork}/>
                                        <span>
                                        <strong>Abundance: </strong>
                                        <em>{draft.species?.abundance}</em>
                                    </span>
                                    </ListItem>
                                    <br/>
                                    <ListItem>
                                        <ListIcon as={GrNotes}/>
                                        <span>
                                        <strong>Taxonomic Note: </strong>
                                        <em>{draft.species?.note}</em>
                                    </span>
                                    </ListItem>
                                </List>
                            </Box>
                            <Box>
                                <Text fontSize='3xl'>
                                    Update draft by <em>{draft.account?.firstName + ' ' + (draft.account?.lastName || '')}</em>
                                </Text>
                                <Divider/>
                                <List fontSize={'lg'}>
                                    <ListItem>
                                        <ListIcon as={GiFootprint}/>
                                        <span>
                                        <strong>Characters: </strong>
                                        <em>{draft.characters}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosColorFilter}/>
                                        <span>
                                        <strong>Color: </strong>
                                        <em>{draft.color}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiDuality}/>
                                        <span>
                                        <strong>Similar Species: </strong>
                                        <em>{draft.similarSpecies}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiAlgae}/>
                                        <span>
                                        <strong>Habitat: </strong>
                                        <em>{draft.habitat}</em>
                                    </span>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={GiMeshNetwork}/>
                                        <span>
                                        <strong>Abundance: </strong>
                                        <em>{draft.abundance}</em>
                                    </span>
                                    </ListItem>
                                    <br/>
                                    <ListItem>
                                        <ListIcon as={GrNotes}/>
                                        <span>
                                        <strong>Taxonomic Note: </strong>
                                        <em>{draft.note}</em>
                                    </span>
                                    </ListItem>
                                </List>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'blue'} mr={2} onClick={() => approveDraft(2)}
                                disabled={draft.status != 1}>
                            Accept
                        </Button>
                        <Button colorScheme={'red'} onClick={() => approveDraft(3)}
                                disabled={draft.status != 1} >
                            Reject
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
        ;
}
