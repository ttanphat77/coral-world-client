import React, {useEffect, useState} from "react";
import {
    Badge, Button,
    Container, FormControl, FormErrorMessage, FormLabel,
    Heading,
    HStack,
    IconButton, Input, Link,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, Stack, Text, Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {AddIcon, DeleteIcon, EditIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import CoralGenusServices from "../../services/coralGenusServices";
import {Link as RouterLink} from "react-router-dom";

export default function SpeciesManagement() {
    const [speciesList, setSpeciesList] = useState<any[]>([]);
    const [genusList, setGenusList] = useState<any[]>([]);


    useEffect(() => {
        load()
    }, []);

    const load = () => {
        CoralSpeciesServices.getAll().then((res: any) => {
            setSpeciesList(res.data);
        });
        CoralGenusServices.getAll().then((res: any) => {
            setGenusList(res.data);
        });
    };

    const data = speciesList.map((s: any) => {
        return {
            name: s.scientificName,
            genus: genusList.find((g: any) => g.coralGenusId === s.parentId)?.scientificName ?? "",
            author: s.authorCitation,
            date: s.createdTime,
            coral: s
        }
    })

    const columns = [
        {
            Header: 'Name',
            accessor: 'coral',
            Cell: (props: any) =>
                <Link as={RouterLink} to={'/taxonomy/' + props.value.coralSpeciesId} target={'_blank'}>
                    {props.value.scientificName} ({props.value.authorCitation}) <ExternalLinkIcon mx='2px'/>
                </Link>
        },
        {
            Header: 'Author citation',
            accessor: 'author' as const,
        },
        {
            Header: 'Genus',
            accessor: 'genus' as const,
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
                    <CoralForm coral={row.original.coral} genus={genusList} reload={load}/>
                    <DeleteCoral coral={row.original.coral} reload={load}/>
                </HStack>,
        },
    ] as any

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
                Species <CoralForm genus={genusList} reload={load}/>
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

const validationSchema = Yup.object({
    scientificName: Yup.string()
        .required('Scientific name is required'),
    parentId: Yup.number()
        .required('Genus is required'),
    authorCitation: Yup.string()
        .required('Author citation is required'),
});

function CoralForm({coral, genus, reload}: { coral?: any, genus: any[], reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            coralSpeciesId: coral ? coral.coralSpeciesId : 0,
            scientificName: coral && coral.scientificName ? coral.scientificName : '',
            authorCitation: coral && coral.authorCitation ? coral.authorCitation : '',
            parentId: coral ? coral.parentId : '',
            characters: coral && coral.characters ? coral.characters : '',
            color: coral && coral.color ? coral.color : '',
            habitat: coral && coral.habitat ? coral.habitat : '',
            abundance: coral && coral.abundance ? coral.abundance : '',
            similarSpecies: coral && coral.similarSpecies ? coral.similarSpecies : '',
            notes: coral && coral.notes ? coral.notes : '',
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.isValid) {
                if (values.coralSpeciesId === 0) {
                    CoralSpeciesServices.create(values).then(() => {
                        reload();
                        onClose();
                    });
                } else {
                    CoralSpeciesServices.update(values).then(() => {
                        reload();
                        onClose();
                    });
                }
            }
        },
    })
    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={coral ? <EditIcon/> : <AddIcon/>}
                        onClick={onOpen}></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        {coral ? 'Edit coral species' : 'New coral species'}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form>
                            <Stack spacing={4} mt={4}>
                                <FormControl id="scientificName" isRequired
                                             isInvalid={Boolean(formik.touched?.scientificName && formik.errors?.scientificName)}>
                                    <FormLabel htmlFor="scientificName">Scientific name</FormLabel>
                                    <Input id="scientificName" name="scientificName"
                                           value={formik.values.scientificName}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           placeholder={'Enter scientific name'}/>
                                    <FormErrorMessage>
                                        {formik.errors?.scientificName}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl id="authorCitation" isRequired
                                             isInvalid={Boolean(formik.touched?.authorCitation && formik.errors?.authorCitation)}>
                                    <FormLabel htmlFor="authorCitation">Author citation</FormLabel>
                                    <Input id="authorCitation" name="authorCitation"
                                           value={formik.values.authorCitation}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           placeholder={'Enter author citation'}/>
                                    <FormErrorMessage>
                                        {formik.errors?.authorCitation}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl id={'parentId'} isRequired
                                             isInvalid={Boolean(formik.touched?.parentId && formik.errors?.parentId)}>
                                    <FormLabel htmlFor={'parentId'}>Parent</FormLabel>
                                    <Select id={'parentId'} name={'parentId'}
                                            value={formik.values.parentId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}>
                                        <option value={''}>None</option>
                                        {genus.map((g: any) =>
                                            <option key={g.coralGenusId}
                                                    value={g.coralGenusId}>{g.scientificName}</option>
                                        )}
                                    </Select>
                                    <FormErrorMessage>
                                        {formik.errors?.parentId}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl id="characters">
                                    <FormLabel>Characters</FormLabel>
                                    <Textarea value={formik.values.characters}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="characters"
                                              id="characters"
                                              placeholder="Enter characters"/>
                                </FormControl>
                                <FormControl id="color">
                                    <FormLabel>Color</FormLabel>
                                    <Textarea value={formik.values.color}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="color"
                                              id="color"
                                              placeholder="Enter color"/>
                                </FormControl>
                                <FormControl id="similar">
                                    <FormLabel>Similar</FormLabel>
                                    <Textarea value={formik.values.similarSpecies}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="similar"
                                              id="similar"
                                              placeholder="Enter similar"/>
                                </FormControl>
                                <FormControl id="habitat">
                                    <FormLabel>Habitat</FormLabel>
                                    <Textarea value={formik.values.habitat}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="habitat"
                                              id="habitat"
                                              placeholder="Enter habitat"/>
                                </FormControl>
                                <FormControl id="abundance">
                                    <FormLabel>Abundance</FormLabel>
                                    <Textarea value={formik.values.abundance}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="abundance"
                                              id="abundance"
                                              placeholder="Enter abundance"/>
                                </FormControl>
                                <FormControl id="note">
                                    <FormLabel>Taxonomy note</FormLabel>
                                    <Textarea value={formik.values.notes}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="note"
                                              id="note"
                                              placeholder="Enter taxonomy note"/>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={() => formik.handleSubmit()}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export function DeleteCoral({
                                coral, reload = () => {
    }
                            }: { coral: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const deleteCoral = () => {
        CoralSpeciesServices.delete(coral.coralSpeciesId).then(() => {
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
                    <ModalHeader>Delete species</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this coral species?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'red'} onClick={() => deleteCoral()}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
