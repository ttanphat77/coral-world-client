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
    Image, Input, SimpleGrid,
    Spacer, Textarea, useDisclosure,
    Wrap,
    WrapItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Stack, Text,
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
    const {isOpen: isViewerOpen, onClose: onViewerClose, onOpen: onViewerOpen} = useDisclosure();

    return (
        <Box w={'100%'}
             position={'relative'}
             transition="0.3s ease-in-out"
             _hover={{
                 transform: 'scale(1.05)',
             }}>
            <Box
                position={'absolute'}
                top={2}
                right={2}
                zIndex={1}>
                <CloseButton color={'white'}
                             _hover={{
                                 border: '2px solid white'
                             }}/>
            </Box>
            <AspectRatio w={'100%'} ratio={1}>
                <Box borderRadius={10}
                     onClick={onViewerOpen}>
                    <Image
                        cursor={'pointer'}
                        boxSize={'100%'}
                        objectFit={'cover'}
                        src={'https://picsum.photos/1000/700'}/>
                </Box>
            </AspectRatio>
            <Textarea w={'100%'} variant={'filled'} mt={2} placeholder={'Description (optional)'}/>
            <Modal isOpen={isViewerOpen} onClose={onViewerClose}
                   closeOnOverlayClick={false} size={'6xl'}
                   scrollBehavior={'inside'}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton/>
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                            <Box height={['50vh', '50vh', '70vh']} bg={'black'}
                                 onClick={onViewerOpen} alignContent={'center'}>
                                <Image
                                    height={'100%'}
                                    width={'100%'}
                                    objectFit={'contain'}
                                    src={'https://picsum.photos/1000/700'}/>
                            </Box>
                            <Box>
                                <Stack>
                                    <Text>
                                        <strong>Description: </strong>
                                        <em>
                                        Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
                                        adipisci velit...</em>
                                    </Text>
                                    <Text>
                                        <strong>Coral detect: </strong>
                                        <em style={{color: 'green'}}>Processing...</em>
                                    </Text>
                                </Stack>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
        ;
}
