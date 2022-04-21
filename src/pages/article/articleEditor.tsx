import React, {useRef} from 'react';
import {Editor} from "@tinymce/tinymce-react";
import {Container, Input} from '@chakra-ui/react';
import storage from "../../services/firebaseServices";

export default function ArticleEditor() {
    const editorRef = useRef<any>(null);


    const inputFileRef = useRef<HTMLInputElement>(null);

    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const editorInit = {
        min_height: 500,
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
                <Editor
                    apiKey={'2yigo6um2aq207gcvw7a4geh74yql076jmg7y6r14ogk9dnb'}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={editorInit}
                />
                <Input type="file" ref={inputFileRef} accept={'image/*'} display={'none'}/>
                <button onClick={log}>Log editor content</button>
            </Container>
        </>
    );
}
