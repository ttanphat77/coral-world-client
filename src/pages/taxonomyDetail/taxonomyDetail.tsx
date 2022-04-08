import {
    AspectRatio,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Container,
    Divider,
    Grid,
    GridItem,
    Text,
    Heading,
    Link,
    List,
    ListIcon,
    ListItem,
    SimpleGrid,
    Button,
    useDisclosure,
    Flex,
    Spacer,
    Stack,
    FormControl,
    FormLabel, Input, FormErrorMessage, Textarea,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import ImageGallery from "react-image-gallery";
import {GrInherit} from "react-icons/gr";
import {GiFootprint, GiDuality, GiAlgae, GiMeshNetwork} from "react-icons/gi";
import {IoIosColorFilter} from "react-icons/io";
import {Link as RouterLink} from 'react-router-dom';
import {GrNotes} from "react-icons/gr";
import './taxonomyDetail.css'
import {EditIcon} from "@chakra-ui/icons";
import {BiImageAdd} from "react-icons/bi";
import {useFormik} from "formik";

export default function TaxonomyDetail() {
    const coral = {
        name: 'Acropora abrolhosensis',
        author: 'Veron, 1985',
        characters: 'Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.',
        color: 'Usually pale grey, brown or rust coloured, often mottled.',
        similar: 'Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.',
        habitat: 'Lower reef slopes protected from wave action.',
        abundance: 'Rare except in subtropical localities of eastern Australia.',
        taxonomic_note: 'The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.',
        parent: {
            name: 'Acropora',
            author: 'Milne Edwards and Haime, 1848'
        }
    }

    return (
        <Container maxW={'container.xl'} py={2}>
            <Flex mb={2}>
                <UpdateButton coral={coral}/>
                <Spacer/>
                <Button variant={'solid'} leftIcon={<BiImageAdd/>}
                        size={'sm'}>
                    Contribute</Button>
            </Flex>
            <SimpleGrid columns={[1, 1, 2]} gap={4}>
                <Box>
                    <Heading as='h2' size='xl' color={'#005A80'}>
                        {coral.name}
                    </Heading> {coral.author} <br/>
                    <Divider my={4}/>
                    <List fontSize={'lg'}>
                        <ListItem>
                            <ListIcon as={GrInherit}/>
                            <span>
                                <strong>Parent: </strong>
                                <Link as={RouterLink} color={'blue.500'} to={'/genus/id'}>{coral.parent.name} <Text
                                    fontSize={'sm'}
                                    as={'span'}>({coral.parent.author})</Text></Link>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiFootprint}/>
                            <span>
                                <strong>Characters: </strong>
                                <em>{coral.characters}</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={IoIosColorFilter}/>
                            <span>
                                <strong>Color: </strong>
                                <em>{coral.color}</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiDuality}/>
                            <span>
                                <strong>Similar Species: </strong>
                                <em>{coral.similar}</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiAlgae}/>
                            <span>
                                <strong>Habitat: </strong>
                                <em>{coral.habitat}</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiMeshNetwork}/>
                            <span>
                                <strong>Abundance: </strong>
                                <em>{coral.abundance}</em>
                            </span>
                        </ListItem>
                        <br/>
                        <ListItem>
                            <ListIcon as={GrNotes}/>
                            <span>
                                <strong>Taxonomic Note: </strong>
                                <em>{coral.taxonomic_note}</em>
                            </span>
                        </ListItem>
                    </List>
                </Box>
                <Box>
                    <MediaCarousel/>
                </Box>
            </SimpleGrid>
        </Container>
    );
}

function MediaCarousel() {
    const images = [
        {
            original: 'https://picsum.photos/500/1500',
            thumbnail: 'https://picsum.photos/500/700',
            description: 'Acropora abrolhosensis Small colony. Indonesia Photograph: Lyndon DeVantier',
            originalHeight: 1000,
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            description: 'Big Buck Bunny',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            description: 'Big Buck Bunny',
        },
    ];
    return (
        <ImageGallery items={images}
                      showPlayButton={false} showNav={false}/>
    )
}

function UpdateButton({coral}: { coral: any }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        initialValues: {
            characters: coral.characters,
            color: coral.color,
            similar: coral.similar,
            habitat: coral.habitat,
            abundance: coral.abundance,
            taxonomic_note: coral.taxonomic_note,
        },
        onSubmit: (values) => {
            console.log(values);
            onClose();
        },
    });

    return (
        <>
            <Button variant={'solid'} leftIcon={<EditIcon/>}
                    size={'sm'} onClick={onOpen}>
                Update</Button>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={'3xl'} color={'#005A80'} fontWeight={'bold'}>{coral.name}</Text>
                        {coral.author}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text fontSize={'sm'}>{coral.parent.name} ({coral.parent.author})</Text>
                        <form>
                            <Stack spacing={4} mt={4}>
                                <FormControl id="characters">
                                    <FormLabel>Characters</FormLabel>
                                    <Textarea value={formik.values.characters}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="characters"
                                              id="characters"
                                              placeholder="Enter characters"/>
                                    <FormErrorMessage>{formik.errors.characters}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="color">
                                    <FormLabel>Color</FormLabel>
                                    <Textarea value={formik.values.color}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="color"
                                              id="color"
                                              placeholder="Enter color"/>
                                    <FormErrorMessage>{formik.errors.color}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="similar">
                                    <FormLabel>Similar</FormLabel>
                                    <Textarea value={formik.values.similar}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="similar"
                                              id="similar"
                                              placeholder="Enter similar"/>
                                    <FormErrorMessage>{formik.errors.similar}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="habitat">
                                    <FormLabel>Habitat</FormLabel>
                                    <Textarea value={formik.values.habitat}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="habitat"
                                              id="habitat"
                                              placeholder="Enter habitat"/>
                                    <FormErrorMessage>{formik.errors.habitat}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="abundance">
                                    <FormLabel>Abundance</FormLabel>
                                    <Textarea value={formik.values.abundance}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="abundance"
                                              id="abundance"
                                              placeholder="Enter abundance"/>
                                    <FormErrorMessage>{formik.errors.abundance}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="note">
                                    <FormLabel>Taxonomy note</FormLabel>
                                    <Textarea value={formik.values.taxonomic_note}
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              name="note"
                                              id="note"
                                              placeholder="Enter taxonomy note"/>
                                    <FormErrorMessage>{formik.errors.taxonomic_note}</FormErrorMessage>
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='#005A80' color={'white'} mr={3} onClick={() => formik.handleSubmit}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
