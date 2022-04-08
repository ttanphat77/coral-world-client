import React from 'react';
import {
    chakra, Container, Heading, HStack, Link, Table, Tbody, Td,
    Th, Thead, Tr, Tabs, TabList, TabPanels, Tab, TabPanel,
    Badge, useDisclosure, IconButton, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    Stack, FormControl, FormLabel, Input, FormErrorMessage, Select,
    ModalFooter, Button, Text, Textarea, NumberInputStepper,
    NumberDecrementStepper, Flex, NumberInputField, NumberInput,
    NumberIncrementStepper, Tooltip, Box
} from "@chakra-ui/react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {useFilters, usePagination, useSortBy, useTable} from "react-table";
import {
    AddIcon,
    ArrowLeftIcon,
    ArrowRightIcon, ChevronLeftIcon,
    ChevronRightIcon,
    EditIcon,
    TriangleDownIcon,
    TriangleUpIcon
} from "@chakra-ui/icons";
import {AlbumDelete, AlbumForm} from "../userGallery/userGallery";
import {useFormik} from "formik";
import Datatable from "../../components/Datatable";

export default function UserContribution() {
    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                My Contribution
            </Heading>
            <Tabs>
                <TabList>
                    <Tab>Factsheet</Tab>
                    <Tab>Media</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <DraftTable/>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

function DraftTable() {
    const drafts = [
        {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Submitted",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Approved",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        }, {
            status: "Draft",
            date: "2020-01-01",
            characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
            color: 'Usually pale grey, brown or rust coloured, often mottled.',
            similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
            habitat: 'Lower reef slopes protected from wave action.',
            abundance: 'Rare except in subtropical localities of eastern Australia.',
            taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
            coral: {
                name: 'Acropora abrolhosensis',
                author: 'Veron, 1985',
            }
        },]
    const data = React.useMemo(
        () => drafts,
        [],
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Species',
                accessor: 'coral.name' as const,
            },
            {
                Header: 'Status',
                accessor: 'status' as const,
                Cell: ({cell}: { cell: any }) => (
                    <>
                        {/*{row === 'Draft' ? <TriangleDownIcon/> : <TriangleUpIcon/>}*/}
                        {cell.value == 'Draft' ? <Badge>Draft</Badge> : ''}
                        {cell.value == 'Approved' ? <Badge colorScheme={'green'}>Approved</Badge> : ''}
                        {cell.value == 'Submitted' ? <Badge colorScheme={'blue'}>Submitted</Badge> : ''}
                    </>
                ),
                Filter: DraftStatusFilter,
                filter: 'includes',
                disableSortBy: true
            },
            {
                Header: 'Created date',
                accessor: 'date' as const,
                disableFilters: true,
            },
            {
                id: 'edit-button',
                Cell: ({row}: { row: any }) =>
                    <HStack spacing={2}>
                        <EditDraft draft={row.original}/>
                    </HStack>,
            },
        ],
        [],
    ) as any

    return (
        <>
            <Datatable columns={columns} data={data}/>
        </>
    )

}

function DraftStatusFilter({column: {filterValue, setFilter, preFilteredRows, id},}: any) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options: any = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <Select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option: any, i: number) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    )
}

function EditDraft({draft, reload = () => {}}: { draft: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            characters: draft.characters,
            color: draft.color,
            similar: draft.similar,
            habitat: draft.habitat,
            abundance: draft.abundance,
            taxonomic_note: draft.taxonomic_note,
        },
        onSubmit: (values) => {
            console.log(values);
            onClose();
        },
    });

    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<EditIcon/>} onClick={onOpen}
                        size={'sm'}></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={'3xl'} color={'#005A80'} fontWeight={'bold'}>{draft.coral.name}</Text>
                        {draft.coral.author}
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
                                              placeholder="Enter taxonomy note"/>
                                    <FormErrorMessage>{formik.errors.taxonomic_note}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#005A80' color={'white'} mr={3} onClick={() => formik.handleSubmit}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

