import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge, Button, Center,
    Container, Flex, FormControl, FormErrorMessage, FormLabel,
    Heading,
    HStack,
    IconButton, Input,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, SimpleGrid, Spacer, Stack, Text, Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import CoralGenusServices from "../../services/coralGenusServices";
import AccountServices from "../../services/accountServices";

const ROLES = [
    {value: "2", label: "ADMIN"},
    {value: "1", label: "User"},
    {value: "3", label: "Researcher"},
];

export default function AccountManagement() {
    const [accountList, setAccountList] = useState<any[]>([]);

    useEffect(() => {
        load()
    }, []);

    const load = () => {
        AccountServices.getAll().then((res: any) => {
            setAccountList(res.data);
        });
    };

    const data =  accountList.map((acc: any) => {
        return {
            name: acc.firstName + " " + (acc.lastName ? acc.lastName : ""),
            email: acc.email,
            role: ROLES.find((r: any) => r.value == acc.role)?.label,
            date: acc.createdTime,
            account: acc
        }})

    const columns = [
            {
                Header: 'Name',
                accessor: 'name' as const,
            },
            {
                Header: 'Email',
                accessor: 'email' as const,
            },
            {
                Header: 'Role',
                accessor: 'role' as const,
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
                        <CoralForm account={row.original.account} reload={load}/>
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
                Account
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

function CoralForm({account, reload}: { account: any, reload: () => void }) {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [role, setRole] = useState(account.role);

    const onSubmit = () => {
        account.role = role;
        AccountServices.changeRole(account).then(() => {
            reload();
            onClose();
        });
    };
    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<EditIcon/>} onClick={onOpen}></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} size={'sm'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        User details
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack spacing={2} mt={4}>
                            <Center>
                                <Avatar
                                    size={'xl'}
                                    name={account?.firstName + ' ' + account?.lastName}
                                    src={account?.avatar}
                                />
                            </Center>
                            <Center>
                                <Text fontSize='3xl'>{account.firstName + ' ' + (account.lastName ? account.lastName : '')}</Text>
                            </Center>
                            <Center>
                                <Text fontSize='xl'>{account.email}</Text>
                            </Center>
                            <Select onChange={(e) => setRole(e.target.value)} value={role}>
                                <option value='1'>User</option>
                                <option value='2'>Admin</option>
                                <option value='3'>Researcher</option>
                            </Select>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={onSubmit}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
