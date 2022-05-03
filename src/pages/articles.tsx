import React, {useEffect} from "react";
import {
    AspectRatio,
    Container,
    Grid,
    GridItem,
    Heading,
    Stack,
    Image,
    HStack,
    Tag,
    Text,
    Box,
    Flex,
    Center,
    Spacer,
    Divider,
    LinkBox,
    LinkOverlay,
    SpaceProps,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement
} from "@chakra-ui/react";
import ArticleServices from "../services/articleService";
import './articles.css'
import AccountServices from "../services/accountServices";
import {Link as RouterLink} from "react-router-dom";
import {CloseIcon, SearchIcon} from "@chakra-ui/icons";

export default function Articles() {
    const [articles, setArticles] = React.useState<any[]>([]);
    const [accounts, setAccounts] = React.useState<any[]>([]);
    const [searchValue, setSearchValue] = React.useState('');

    useEffect(() => {
        ArticleServices.getPublished().then(res => {
            setArticles(res.data);
        });
        AccountServices.getAll().then(res => {
            setAccounts(res.data);
        });
    }, []);


    return <>
        <Container maxW={"container.lg"} p={2}>
            <Flex>
                <Heading as='h2' size='xl'>
                    Articles
                </Heading>
                <Spacer/>
                <Box>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.500'/>}
                        />
                        <Input placeholder='by scientific name' id={'coralSpecie'} bg={'white'}
                               value={searchValue} color={'gray.700'} w={350}
                               onChange={(e) => setSearchValue(e.target.value)}/>
                        {searchValue && <InputRightElement
                            cursor={'pointer'}
                            children={<CloseIcon color='gray.500'/>}
                            onClick={() => setSearchValue('')}/>}
                    </InputGroup>
                </Box>
            </Flex>
            <Stack spacing={4} pt={8}>
                {
                    articles.filter((art: any) => art.title.toLowerCase().includes(searchValue.toLowerCase()))
                        .map((article: any) => {
                            article.account = accounts.find(account => account.accountId === article.author);
                            return (
                                <LinkBox as='article' p={2} borderWidth='1px' rounded='md'>
                                    <Flex>
                                        <Flex flex='1' h={[150, 150, 200]} flexDirection={'column'}>
                                            <Heading as='h3' size='lg' className={'title'}>
                                                <LinkOverlay to={'/articles/' + article.articleId}
                                                             as={RouterLink}>{article.title}</LinkOverlay></Heading>
                                            <HStack>
                                                <Text
                                                    fontWeight="medium">{article.account ? article.account.firstName + ' ' + (article.account.lastName ? article.account.lastName : '') : ''}</Text>
                                                <Text>-</Text>
                                                <Text>{(new Date(article.createdTime).toLocaleDateString())}</Text>
                                            </HStack>
                                            <Text className={'lead'} display={['none', 'none', '-webkit-box']}>
                                                {article.lead}</Text>
                                            <Spacer></Spacer>
                                            <HStack spacing={2}>
                                                {
                                                    article.tags.split(',').map((tag: string) => {
                                                        return <Tag>{tag}</Tag>
                                                    })
                                                }
                                            </HStack>
                                        </Flex>
                                        {
                                            article.thumpnail &&
                                            <Center h={[150, 150, 200]}>
                                                <Image src={article.thumpnail} objectFit={'cover'} h={[70, 100, 200]}
                                                       w={[105, 150, 300]}/>
                                            </Center>
                                        }
                                    </Flex>
                                </LinkBox>)
                        })
                }
            </Stack>
        </Container>
    </>;
}
