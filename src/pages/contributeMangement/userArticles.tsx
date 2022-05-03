import React, {useEffect} from "react";
import {
    Badge,
    Button,
    Container, FormControl, FormErrorMessage, FormLabel,
    Heading,
    HStack,
    IconButton, Input, Link,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, Stack, Tag,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useTable, useSortBy} from 'react-table'
import {useFormik} from "formik";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Datatable, {OptionFilter} from "../../components/datatable";
import AlbumServices from "../../services/albumServices";
import * as Yup from "yup";
import {useAuth} from "../../hooks/useAuth";
import ArticleServices from "../../services/articleService";
import AccountServices from "../../services/accountServices";

const articleStatus = [
    {
        value: "1",
        label: "Draft"
    },
    {
        value: "2",
        label: "Submitted"
    },
    {
        value: "3",
        label: "Rejected"
    },
    {
        value: "4",
        label: "Published"
    },
    {
        value: "5",
        label: "Unpublished"
    }
];

export default function UserArticles() {

    const [articles, setArticles] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
        loadArticles();
    }, []);


    const loadArticles = () => {
        ArticleServices.getAll().then(res => {
            setArticles(res.data);
        });
    }

    const loadData = () => {
        AccountServices.getAll().then(res => {
            setUsers(res.data);
        });
    }

    const openEditor = (article: any) => {
        navigate(`/researcher/articles/${article.articleId}`);
    }

    const data = articles.map((a: any) => {
        a.account = users.find((u: any) => u.accountId == a.author);
        return {
            title: a.title,
            tags: a.tags ? a.tags.split(', ') : [],
            author: a.account ? a.account.firstName + ' ' + (a.account.lastName ? a.account.lastName : '') : '',
            status: articleStatus.find((s: any) => s.value == a.status)?.label,
            date: a.createdTime,
            article: a
        }
    })

    const columns = [
        {
            Header: 'Title',
            accessor: 'title' as const,
        },
        {
            Header: 'Tags',
            accessor: 'tags' as const,
            Cell: ({row}: { row: any }) =>
                <HStack spacing={2}>
                    {row.values.tags.map((tag: string) => (
                        <Tag>{tag}</Tag>
                    ))}
                </HStack>,
        },
        {
            Header: 'Status',
            accessor: 'status' as const,
            Cell: ({cell}: { cell: any }) => (
                <>
                    {cell.value == 'Draft' ? <Badge>Draft</Badge> : ''}
                    {cell.value == 'Submitted' ? <Badge colorScheme={'blue'}>Submitted</Badge> : ''}
                    {cell.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
                    {cell.value == 'Published' ? <Badge colorScheme={'green'}>Published</Badge> : ''}
                    {cell.value == 'Unpublished' ? <Badge colorScheme={'yellow'}>Unpublished</Badge> : ''}
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
                    <IconButton aria-label='Add to friends' icon={<EditIcon/>} color={'#005A80'}
                                onClick={() => openEditor(row.original.article)}/>
                    <ArticleDelete article={row.original.article} reload={loadArticles}/>
                </HStack>,
        },
    ];

    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                My Articles <NewArticle/>
            </Heading>
            <Datatable columns={columns} data={data}/>
        </Container>
    );
}

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Article title is required'),
});

export function NewArticle() {
    const user = useAuth().user;
    const navigate = useNavigate();

    const {isOpen, onOpen, onClose} = useDisclosure()
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: '',
            lead: '',
            articleContent: '',
            author: user?.account?.accountId,
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.isValid) {
                ArticleServices.create(values).then(() => {
                    ArticleServices.getAll().then(res => {
                        navigate(`/researcher/articles/${res.data[res.data.length - 1].articleId}`);
                    });
                });
            }
        },
    })
    return (
        <>
            <IconButton aria-label='Add to friends' icon={<AddIcon/>} color={'#005A80'}
                        onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>New article</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="title" isRequired
                                             isInvalid={Boolean(formik.touched?.title && formik.errors?.title)}>
                                    <FormLabel>Title</FormLabel>
                                    <Input placeholder={'Input article title'} value={formik.values.title}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'blue'} onClick={() => formik.handleSubmit()}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export function ArticleDelete({
                                  article, reload = () => {
    }
                              }: { article: any, reload?: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const deleteAlbum = () => {
        ArticleServices.remove(article.articleId).then(() => {
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
                    <ModalHeader>Delete article</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this article?</p>
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
