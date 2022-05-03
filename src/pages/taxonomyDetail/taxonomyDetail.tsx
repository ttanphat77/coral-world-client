import {
    Box, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Container, Divider, Grid, GridItem, Text, Heading,
    Link, List, ListIcon, ListItem, Image,
    SimpleGrid, Button, useDisclosure, Flex, Spacer, Stack,
    FormControl, FormLabel, Input, FormErrorMessage, Textarea, Select, Center,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
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
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import CoralGenusServices from "../../services/coralGenusServices";
import {useAuth} from "../../hooks/useAuth";
import SpeciesDraftServices from "../../services/speciesDraftServices";
import storage from "../../services/firebaseServices";
import UserMediaServices from "../../services/userMediaServices";
import SpeciesMediaServices from "../../services/speciesMediaService";

export default function TaxonomyDetail() {
    let {id} = useParams();
    const user = useAuth().user;

    const [coral, setCoral] = useState<any>({});
    const [genus, setGenus] = useState<any>({});
    const [medias, setMedias] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);


    const load = () => {
        CoralSpeciesServices.get(id).then(res => {
            setCoral(res.data);
            if (res.data.parentId) {
                CoralGenusServices.get(res.data.parentId).then(genus => {
                    setGenus(genus.data);
                })
            }
        });
        SpeciesMediaServices.getBySpecies(id).then(res => {
            setMedias(res.data);
        });
    }

    return (
        <Container maxW={'container.xl'} py={2}>
            {user?.account?.role == 3 &&
            <Flex mb={2}>
                <UpdateButton coral={coral} user={user}/>
                <Spacer/>
                <ContributeImage coral={coral} user={user}/>
            </Flex>
            }
            <SimpleGrid columns={[1, 1, 2]} gap={4}>
                <Box>
                    <Heading as='h2' size='xl' color={'#005A80'}>
                        {coral.scientificName}
                    </Heading> {coral.authorCitation} <br/>
                    <Divider my={4}/>
                    <List fontSize={'lg'}>
                        {coral?.parentId ?
                            <ListItem>
                                <ListIcon as={GrInherit}/>
                                <span>
                                    <strong>Parent: </strong>
                                    {genus?.scientificName}
                                    {genus?.authorCitation && <Text fontSize={'sm'}
                                                                    as={'span'}>({genus?.authorCitation})</Text>}
                                </span>
                            </ListItem> : ''}
                        {coral?.characters ?
                            <ListItem>
                                <ListIcon as={GiFootprint}/>
                                <span>
                                    <strong>Characters: </strong>
                                    <em>{coral.characters}</em>
                                </span>
                            </ListItem> : ''}
                        {coral?.color ?
                            <ListItem>
                                <ListIcon as={IoIosColorFilter}/>
                                <span>
                                    <strong>Color: </strong>
                                    <em>{coral.color}</em>
                                </span>
                            </ListItem> : ''}
                        {coral?.similarSpecies ?
                            <ListItem>
                                <ListIcon as={GiDuality}/>
                                <span>
                                    <strong>Similar Species: </strong>
                                    <em>{coral.similarSpecies}</em>
                                </span>
                            </ListItem> : ''}
                        {coral?.habitat ?
                            <ListItem>
                                <ListIcon as={GiAlgae}/>
                                <span>
                                    <strong>Habitat: </strong>
                                    <em>{coral.habitat}</em>
                                </span>
                            </ListItem> : ''}
                        {coral?.abundance ?
                            <ListItem>
                                <ListIcon as={GiMeshNetwork}/>
                                <span>
                                    <strong>Abundance: </strong>
                                    <em>{coral.abundance}</em>
                                </span>
                            </ListItem> : ''}
                        <br/>
                        {coral?.note ?
                            <ListItem>
                                <ListIcon as={GrNotes}/>
                                <span>
                                    <strong>Taxonomic Note: </strong>
                                    <em>{coral.note}</em>
                                </span>
                            </ListItem> : ''}
                    </List>
                </Box>
                <Box>
                    {medias.length > 0 ?
                    <MediaCarousel media={medias}/> :
                    <Center bg={'gray.200'} h={300}>
                        No photos
                    </Center>}
                </Box>
            </SimpleGrid>
        </Container>
    );
}

