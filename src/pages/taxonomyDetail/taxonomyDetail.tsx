import {
    AspectRatio,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Container, Divider, Grid, GridItem, Text,
    Heading, Link, List, ListIcon, ListItem, SimpleGrid
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { GrInherit } from "react-icons/gr";
import { GiFootprint, GiDuality, GiAlgae, GiMeshNetwork } from "react-icons/gi";
import { IoIosColorFilter } from "react-icons/io";
import { Link as RouterLink } from 'react-router-dom';
import { GrNotes } from "react-icons/gr";
import './taxonomyDetail.css'

export default function TaxonomyDetail() {
    return (
        <Container maxW={'container.xl'} py={8}>
            <SimpleGrid columns={[1, 1, 2]} gap={4}>
                <Box>
                    <Heading as='h2' size='xl' color={'#005A80'}>
                        Acropora abrolhosensis
                    </Heading> Veron, 1985  <br/>
                    <Divider my={4}/>
                    <List fontSize={'lg'}>
                        <ListItem>
                            <ListIcon as={GrInherit}/>
                            <span>
                                <strong>Parent: </strong>
                                <Link as={RouterLink} color={'blue.500'} to={'/genus/id'}>Acropora <Text fontSize={'sm'} as={'span'}>(Milne Edwards and Haime, 1848)</Text></Link>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiFootprint}/>
                            <span>
                                <strong>Characters: </strong>
                                <em>Colonies are encrusting and usually small. Corallites are cerioid, with irregular angular shapes. A central corallite is often conspicuous. Septa are compact and columellae are small. Colonies are not fleshy.</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={IoIosColorFilter}/>
                            <span>
                                <strong>Color: </strong>
                                <em>Usually pale grey, brown or rust coloured, often mottled.</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiDuality}/>
                            <span>
                                <strong>Similar Species: </strong>
                                <em>Sometimes superficially resembles small colonies of Moseleya latistellata. If a central corallite is inconspicuous it resembles Favites. See also Acanthastrea hemprichii and A. rotundoflora.</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiAlgae}/>
                            <span>
                                <strong>Habitat: </strong>
                                <em>Lower reef slopes protected from wave action.</em>
                            </span>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={GiMeshNetwork}/>
                            <span>
                                <strong>Abundance: </strong>
                                <em>Rare except in subtropical localities of eastern Australia.</em>
                            </span>
                        </ListItem>
                        <br/>
                        <ListItem>
                            <ListIcon as={GrNotes}/>
                            <span>
                                <strong>Taxonomic Note: </strong>
                                <em>The type species of Calathiscus Claereboudt and Al-Amri, 2004. Placed in Goniopora by Kitano, Benzoni, Arrigoni et al. (2014), but the septal configuration clearly distinguishes this species from any Goniopora.</em>
                            </span>
                        </ListItem>
                    </List>
                </Box>
                <Box>
                    <AspectRatio ratio={4 / 3}>
                        <MediaCarousel/>
                    </AspectRatio>
                </Box>
            </SimpleGrid>
        </Container>
    );
}

function MediaCarousel() {
    const images = [
        {
            original: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjHtclol2ybfX4e9xDm3kQrkwSZib79Cajtw&usqp=CAU',
            thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjHtclol2ybfX4e9xDm3kQrkwSZib79Cajtw&usqp=CAU',
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
    ];
    return (
        <ImageGallery items={images}
                      showPlayButton={false} showNav={false} thumbnailPosition={'top'}/>
    )
}
