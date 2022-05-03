import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import {useState} from 'react';
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import {useFormik} from "formik";
import {useAuth} from "../../hooks/useAuth";
import { Link as RouterLink} from 'react-router-dom';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 1,
        },
        onSubmit: values => {
            setIsSubmitting(true);
            auth.signup(values);
        },
    });

    return (
        <Flex
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={formik.handleSubmit}>
                            <HStack>
                                <Box>
                                    <FormControl id="firstName" isRequired>
                                        <FormLabel>First Name</FormLabel>
                                        <Input type="text" value={formik.values.firstName} onChange={formik.handleChange}/>
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl id="lastName">
                                        <FormLabel>Last Name</FormLabel>
                                        <Input type="text" value={formik.values.lastName} onChange={formik.handleChange}/>
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" value={formik.values.email} onChange={formik.handleChange}/>
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'} value={formik.values.password}
                                           onChange={formik.handleChange}/>
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() =>
                                                setShowPassword((showPassword) => !showPassword)
                                            }>
                                            {showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    isLoading={isSubmitting}
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    type={'submit'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user? <Link color={'blue.400'} as={RouterLink} to={'/auth/signin'}>Login</Link>
                                </Text>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