function MediaCarousel({media}: { media: any[] }) {
    const images = media.map((m: any) => {
        return {
            original: 'https://images.weserv.nl/?url=' + m.mediaURL,
            thumbnail: 'https://images.weserv.nl/?url=' + m.mediaURL,
            description: m.caption,
        }
    });
    return (
        <ImageGallery items={images}
                      showPlayButton={false} showNav={false}/>
    )
}

function UpdateButton({coral, user}: { coral: any, user: any }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            coralSpeciesId: coral.coralSpeciesId,
            author: user?.account.accountId,
            status: 1,
            characters: coral.characters ? coral.characters : '',
            color: coral.color ? coral.color : '',
            similar: coral.similar ? coral.similar : '',
            habitat: coral.habitat ? coral.habitat : '',
            abundance: coral.abundance ? coral.abundance : '',
            taxonomic_note: coral.note ? coral.note : '',
        },
        onSubmit: (values) => {
            SpeciesDraftServices.create(values).then(() => {
                onClose();
            });
        },
    });

    return (
        <>
            <Button variant={'solid'} leftIcon={<EditIcon/>}
                    size={'sm'} onClick={onOpen}>
                Update</Button>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Text fontSize={'3xl'} color={'#005A80'} fontWeight={'bold'}>{coral.scientificName}</Text>
                        {coral.authorCitation}
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
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
                        <Button colorScheme={'blue'} onClick={() => formik.handleSubmit()}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function ContributeImage({coral, user}: { coral: any, user: any }) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [images, setImages] = useState<any[]>([]);
    const [isloading, setIsLoading] = useState(false);

    const inputFileRef = React.useRef<HTMLInputElement>(null);

    const openFileInput = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleFileChange = (e: any) => {
        const files = e.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    setImages(images => [...images, {
                        name: file.name,
                        src: e.target.result,
                        description: '',
                        file: file
                    }]);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const resetInputFile = () => {
        setImages([])
    };

    const handleSubmit = () => {
        setIsLoading(true);
        let i = 0
        images.forEach(image => {
            const file = image.file;
            const name = file.name + '_' + new Date().getTime();
            storage.ref(`media/${name}`).put(file)
                .on('state_changed', (snapshot: any) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                    // switch (snapshot.state) {
                    //     case 'paused': // or 'paused'
                    //         console.log('Upload is paused');
                    //         break;
                    //     case 'running': // or 'running'
                    //         console.log('Upload is running');
                    //         break;
                    // }
                }, (error: any) => {
                    // Handle unsuccessful uploads
                }, () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    storage.ref(`media/${name}`).getDownloadURL().then((url: any) => {
                        SpeciesMediaServices.create({
                            coralSpeciesId: coral.coralSpeciesId,
                            isImage: true,
                            caption: image.description,
                            status: 1,
                            createdBy: user?.account.accountId,
                            mediaURL: url,
                        }).then((res: any) => {
                            i++;
                            if (i === images.length) {
                                setIsLoading(false);
                                onClose();
                            }
                        });
                    });
                });
        })
    };

    return (
        <>
            <Button variant={'solid'} leftIcon={<BiImageAdd/>}
                    size={'sm'} onClick={() => {
                onOpen();
                resetInputFile();
            }}>
                Contribute</Button>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        Contribute image for {coral.scientificName}
                        <Input type="file" multiple ref={inputFileRef} accept={'image/*'} display={'none'}
                               onChange={handleFileChange}/>
                        <Button onClick={openFileInput} ml={4}>Upload</Button>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack mt={2} spacing={2}>
                            {images.map((image: any, index: number) => (
                                <Flex>
                                    <Image boxSize='100px' objectFit='cover' src={image.src} alt={image.name} mr={4}/>
                                    <Textarea value={image.description} height={'100px'}
                                              onChange={(e: any) => {
                                                  setImages(images => [...images.slice(0, index), {
                                                      ...images[index],
                                                      description: e.target.value
                                                  }, ...images.slice(index + 1)])
                                              }}
                                              placeholder={'Enter description'}/>
                                </Flex>
                            ))
                            }
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' disabled={images.length == 0} onClick={handleSubmit} isLoading={isloading}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
