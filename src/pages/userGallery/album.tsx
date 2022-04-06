import React from "react";
import {
    AspectRatio,
    Box,
    Button,
    Center, CloseButton,
    Container,
    Divider,
    Flex,
    Heading,
    HStack, IconButton,
    Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, SimpleGrid,
    Spacer, Textarea,
    useDisclosure,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {AlbumDelete, AlbumForm} from "./userGallery";
import {AddIcon, DeleteIcon, DownloadIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";

export default function Album() {
    const album: any = {
        name: "Album name",
        description: "",
        photos: [],
    };

    return (
        <Container maxW={'container.xl'} p={8}>
            <Flex>
                <Heading as={'h2'} size={'xl'}>{album.name} <Button leftIcon={<AddIcon/>}>Upload</Button></Heading>
                <Spacer/>
                <HStack>
                    <AlbumForm album={album}/>
                    <AlbumDelete album={album}/>
                </HStack>
            </Flex>
            <Divider my={4}/>
            <SimpleGrid columns={[1, 2, 3, 5]} spacing={4}>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
                <Photo/>
            </SimpleGrid>
        </Container>);
}

function Photo() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box w={'100%'}
             position={'relative'}
             transition="0.3s ease-in-out"
             _hover={{
                 transform: 'scale(1.05)',
             }}>
            <Box position={'absolute'} zIndex={1} top={2} right={2}>
                <CloseButton size='lg' color={'white'}
                             _hover={{
                                 border: '1.5px solid white'
                             }}/>
            </Box>
            <AspectRatio w={'100%'} ratio={1} onClick={onOpen} cursor={'pointer'}>
                <Box borderRadius={10}>
                    <Image
                        boxSize={'100%'}
                        objectFit={'cover'}
                        src={'https://picsum.photos/200/300'}/>
                </Box>
            </AspectRatio>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Textarea w={'100%'} variant={'filled'} mt={2} placeholder={'Description (optional)'}/>
        </Box>
    );
}

// function PhotoViewer(isOpen: any, onClose: () => void) {
//     return (
//     )
// }
