import React from "react";
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
import {Table, Thead, Tbody, Tr, Th, Td, chakra} from '@chakra-ui/react'
import {TriangleDownIcon, TriangleUpIcon} from '@chakra-ui/icons'
import {useTable, useSortBy} from 'react-table'
import {useFormik} from "formik";
import {Link as RouterLink, useNavigate} from "react-router-dom";

export default function UserGallery() {
    return (
        <Container maxW={"container.xl"} p={8}>
            <Heading as='h2' size='xl'>
                My Gallery <AlbumForm/>
            </Heading>
            <AlbumTable/>
        </Container>
    );
}

function AlbumTable() {
    const data = React.useMemo(
        () => [
            {
                name: 'First album',
                area: 'First album',
                session: 25.4,
                date: '2020-01-01',
            },
            {
                name: 'Second album',
                area: 'Second album',
                session: 30.48,
                date: '2020-01-02',
            },
            {
                name: 'Second album',
                area: 'Thir',
                session: 0.91444,
                date: '2020-01-03',
            },
        ],
        [],
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Album',
                accessor: 'name' as const,
                Cell: ({row}: { row: any }) =>
                    <Link as={RouterLink} color={'blue.500'} to={`${row.original.id}`}>{row.original.name}</Link>,
            },
            {
                Header: 'Area',
                accessor: 'area' as const,
            },
            {
                Header: 'Session',
                accessor: 'session' as const,
            },
            {
                Header: 'Created date',
                accessor: 'date' as const,
            },
            {
                id: 'edit-button',
                Cell: ({row}: { row: any }) =>
                    <HStack spacing={2}>
                        <AlbumForm album={row.original}/>
                        <AlbumDelete album={row.original}/>
                    </HStack>,
            },
        ],
        [],
    )

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data}, useSortBy);
    const navigate = useNavigate();

    return (
        <Table {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                            >
                                {column.render('Header')}
                                <chakra.span pl='4'>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label='sorted descending'/>
                                        ) : (
                                            <TriangleUpIcon aria-label='sorted ascending'/>
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)
                    // @ts-ignore
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}


export function AlbumForm({ album, reload = () => {}}: { album?: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const formik = useFormik({
        initialValues: {
            name: album ? album.name : '',
            area: album ? album.area : '',
            session: album ? album.session : '',
            date: album ? album.date : '',
        },
        onSubmit: (values) => {
            console.log(values);
            reload();
        },
    })
    return (
        <>
            <IconButton aria-label='Add to friends' icon={album ? <EditIcon/> : <AddIcon/>} color={'#005A80'}
                        onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{album ? 'Edit album info' : 'New album'}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form>
                            <Stack spacing={4}>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input value={formik.values.name} onChange={formik.handleChange}
                                           placeholder={'Album name'}/>
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="area">
                                    <FormLabel>Area</FormLabel>
                                    <Select placeholder='Select option'>
                                        <option value='option1'>Option 1</option>
                                        <option value='option2'>Option 2</option>
                                        <option value='option3'>Option 3</option>
                                    </Select>
                                </FormControl>
                                <FormControl id="session">
                                    <FormLabel>Diving Session</FormLabel>
                                    <Select placeholder='Select option'>
                                        <option value='option1'>Option 1</option>
                                        <option value='option2'>Option 2</option>
                                        <option value='option3'>Option 3</option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg='#005A80' color={'white'} mr={3} onClick={() => formik.handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export function AlbumDelete({ album, reload = () => {}}: { album?: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure()
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
                        <Button colorScheme={'red'} mr={3} onClick={() => {
                            reload();
                            onClose();
                        }}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
