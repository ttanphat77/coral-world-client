import React, {useEffect} from "react";
import {
    AspectRatio, Box, Button, CloseButton, Container,
    Divider, Heading, Image, Input, SimpleGrid, Textarea, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stack, Text, ModalFooter, Center, Link,
} from "@chakra-ui/react";
import {Link as RouterLink, useParams} from "react-router-dom";
import video_file from "../../assets/video_file.png";
import UserMediaServices from "../services/userMediaServices";
import SpeciesMediaServices from "../services/speciesMediaService";
import CoralSpeciesServices from "../services/coralSpeciesServices";
import {AddIcon, ExternalLinkIcon} from "@chakra-ui/icons";

export default function Gallery() {

    const [medias, setMedias] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(1);
    const [species, setSpecies] = React.useState<any[]>([]);
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const {id} = useParams();

    useEffect(() => {
        loadMedia();
        loadData();
    }, []);

    const loadMedia = () => {
        SpeciesMediaServices.getPaging(page).then((res: any) => {
            setIsLoadMore(res.data.length == 20);
            setMedias(media => [...media, ...res.data]);
            setPage(page + 1);
        });
    };

    const loadData = () => {
        CoralSpeciesServices.getAll().then((res: any) => {
            setSpecies(res.data);
        });
    };

    return (
        <Container maxW={'container.xl'} p={2}>
            <Heading as={'h2'} size={'xl'}>Coral photo gallery</Heading>
            <Divider my={4}/>
            <SimpleGrid columns={[1, 2, 3, 5]} spacing={4}>
                {medias?.map((media: any) => (
                    <Media media={media} species={species}/>
                ))}
            </SimpleGrid>
            <Center pt={8}>
                {
                    isLoadMore &&
                    <Button onClick={loadMedia} colorScheme={'blue'}>Load more</Button>
                }
            </Center>
        </Container>);
}

function Media({media, species}: { media: any, species: any[] }) {

    const {isOpen: isViewerOpen, onClose: onViewerClose, onOpen: onViewerOpen} = useDisclosure();

    useEffect(() => {
    }, []);

    return (
        <Box w={'100%'}
             position={'relative'}
             transition="0.3s ease-in-out"
             _hover={{
                 transform: 'scale(1.05)',
             }}>
            <AspectRatio w={'100%'} ratio={1}>
                <Box borderRadius={10}
                     onClick={() => {onViewerOpen();}}>
                    <Image
                        cursor={'pointer'}
                        boxSize={'100%'}
                        objectFit={'cover'}
                        src={'https://images.weserv.nl/?url=' + media?.mediaURL}/>
                </Box>
            </AspectRatio>
            <Text fontSize={'sm'}><em>{media.caption}</em></Text>
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
                            <Box height={['50vh', '50vh', '70vh']} bg={'black'} alignContent={'center'}
                                 display={'flex'}>
                                        <Image
                                            boxSize={'100%'}
                                            objectFit={'contain'}
                                            src={'https://images.weserv.nl/?url=' + media.mediaURL}/>
                            </Box>
                            <Box>
                                <Stack>
                                    <Text>
                                        <strong>Description: </strong>
                                        <em>
                                            {media?.caption}</em>
                                    </Text>
                                    <Text>
                                        <strong>Species: </strong>
                                        <Link as={RouterLink} to={'/taxonomy/' + media.coralSpeciesId} color={'blue'}>
                                            {species.find((s: any) => s.coralSpeciesId == media.coralSpeciesId)?.scientificName}<ExternalLinkIcon mx='2px'/>
                                        </Link>
                                    </Text>
                                </Stack>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
