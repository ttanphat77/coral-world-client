import React, {useEffect} from 'react';
import {
    Badge, Box, Button, Center,
    Container, Divider,
    Heading,
    HStack,
    IconButton, Image, Link, List, ListIcon, ListItem,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Slider, Stack, Tag, Text,
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
import ArticleServices from "../../services/articleService";

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


export default function ArticleManagement() {
    const [articles, setArticles] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);

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

    const data = articles.map((a: any) => {
        a.account = users.find((u: any) => u.accountId == a.author);
        return {
            title: a.title,
            lead: a.lead,
            author: a.account ? a.account.firstName + ' ' + (a.account.lastName ? a.account.lastName : '') : '',
            status: articleStatus.find((s: any) => s.value == a.status)?.label,
            date: a.createdTime,
            article: a
        }
    })

    const columns = React.useMemo(
        () => [
            {
                Header: 'Article',
                accessor: 'article',
                Cell: (props: any) =>
                    <Link as={RouterLink} to={'/articles/' + props.value?.articleId} target={'_blank'}>
                        {props.value?.title} <ExternalLinkIcon mx='2px'/>
                    </Link>
            },
            {
                Header: 'Lead',
                accessor: 'lead' as const,
                disableSortBy: true
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
                Header: 'Author',
                accessor: 'author' as const,
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
                        <ArticleView article={row.original.article} reload={loadArticles}/>
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
                Articles
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}

function ArticleView({article, reload}: { article: any, reload: () => void }) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const approveArticle = (status: any) => {
        article.status = status
        ArticleServices.update(article).then(() => {
            reload();
            onClose();
        });
    }

    return (
        <>
            <IconButton aria-label={'edit'} variant={'solid'} icon={<ViewIcon/>}
                        onClick={onOpen}></IconButton>

            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'}
                   closeOnOverlayClick={false} size={'full'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Heading>Article</Heading>
                        <ModalCloseButton/>
                    </ModalHeader>
                    <ModalBody>
                        <Container maxW={'container.xl'} py={2}>
                            <HStack spacing={2}>
                                {
                                    article.tags.split(',').map((t: any) =>
                                        <Tag>{t}</Tag>
                                    )
                                }
                            </HStack>
                            <Heading as={'h1'}>{article.title}</Heading>
                            <HStack pb={8}>
                                <Text
                                    fontWeight="medium">{article.account ? article.account.firstName + ' ' + (article.account.lastName ? article.account.lastName : '') : ''}</Text>
                                <Text>-</Text>
                                <Text>{(new Date(article.createdTime).toLocaleDateString())}</Text>
                            </HStack>
                            {article.lead ?
                                <Text fontSize='2xl' pb={4}>{article.lead}</Text> : ''
                            }
                            {article.thumpnail ?
                                <Center w={'100%'} pb={4}>
                                    <Image src={article.thumpnail}/>
                                </Center> : ''
                            }
                            {article.articleContent ?
                                <div dangerouslySetInnerHTML={createMarkup(article.articleContent)}></div> : ''
                            }
                        </Container>
                    </ModalBody>

                    <ModalFooter>
                        {article.status == 2 ?
                            <>
                                <Button colorScheme={'blue'} mr={2} onClick={() => approveArticle(4)}>
                                    Publish
                                </Button>
                                <Button colorScheme={'red'} onClick={() => approveArticle(3)}>
                                    Reject
                                </Button>
                            </> : ''
                        }
                        {article.status == 4 ?
                            <Button colorScheme={'yellow'} onClick={() => approveArticle(5)}>
                                Unpublish
                            </Button> : ''
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
        ;
}

function createMarkup(articleContent: any) {
    return {__html: articleContent};
}

