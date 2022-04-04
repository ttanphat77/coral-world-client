import React from "react";
import {
    AspectRatio,
    Box,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    Image, Input, SimpleGrid,
    Spacer, Textarea,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {AlbumDelete, AlbumForm} from "./userGallery";
import {AddIcon} from "@chakra-ui/icons";

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
            <SimpleGrid columns={[1, 2,3,5]} spacing={4}>
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
    return (
        <Box w={'100%'}
             transition="0.3s ease-in-out"
             _hover={{
                 transform: 'scale(1.05)',
             }}>
            <AspectRatio w={'100%'} ratio={1}>
                <Image boxSize={'100%'} height={'100vmin'} objectFit={'contain'} src={'https://picsum.photos/200/300'} borderRadius={10}/>
            </AspectRatio>
            <Textarea w={'100%'} variant={'filled'} mt={2} placeholder={'Description (optional)'}/>
        </Box>
    );
}
