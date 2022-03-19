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
  Tag, Container, FormControl, FormLabel, Input, FormHelperText, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import {PhoneIcon, SearchIcon} from "@chakra-ui/icons";

export default function Home() {
  return (<> <Flex
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
                    children={<SearchIcon color='gray.500' />}
                />
                <Input placeholder='by scientific name' id={'coralSpecie'}  bg={'white'}/>
              </InputGroup>
            </FormControl>
            <Stack direction={'row'}>
              <Button
                  bg={'#005A80'}
                  rounded={'full'}
                  color={'white'}
                  _hover={{bg: '#4D8CA6'}}>
                Find species
              </Button>
              <Button
                  bg={'whiteAlpha.300'}
                  rounded={'full'}
                  color={'white'}
                  _hover={{bg: 'whiteAlpha.500'}}>
                See all taxonomy
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </Flex>
        <Container maxW={'8xl'} p={8}>
          <Heading as="h2" marginTop="5">
            Latest articles
          </Heading>
          <Divider marginTop="5"/>
          <Wrap spacing="30px" marginTop="5">
            <WrapItem width={{base: '100%', sm: '45%', md: '45%', lg: '30%'}}>
              <Box w="100%">
                <Box borderRadius="lg" overflow="hidden">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    <Image
                        transform="scale(1.0)"
                        src={
                          'https://insideclimatenews.org/wp-content/uploads/2021/11/Voolstra-1.jpeg'
                        }
                        alt="some text"
                        objectFit="contain"
                        width="100%"
                        transition="0.3s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                    />
                  </Link>
                </Box>
                <BlogTags tags={['News', 'Corals']} marginTop="3"/>
                <Heading fontSize="xl" marginTop="2">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    Some blog title
                  </Link>
                </Heading>
                <Text as="p" fontSize="md" marginTop="2">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book.
                </Text>
                <BlogAuthor
                    name="John Doe"
                    date={new Date('2021-04-06T19:01:27Z')}
                />
              </Box>
            </WrapItem>
            <WrapItem width={{base: '100%', sm: '45%', md: '45%', lg: '30%'}}>
              <Box w="100%">
                <Box borderRadius="lg" overflow="hidden">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    <Image
                        transform="scale(1.0)"
                        src={
                          'https://insideclimatenews.org/wp-content/uploads/2021/11/Voolstra-1.jpeg'
                        }
                        alt="some text"
                        objectFit="contain"
                        width="100%"
                        transition="0.3s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                    />
                  </Link>
                </Box>
                <BlogTags tags={['News', 'Corals']} marginTop="3"/>
                <Heading fontSize="xl" marginTop="2">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    Some blog title
                  </Link>
                </Heading>
                <Text as="p" fontSize="md" marginTop="2">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book.
                </Text>
                <BlogAuthor
                    name="John Doe"
                    date={new Date('2021-04-06T19:01:27Z')}
                />
              </Box>
            </WrapItem>
            <WrapItem width={{base: '100%', sm: '45%', md: '45%', lg: '30%'}}>
              <Box w="100%">
                <Box borderRadius="lg" overflow="hidden">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    <Image
                        transform="scale(1.0)"
                        src={
                          'https://insideclimatenews.org/wp-content/uploads/2021/11/Voolstra-1.jpeg'
                        }
                        alt="some text"
                        objectFit="contain"
                        width="100%"
                        transition="0.3s ease-in-out"
                        _hover={{
                          transform: 'scale(1.05)',
                        }}
                    />
                  </Link>
                </Box>
                <BlogTags tags={['News', 'Corals']} marginTop="3"/>
                <Heading fontSize="xl" marginTop="2">
                  <Link textDecoration="none" _hover={{textDecoration: 'none'}}>
                    Some blog title
                  </Link>
                </Heading>
                <Text as="p" fontSize="md" marginTop="2">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book.
                </Text>
                <BlogAuthor
                    name="John Doe"
                    date={new Date('2021-04-06T19:01:27Z')}
                />
              </Box>
            </WrapItem>
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
        <Image
            borderRadius="full"
            boxSize="40px"
            src="https://100k-faces.glitch.me/random-image"
            alt={`Avatar of ${props.name}`}
        />
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
              <Tag size={'md'} variant="solid" colorScheme="orange" key={tag}>
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
