import React, {useRef} from 'react';
import {Editor} from "@tinymce/tinymce-react";
import {
    AspectRatio,
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input, SimpleGrid,
    Stack,
    Image,
    Textarea,
    Box,
    Center, Text, Flex, Spacer, HStack
} from '@chakra-ui/react';
import storage from "../../services/firebaseServices";
import {Select} from "chakra-react-select";

export default function ArticleEditor() {
    const editorRef = useRef<any>(null);


    const inputFileRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const editorInit = {
        min_height: 400,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'editimage', 'charmap', 'emoticons',
            'searchreplace', 'code', 'media', 'help', 'wordcount', 'autoresize', 'codesample'
        ],
        toolbar: 'undo redo | blocks | bold italic forecolor | ' +
            'link image media charmap emoticons codesample | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | code help',
        image_caption: true,
        toolbar_sticky: true,
        toolbar_sticky_offset: 60,
        file_picker_callback: (callback: any, value: any, meta: any) => {
            if (meta.filetype === 'image') {
                if (inputFileRef.current) {
                    inputFileRef.current.click();
                    inputFileRef.current.onchange = () => {
                        if (inputFileRef.current && inputFileRef.current.files) {
                            const file = inputFileRef.current.files[0];
                            if (file) {
                                const name = file.name + '_' + new Date().getTime();
                                storage.ref(`articles/${name}`).put(file)
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
                                        storage.ref(`articles/${name}`).getDownloadURL().then((url: any) => {
                                            callback(url, {alt: file.name});
                                        });
                                    });
                            }
                        }
                    };
                }
            }
        },
        // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };

    return (
        <>
            <Container maxW={'container.xl'} py={2}>
                <Stack spacing={4}>
                    <Heading as='h2' size='lg'>
                        Article draft
                    </Heading>
                    <FormControl id="title">
                        <FormLabel>Title</FormLabel>
                        <Input size={'lg'}></Input>
                    </FormControl>
                    <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                        <Stack>
                            <FormControl id="tags">
                                <FormLabel>Tags</FormLabel>
                                <Select
                                    isMulti
                                    closeMenuOnSelect={false}
                                    selectedOptionStyle="check"
                                    hideSelectedOptions={false}
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 2})}}
                                    options={[
                                        {
                                            label: "News",
                                            value: "1",
                                        },
                                        {
                                            label: "Coral",
                                            value: "2",
                                        },
                                        {
                                            label: "Environment",
                                            value: "3",
                                        },
                                        {
                                            label: "Science",
                                            value: "4",
                                        },
                                        {
                                            label: "Research",
                                            value: "5",
                                        },
                                    ]}
                                />
                            </FormControl>
                            <FormControl id="lead">
                                <FormLabel>Lead</FormLabel>
                                <Textarea placeholder={'Lead paragraph for article'} h={'138px'}></Textarea>
                            </FormControl>
                        </Stack>
                        <Box height={'250px'} cursor={'pointer'} onClick={() => thumbnailInputRef?.current?.click()}>
                            <Center bg='gray.200' h={'100%'} color='gray.700'>
                                <Text fontSize='3xl'>Add thumbnail</Text>
                            </Center>
                            {/*<Image src='https://miro.medium.com/max/1400/1*JsW9FiNpc6pv0M3pTAe2eA.jpeg' alt='naruto' objectFit='cover' boxSize={'100%'}/>*/}
                        </Box>
                        <Input type={'file'} ref={thumbnailInputRef} accept={'image/*'} display={'none'}/>
                    </SimpleGrid>
                    <Editor
                        apiKey={'2yigo6um2aq207gcvw7a4geh74yql076jmg7y6r14ogk9dnb'}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue="<p>This is the initial content of the editor.</p>"
                        init={editorInit}
                    />
                    <Input type="file" ref={inputFileRef} accept={'image/*'} display={'none'}/>
                    <HStack spacing={4}>
                        <Button colorScheme={'green'}>Submit</Button>
                        <Button colorScheme={'gray'}>Save draft</Button>
                    </HStack>
                </Stack>
            </Container>
        </>
    );
}
