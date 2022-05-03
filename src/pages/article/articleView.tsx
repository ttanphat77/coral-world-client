import React, {useEffect} from "react";
import {
    AspectRatio,
    Box, Button,
    Center,
    Container,
    Divider, Flex,
    Heading,
    HStack,
    Image, Link, SpaceProps, Spacer,
    Tag,
    Text,
    VStack,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import ArticleServices from "../../services/articleService";
import AccountServices from "../../services/accountServices";
import ArticleTagsServices from "../../services/articleTagServices";

export default function ArticleView() {
    let {id} = useParams();
    const [article, setArticle] = React.useState<any>({});
    const [author, setAuthor] = React.useState<any>({});
    const [accounts, setAccounts] = React.useState<any[]>([]);
    const [articles, setArticles] = React.useState<any[]>([]);
    const [coralTags, setCoralTags] = React.useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        ArticleServices.get(id).then(art => {
            setArticle(art.data);
            AccountServices.get(art.data.author).then(aut => {
                setAuthor(aut.data);
            });
        });
        ArticleServices.getPublished().then(arts => {
            setArticles(arts.data);
        });
        AccountServices.getAll().then(accs => {
            setAccounts(accs.data);
        });
        ArticleTagsServices.getByArticle(id).then(tags => {
            setCoralTags(tags.data);
        });
    }, []);


    const seeAllArticles = () => {
        navigate("/articles");
    };

    const navigateArticle = (id: string) => {
        navigate(`/articles/${id}`);
        window.scrollTo(0, 0);
        ArticleServices.get(id).then(art => {
            setArticle(art.data);
            AccountServices.get(art.data.author).then(aut => {
                setAuthor(aut.data);
            });
        });
    };

    return (
        <>
            <Container maxW={'container.xl'} py={2}>
                <HStack spacing={2}>
                    {
                        coralTags.map((tag: any) => {
                            return (
                                tag.tagId != 1 &&
                                <Tag key={tag.tagId}>
                                    {tag.tagName}
                                </Tag>
                            )
                        })
                    }
                </HStack>
                <Heading as={'h1'}>{article.title}</Heading>
                <HStack pb={8}>
                    <Text
                        fontWeight="medium">{author ? author.firstName + ' ' + (author.lastName ? author.lastName : '') : ''}</Text>
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
            <Container maxW={'8xl'} p={4}>
                <Flex>
                    <Heading as="h2" marginTop="5">
                        Latest articles
                    </Heading>
                    <Spacer/>
                    <Button variant={'ghost'} onClick={seeAllArticles} size={'lg'} bottom={'-20px'}>
                        See all
                    </Button>
                </Flex>
            <Divider marginTop="2"/>
            <Wrap spacing="30px" marginTop="5">
                {
                    articles.map((article, index) => {
                        // let author: any = null;
                        if (index < 3) {
                            return (
                                <WrapItem width={{base: '100%', sm: '45%', md: '45%', lg: '30%'}}>
                                    <Box w="100%">
                                        <Link textDecoration="none" _hover={{textDecoration: 'none'}} onClick={() => navigateArticle(article.articleId)}>
                                            <Box borderRadius="lg" overflow="hidden">
                                                <AspectRatio ratio={16 / 9}>
                                                    {
                                                        article.thumpnail ?
                                                            <Image
                                                                transform="scale(1.0)"
                                                                src={article.thumpnail}
                                                                alt="some text"
                                                                objectFit="contain"
                                                                width="100%"
                                                                transition="0.3s ease-in-out"
                                                                _hover={{
                                                                    transform: 'scale(1.05)',
                                                                }}
                                                            /> :
                                                            <Center bg={'gray.200'} h={'100%'}>
                                                                No thumbnail
                                                            </Center>

                                                    }
                                                </AspectRatio>
                                            </Box>
                                            <BlogTags tags={article.tags.split(',')} marginTop="3"/>
                                            <Heading fontSize="xl" marginTop="2">
                                                <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                                                    {article.title}
                                                </Link>
                                            </Heading>
                                            <Text as="p" fontSize="md" marginTop="2">
                                                {article.lead}
                                            </Text>
                                            {
                                                accounts.filter((account: any) => account.accountId === article.author).map((account: any) => {
                                                    return <BlogAuthor
                                                        name={account ? account.firstName + ' ' + (account.lastName ? account.lastName : '') : ''}
                                                        date={new Date(article.createdTime)}
                                                    />
                                                })
                                            }
                                        </Link>
                                    </Box>
                                </WrapItem>

                            )
                        }
                    })
                }
            </Wrap></Container>
        </>
    );
}

function createMarkup(articleContent: any) {
    return {__html:  articleContent};
}



interface IBlogTags {
    tags: Array<string>;
    marginTop?: SpaceProps['marginTop'];
}

const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
    return (
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
            <Text fontWeight="medium">{props.name}</Text>
            <Text>—</Text>
            <Text>{props.date.toLocaleDateString()}</Text>
        </HStack>
    );
};

const BlogTags: React.FC<IBlogTags> = (props) => {
    return (
        <HStack spacing={2} marginTop={props.marginTop}>
            {props.tags.map((tag) => tag != '' &&
                    <Tag size={'md'} variant="solid" key={tag}>
                        {tag}
                    </Tag>)}
        </HStack>
    );
};

interface BlogAuthorProps {
    date: Date;
    name: string;
}
