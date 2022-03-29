import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {useAuth} from "../../hooks/useAuth";
import React from "react";

export default function Signin() {
    const auth = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Flex
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
                        </FormControl>
                        <Stack spacing={10}>
                            {/*<Stack*/}
                            {/*    direction={{ base: 'column', sm: 'row' }}*/}
                            {/*    align={'start'}*/}
                            {/*    justify={'space-between'}>*/}
                            {/*    /!*<Checkbox>Remember me</Checkbox>*!/*/}
                            {/*    <Link color={'blue.400'}>Forgot password?</Link>*/}
                            {/*</Stack>*/}
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                onClick={() => auth.signin(email, password)}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
