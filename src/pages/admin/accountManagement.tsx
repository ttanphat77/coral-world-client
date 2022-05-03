import React, {useEffect, useState} from "react";
import {
    Badge, Button,
    Container, FormControl, FormErrorMessage, FormLabel,
    Heading,
    HStack,
    IconButton, Input,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, Stack, Text, Textarea,
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
            date: acc.createdTime
        }})

    const columns = React.useMemo(
        () => [
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
                        <CoralForm coral={row.original.coral} reload={load}/>
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
                Account <CoralForm reload={load}/>
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

const validationSchema = Yup.object({
    scientificName: Yup.string()
        .required('Scientific name is required'),
    authorCitation: Yup.string()
        .required('Author citation is required'),
});

function CoralForm({coral, reload}: { coral?: any, reload: () => void }) {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            coralGenusId: coral ? coral.coralGenusId : 0,
            scientificName: coral && coral.scientificName ? coral.scientificName : '',
            authorCitation: coral && coral.authorCitation ? coral.authorCitation : '',
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.isValid) {
                if(values.coralGenusId === 0) {
                    CoralGenusServices.create(values).then(() => {
                        reload();
                        onClose();
                    });
                } else {
                    CoralGenusServices.update(values).then(() => {
                        reload();
                        onClose();
                    });
                }
            }
        },
    })
    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={coral ? <EditIcon/> :  <AddIcon/>} onClick={onOpen}></IconButton>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        { coral ? 'Edit coral genus' : 'New coral genus'}
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
