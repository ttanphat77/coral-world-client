import React from 'react';
import {
    Avatar,
    Center,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input, Text, SimpleGrid,
    Stack, Flex, Button, Spacer
} from "@chakra-ui/react";
import {useAuth} from "../hooks/useAuth";
import {Form, useFormik} from "formik";
import {Select as MultiSelect} from "chakra-react-select";
import CoralSpeciesServices from "../services/coralSpeciesServices";
import * as Yup from "yup";

const validationSchema = Yup.object({
    scientificName: Yup.string()
        .required('Scientific name is required'),
    parentId: Yup.number()
        .required('Genus is required'),
    authorCitation: Yup.string()
        .required('Author citation is required'),
});

export default function Profile() {
    const user = useAuth().user;
    const formik = useFormik({
        initialValues: {
            firstName: user.account.firstName,
            lastName: user.account.lastName,
            email: user.account.email,
            accountId: user.account.accountId,
            role: user.account.role,
            password: user.account.password,
            avatar: user.account.avatar,
        },
        validationSchema,
        onSubmit: (values) => {
        },
    });

    return (
        <Container maxW={"container.sm"} p={2}>
            <Stack spacing={2} mt={4}>
                <Center>
                    <Avatar
                        size={'2xl'}
                        name={user?.account?.firstName + ' ' + user.account?.lastName}
                        src={user?.account?.avatar}
                    />
                </Center>
                <Center>
                    <Text fontSize='3xl'>{user?.account?.email}</Text>
                </Center>
                <Center>
                    { user?.account?.role == 1 &&
                    <Text fontSize='2xl'>User</Text>
                    }
                    { user?.account?.role == 2 &&
                    <Text fontSize='2xl'>ADMIN</Text>
                    }
                    { user?.account?.role == 3 &&
                    <Text fontSize='2xl'>Reseacher</Text>
                    }
                </Center>
                <form>
                    <Flex>
                        <SimpleGrid columns={2} spacing={4} mt={4} w={'100%'}>
                            <FormControl id="firstName" isRequired>
                                <FormLabel htmlFor="firstName">First name</FormLabel>
                                <Input id="firstName" name="firstName" value={formik.values.firstName}
                                       placeholder={'Enter first name'}/>
                                <FormErrorMessage>
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl id="lastName">
                                <FormLabel htmlFor="lastName">Last name</FormLabel>
                                <Input id="lastName" name="lastName" value={formik.values.lastName}
                                       placeholder={'Enter last name'}/>
                                <FormErrorMessage>
                                </FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                        <Flex flexDirection={'column'} ml={2}>
                            <Spacer/>
                            <Button>Save</Button>
                        </Flex>
                    </Flex>
                </form>
            </Stack>
        </Container>
    );
}
