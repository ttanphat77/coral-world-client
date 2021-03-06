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
    useColorModeValue, FormErrorMessage,
} from '@chakra-ui/react';
import {useAuth} from "../../hooks/useAuth";
import React from "react";
import {useFormik} from "formik";

export default function Signin() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');
    const auth = useAuth();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => {
            setIsSubmitting(true);
            auth.signin(values.email, values.password, (err:any) => {
                setIsSubmitting(false);
                setError(err ? 'Email or password is not correct!' : '');
            });
        },
    });

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
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" value={formik.values.email} onChange={formik.handleChange}/>
                            </FormControl>
                            <FormControl id="password" isInvalid={Boolean(error)}>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" value={formik.values.password} onChange={formik.handleChange}/>
                                <FormErrorMessage>{error}</FormErrorMessage>
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
                                    isLoading={isSubmitting}
                                    bg={'blue.400'}
                                    color={'white'}
                                    type={'submit'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign in
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}
