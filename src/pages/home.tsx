import * as React from 'react';
import {
    Stack,
    Flex,
    Button,
    Text,
    VStack,
    useBreakpointValue,
    Box,
    Heading,
    Link,
    Image,
    Divider,
    Wrap,
    WrapItem,
    HStack,
    SpaceProps,
    Tag,
    Container,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    InputGroup,
    InputLeftElement,
    effect,
    AspectRatio,
    Center, Spacer,
} from '@chakra-ui/react';
import {SearchIcon} from "@chakra-ui/icons";
import 'leaflet/dist/leaflet.css';
import CoralMap from "../components/coralMap";
import {createSearchParams, useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import ArticleServices from "../services/articleService";
import {useEffect} from "react";
import AccountServices from "../services/accountServices";
import {Link as RouterLink} from "react-router-dom";

export default function Home() {
    const [searchValue, setSearchValue] = React.useState("");
    const [articles, setArticles] = React.useState<any[]>([]);
    const [accounts, setAccounts] = React.useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        ArticleServices.getPublished().then(res => {
            setArticles(res.data.reverse());
        });
        AccountServices.getAll().then(res => {
            setAccounts(res.data);
        });
    }, []);


    const handleSearch = () => {
        navigate({
            pathname: "/taxonomy",
            search: `?${createSearchParams({search: searchValue})}`,
        });
    };

    const goToTaxonomy = () => {
        navigate("/taxonomy");
    };

    const seeAllArticles = () => {
        navigate("/articles");
    };

    return (
        <>
            <Flex
                w={'full'}
                // h={'100vh'}
                backgroundImage={
                    'url(https://xechaydiendkbike.vn/san-ho-la-dong-vat-hay-thuc-vat/imager_1_6803_300.jpg)'
                }
                backgroundSize={'cover'}
                backgroundPosition={'center center'}>
                <VStack
                    w={'full'}
                    justify={'center'}
                    px={useBreakpointValue({base: 4, md: 8})}
                    bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
                    <Stack minW={'2xl'} align={'flex-start'} spacing={6} p={8}>
                        <Text
                            color={'white'}
                            fontWeight={700}
                            lineHeight={1.2}
                            fontSize={useBreakpointValue({base: '3xl', md: '4xl'})}>
                            Discover the world of Corals
                        </Text>
                        <FormControl color={'white'}>
                            <FormLabel htmlFor='coralSpecies'>
                                Find your species</FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.500'/>}
                                />
                                <Input placeholder='by scientific name' id={'coralSpecie'} bg={'white'}
                                       value={searchValue} color={'gray.700'}
                                       onChange={(e) => setSearchValue(e.target.value)}/>
                            </InputGroup>
                        </FormControl>
                        <Stack direction={'row'}>
                            <Button
                                bg={'#005A80'}
                                rounded={'full'}
                                color={'white'}
                                _hover={{bg: '#4D8CA6'}} onClick={() => handleSearch()}>
                                Find species
                            </Button>
                            <Button
                                bg={'whiteAlpha.300'}
                                rounded={'full'}
                                color={'white'}
                                onClick={() => goToTaxonomy()}
                                _hover={{bg: 'whiteAlpha.500'}}>
                                See all taxonomy
                            </Button>
                        </Stack>
                    </Stack>
                </VStack>
            </Flex>
            <Container maxW={'4xl'} p={4} height={'500px'}>
                <CoralMap/>
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
                                            <Link textDecoration="none" _hover={{textDecoration: 'none'}} to={'/articles/' + article.articleId} as={RouterLink}>
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

interface IBlogTags {
    tags: Array<string>;
    marginTop?: SpaceProps['marginTop'];
}

export const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
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
            {props.tags.map((tag) => {
                return (
                    <Tag size={'md'} variant="solid" key={tag}>
                        {tag}
                    </Tag>
                );
            })}
        </HStack>
    );
};

interface BlogAuthorProps {
    date: Date;
    name: string;
}
