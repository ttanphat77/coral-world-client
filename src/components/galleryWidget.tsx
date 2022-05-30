import React, {useEffect} from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Center,
    CircularProgress,
    Collapse,
    Flex,
    IconButton,
    Progress,
    Spacer,
    Stack, Text, useDisclosure
} from "@chakra-ui/react";
import {useSelector, useDispatch} from "react-redux";
import {ChevronDownIcon, ChevronUpIcon, CloseIcon} from "@chakra-ui/icons";
import {FcPicture, FcVideoCall} from "react-icons/fc";
import {BiPhotoAlbum} from "react-icons/bi";
import {socket} from "../App";
import {updateFileStatus, clear} from "../services/uploaderSlice";
import UserMediaServices from "../services/userMediaServices";

export default function GalleryWidget() {
    const list = useSelector((state: any) => state.uploader.list);
    const defaultIndexs = list.map((item: any, index: number) => index);
    const dispatch = useDispatch();
    const {isOpen, onToggle} = useDisclosure()

    useEffect(() => {
        socket.on('updatedFile', (resp) => {
            console.log(resp);

            UserMediaServices.get(resp.data).then((resp: any) => {
                dispatch(updateFileStatus({
                    albumId: resp.data.albumId,
                    userMediaId: resp.data.userMediaId,
                    status: resp.data.status,
                }));
            });
        })
    })

    const close = () => {
        dispatch(clear());
    }

    return (<Box
        hidden={list.length === 0}
        background={'white'}
        position={'fixed'}
        borderRadius={'10px 10px 0 0'}
        overflow={'hidden'}
        zIndex={3}
        bottom={0}
        right={50}
        width={'450px'}>
        <Flex padding={2} gap={2} background={'blackAlpha.700'}>
            <Spacer/>
            {
                isOpen ?
                    <IconButton aria-label={'collapse'} onClick={onToggle} icon={<ChevronDownIcon/>} size={'sm'}/>
                    : <IconButton aria-label={'collapse'} onClick={onToggle} icon={<ChevronUpIcon/>} size={'sm'}/>
            }
            <IconButton aria-label={'close'} icon={<CloseIcon/>} size={'sm'} onClick={close}/>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
            <Stack
                spacing={0}
                overflowX={'hidden'}
                maxH={'400px'}>
                {
                    list.map((album: any) => {
                        return (
                            <Accordion allowMultiple defaultIndex={defaultIndexs}>
                                <AccordionItem>
                                    <h3>
                                        <AccordionButton>
                                            <Box flex='1' textAlign='left'>
                                                <Flex gap={2}>
                                                    <Center><BiPhotoAlbum/></Center>{album.name}
                                                </Flex>
                                            </Box>
                                            <AccordionIcon/>
                                        </AccordionButton>
                                    </h3>
                                    <AccordionPanel>
                                        <Stack spacing={0}>
                                            {
                                                album.files.map((file: any) => {
                                                    return (
                                                        <Flex gap={2} py={2}>
                                                            <Center>
                                                                {
                                                                    file.isImage ?
                                                                        <FcPicture fontSize={20}/>
                                                                        : <FcVideoCall fontSize={20}/>
                                                                }
                                                            </Center>
                                                            <Text fontSize='sm' whiteSpace={'nowrap'} maxWidth={'60%'}
                                                                  overflow={"hidden"} textOverflow={'ellipsis'}>
                                                                {file.name}
                                                            </Text>
                                                            <Spacer/>
                                                            <Text fontSize='sm' whiteSpace={'nowrap'}
                                                                  overflow={"hidden"} textOverflow={'ellipsis'}>
                                                                {file.status == 0 && <>Uploading <CircularProgress value={file.progress} size='25px'/></>}
                                                                {file.status == 1 && <>Detecting <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 2 && <>Classifying <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 3 && <>Generating result <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 4 && <>Extracting frames <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 5 && <>Processing frames <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 6 && <>Generating result <CircularProgress size='25px' isIndeterminate color='green.300'/></>}
                                                                {file.status == 7 && 'Done!'}
                                                                {file.status == 8 && 'Done!'}
                                                            </Text>
                                                        </Flex>
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        )
                    })
                }
            </Stack>
        </Collapse>
    </Box>);
}
