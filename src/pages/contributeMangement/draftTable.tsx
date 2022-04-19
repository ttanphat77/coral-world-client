import React, { useEffect } from "react";
import {
    Badge, Button, FormControl, FormErrorMessage, FormLabel,
    HStack,
    IconButton,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select, Stack, Text, Textarea,
    useDisclosure
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {useFormik} from "formik";
import {DeleteIcon, EditIcon, ViewIcon} from "@chakra-ui/icons";
import SpeciesDraftServices from "../../services/speciesDraftServices";
import CoralGenusServices from "../../services/coralGenusServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import SpeciesMediaServices from "../../services/speciesMediaService";
import {useAuth} from "../../hooks/useAuth";

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

export default function DraftTable() {
    const user = useAuth().user;
    const [drafts, setDrafts] = React.useState<any[]>([]);
    const [species, setSpecies] = React.useState<any[]>([]);

    useEffect(() => {
        loadDraft()
        loadSpecies()
    }, []);


    const loadDraft = () => {
        SpeciesDraftServices.getByAuthor(user?.account.accountId).then(res => {
            setDrafts(res.data);
        });
    };

    const loadSpecies = () => {
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data);
        });
    };


    const data = drafts.map((d: any) => {
        const draftSpecies = species.find((s: any) => s.coralSpeciesId === d.coralSpeciesId);
        d.species = draftSpecies
        return {
            name: draftSpecies ? draftSpecies.scientificName  + ' (' + draftSpecies.authorCitation + ')': '',
            status: draftStatus.find((s: any) => s.value == d.status)?.label,
            date: d.createdTime,
            draft: d
        }
    })

    const columns = React.useMemo(
        () => [
            {
                Header: 'Species',
                accessor: 'name' as const,
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
                        <EditDraft draft={row.original.draft} reload={loadDraft}/>
                        <DeleteDraft draft={row.original.draft} reload={loadDraft}/>
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
        <>
            <Datatable columns={columns} data={data} sortBy={sortBy}/>
        </>
    )

}

function EditDraft({draft, reload = () => {}}: { draft: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            coralSpeciesId: draft.coralSpeciesId,
            speciesDraftId: draft.speciesDraftId,
            author: draft.author,
            status: draft.status,
            characters: draft.characters ? draft.characters : '',
            color: draft.color ? draft.color : '',
            similar: draft.similar ? draft.similar : '',
            habitat: draft.habitat ? draft.habitat : '',
            abundance: draft.abundance ? draft.abundance : '',
            taxonomic_note: draft.taxonomic_note? draft.taxonomic_note : '',
        },
        onSubmit: (values) => {
            SpeciesDraftServices.update(values).then(() => {
                onClose();
                reload();
            })
        },
    });

    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<ViewIcon/>} onClick={onOpen}></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={'3xl'} color={'#005A80'} fontWeight={'bold'}>{draft?.species?.scientificName}</Text>
                        {draft?.species?.authorCitation}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form>
                            <Stack spacing={4} mt={4}>
                                <FormControl id="characters">
                                    <FormLabel>Characters</FormLabel>
                                    <Textarea value={formik.values.characters}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="characters"
                                              id="characters"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter characters"/>
                                    <FormErrorMessage>{formik.errors.characters}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="color">
                                    <FormLabel>Color</FormLabel>
                                    <Textarea value={formik.values.color}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="color"
                                              id="color"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter color"/>
                                    <FormErrorMessage>{formik.errors.color}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="similar">
                                    <FormLabel>Similar</FormLabel>
                                    <Textarea value={formik.values.similar}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="similar"
                                              id="similar"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter similar"/>
                                    <FormErrorMessage>{formik.errors.similar}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="habitat">
                                    <FormLabel>Habitat</FormLabel>
                                    <Textarea value={formik.values.habitat}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="habitat"
                                              id="habitat"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter habitat"/>
                                    <FormErrorMessage>{formik.errors.habitat}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="abundance">
                                    <FormLabel>Abundance</FormLabel>
                                    <Textarea value={formik.values.abundance}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="abundance"
                                              id="abundance"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter abundance"/>
                                    <FormErrorMessage>{formik.errors.abundance}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="note">
                                    <FormLabel>Taxonomy note</FormLabel>
                                    <Textarea value={formik.values.taxonomic_note}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="note"
                                              id="note"
                                              readOnly={draft.status != 1}
                                              placeholder="Enter taxonomy note"/>
                                    <FormErrorMessage>{formik.errors.taxonomic_note}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={'blue'} onClick={() => formik.handleSubmit()} disabled={draft.status != 1}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export function DeleteDraft({draft, reload = () => {}}: { draft: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const deleteDraft = () => {
        SpeciesDraftServices.delete(draft.speciesDraftId).then(() => {
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
                    <ModalHeader>Delete draft</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this draft?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'red'} mr={3} onClick={() => deleteDraft()}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
