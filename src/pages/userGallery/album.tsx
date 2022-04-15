import React, {useEffect} from "react";
import {
    AspectRatio, Box, Button, CloseButton, Container,
    Divider, Heading, Image, Input, SimpleGrid, Textarea, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stack, Text, ModalFooter,
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {useParams} from "react-router-dom";
import AlbumServices from "../../services/albumServices";
import UserMediaServices from "../../services/userMediaServices";
import storage from "../../services/firebaseServices";
import video_file from "../../assets/video_file.png";
import {Simulate} from "react-dom/test-utils";

export default function Album() {

    const [album, setAlbum] = React.useState<any>(null);
    const [medias, setMedias] = React.useState<any[]>([]);
    const {id} = useParams();

    useEffect(() => {
        loadAlbum();
        loadMedia();
    }, []);


    const loadAlbum = () => {
        AlbumServices.get(id).then((res: any) => {
            setAlbum(res.data);
        });
    };

    const loadMedia = () => {
        UserMediaServices.getByAlbum(id).then((res: any) => {
            setMedias([]);
            setMedias(res.data);
        });
    };


    const inputFileRef = React.useRef<HTMLInputElement>(null);

    const openFileInput = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const uploadFiles = (e: any) => {
        const files = e.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                storage.ref(`usermedia/${album.albumName}/${file.name}`).put(file)
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
                        storage.ref(`usermedia/${album.albumName}/${file.name}`).getDownloadURL().then((url: any) => {
                            UserMediaServices.create({
                                albumId: album.albumId,
                                isImage: file.type.includes('image'),
                                caption: "",
                                mediaURL: url,
                            }).then((res: any) => {
                                AlbumServices.get(id).then((res: any) => {
                                    res.data.find((media: any) => {
                                        if (media.mediaURL === url) {
                                            UserMediaServices.triggerDetect(media.userMediaId);
                                        }
                                    });
                                    setAlbum(res.data);
                                });
                            });
                        });
                    });
            }
        }
    };

    const deleteFile = (media: any) => {
        UserMediaServices.delete(media.userMediaId).then((res: any) => {
            loadMedia();
        });
    };

    const updateCaption = (media: any, caption: string) => {
        media.caption = caption;
        UserMediaServices.update(media).then((res: any) => {
            setMedias(medias.map((m: any) => m.userMediaId === media.userMediaId ? media : m));
        });
    };

    return (
        <Container maxW={'container.xl'} p={2}>
            <Input type="file" multiple ref={inputFileRef} accept={'image/*, video/*'} display={'none'}
                   onChange={uploadFiles}/>
            <Heading as={'h2'} size={'xl'}>{album?.albumName}
                <Button ml={2} onClick={openFileInput} leftIcon={<AddIcon/>}>Upload</Button></Heading>
            <Divider my={4}/>
            <SimpleGrid columns={[1, 2, 3, 5]} spacing={4}>
                {medias?.map((media: any) => (
                    <Media data={media} deleteMedia={deleteFile} updateCaption={updateCaption}/>
                ))}
            </SimpleGrid>
        </Container>);
}

function Media({data, updateCaption, deleteMedia}: { data: any, updateCaption: any, deleteMedia: any }) {

    const {isOpen: isViewerOpen, onClose: onViewerClose, onOpen: onViewerOpen} = useDisclosure();
    const [url, setUrl] = React.useState<string>();
    const [isShowDetect, setIsShowDetect] = React.useState<boolean>();
    const [media, setMedia] = React.useState<any>(data);

    useEffect(() => {
    }, []);


    const toggleDetectImage = () => {
        if(isShowDetect) {
            setIsShowDetect(false);
            setUrl(media.mediaURL);
        } else {
            setIsShowDetect(true);
            setUrl(media.detectedMediaURL);
        }
    };

    const loadImage = () => {
        UserMediaServices.get(data.userMediaId).then((res: any) => {
            setMedia(res.data);
            setUrl(res.data.mediaURL);
            setIsShowDetect(false);
        });
    };

    return (
        <Box w={'100%'}
             position={'relative'}
             transition="0.3s ease-in-out"
             _hover={{
                 transform: 'scale(1.05)',
             }}>
            <MediaDelete media={media} deleteMedia={deleteMedia} />
            <AspectRatio w={'100%'} ratio={1}>
                <Box borderRadius={10}
                     onClick={() => {onViewerOpen();loadImage();}}>
                    <Image
                        cursor={'pointer'}
                        boxSize={'100%'}
                        objectFit={'cover'}
                        src={media?.isImage ? media?.mediaURL : video_file}/>
                </Box>
            </AspectRatio>
            <Textarea w={'100%'} variant={'filled'} mt={2} placeholder={'Description (optional)'} defaultValue={media?.caption}
                      onBlur={(e: any) => updateCaption(media, e.target.value)}
                      onKeyDown={(e: any) => {
                          if (e.key === 'Enter') {
                              e.target.blur();
                          }
                      }}/>
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
                                {
                                    media?.isImage ?
                                        <Image
                                            boxSize={'100%'}
                                            objectFit={'contain'}
                                            src={url}/> :
                                        <video
                                            controls
                                            src={url}/>
                                }
                            </Box>
                            <Box>
                                <Stack>
                                    <Text>
                                        <strong>Description: </strong>
                                        <em>
                                            {media?.caption}</em>
                                    </Text>
                                    <Text>
                                        <strong>Coral detect: </strong>
                                        {
                                            media?.isDetected ?
                                                <Button onClick={toggleDetectImage}>
                                                    {!isShowDetect ? 'Show detected' : 'Show origin'}
                                                </Button> :
                                                <em style={{color: 'green'}}>Processing...</em>
                                        }
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

function MediaDelete({media, deleteMedia}: { media: any, deleteMedia: any }) {
    const {isOpen: isDeleteOpen, onClose: onDeleteClose, onOpen: onDeleteOpen} = useDisclosure();

    return (
        <>
            <Box
                position={'absolute'}
                top={1}
                right={1}
                zIndex={1}>
                <CloseButton color={'gray.200'}
                             onClick={onDeleteOpen}
                             _hover={{
                                 border: '2px solid white'
                             }}/>
            </Box>
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Delete media</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Are you sure you want to delete this media?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={'red'} mr={3} onClick={() => {deleteMedia(media);onDeleteClose()}}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
