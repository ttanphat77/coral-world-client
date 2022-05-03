import React, {useEffect, useRef} from 'react';
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
import {useNavigate, useParams} from "react-router-dom";
import ArticleServices from "../../services/articleService";
import ArticleTagsServices from "../../services/articleTagServices";
import {useFormik} from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Article title is required'),
});

export default function ArticleEditor() {
    const editorRef = useRef<any>(null);
    let {id} = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = React.useState<any>({});
    const [tags, setTags] = React.useState<any[]>([]);
    const [articleTags, setArticleTags] = React.useState<any[]>([]);
    const [thumbnail, setThumbnail] = React.useState<any>(null);

    useEffect(() => {
        loadData();
        if (id) {
            ArticleServices.get(id).then(res => {
                setArticle(res.data)
                // editorRef.current.setContent(res.data.articleContent);
            });
            ArticleTagsServices.getByArticle(id).then(res => {
                setArticleTags(res.data.filter((tag: any) => tag.tagId != 1).map((tag: any) => {
                    return {value: tag.tagId, label: tag.tagName}
                }));
            });
        }
    }, []);

    const loadData = () => {
        ArticleTagsServices.getAll().then(res => {
            setTags(res.data)
        })
    }


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
        readOnly: article?.status == 4,
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

    const handleFileChange = (e: any) => {
        const files = e.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    setThumbnail({
                        name: file.name,
                        src: e.target.result,
                        description: '',
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            articleId: article?.articleId,
            title: article?.title || '',
            lead: article?.lead || '',
            articleContent: article?.articleContent || '',
            thumpnail: article?.thumpnail || '',
            author: article?.author,
            status: article?.status || 1,
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.isValid) {
                values.articleContent = editorRef.current.getContent();
                if (thumbnail && thumbnail.file) {
                    const name = thumbnail.file.name + '_' + new Date().getTime();
                    storage.ref(`articles/${name}`).put(thumbnail.file)
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
                                values.thumpnail = url;
                                handleSubmit(values);
                            });
                        });
                } else {
                    handleSubmit(values);
                }

                // ArticleServices.create(values).then(() => {
                //     navigate(`/researcher/articles`);
                // });
                // handleSubmit(values);

                ArticleTagsServices.addTags(values.articleId, articleTags.map((t: any) => t.value)).then(() => {
                    navigate(`/researcher/articles`);
                });
            }
        },
    })

    const handleSubmit = (values: any) => {
        ArticleServices.update(values).then(() => {
            navigate(`/researcher/articles`);
        });
    }

    const submitArticle = () => {
        formik.setFieldValue('status', 2);
        formik.handleSubmit();
    }

    const unpublishArticle = () => {
        formik.setFieldValue('status', 5);
        formik.handleSubmit();
    }

    return (
        <>
            <Container maxW={'container.xl'} py={2}>
                <Stack spacing={4}>
                    <Heading as='h2' size='lg'>
                        Article draft
                    </Heading>
                    <FormControl id="title" isRequired
                                 isInvalid={Boolean(formik.touched?.title && formik.errors?.title)}>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder={'Input article title'} value={formik.values.title}
                               onChange={formik.handleChange} onBlur={formik.handleBlur}
                                readOnly={article.status == 4}/>
                        <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                    </FormControl>
                    <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                        <Stack>
                            <FormControl id="tags">
                                <FormLabel>Tags</FormLabel>
                                <Select
                                    isDisabled={article.status == 4}
                                    isReadOnly={article.status == 4}
                                    value={articleTags}
                                    onChange={(value: any) => {
                                        setArticleTags(value);
                                    }}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    selectedOptionStyle="check"
                                    hideSelectedOptions={false}
                                    menuPortalTarget={document.body}
                                    styles={{menuPortal: base => ({...base, zIndex: 2})}}
                                    options={tags.filter(tag => tag.tagId != 1).map((tag: any) => ({label: tag.tagName, value: tag.tagId}))}
                                />
                            </FormControl>
                            <FormControl id="lead">
                                <FormLabel>Lead</FormLabel>
                                <Textarea placeholder={'Lead paragraph for article'} h={'138px'}
                                          value={formik.values.lead} readOnly={article.status == 4}
                                          onChange={formik.handleChange} onBlur={formik.handleBlur}></Textarea>
                            </FormControl>
                        </Stack>
                        <Box height={'250px'} cursor={'pointer'} onClick={() => {
                            if (article.status == 4) {
                                return;
                            }
                            thumbnailInputRef?.current?.click();
                        }}>
                            {
                                article?.thumpnail || thumbnail ?
                                    <Image src={thumbnail?.src || article?.thumpnail} alt='naruto' objectFit='cover'
                                           boxSize={'100%'}/> :
                                    <Center bg='gray.200' h={'100%'} color='gray.700'>
                                        <Text fontSize='3xl'>Add thumbnail</Text>
                                    </Center>
                            }
                        </Box>
                        <Input type={'file'} ref={thumbnailInputRef} accept={'image/*'} display={'none'}
                               onChange={handleFileChange}/>
                    </SimpleGrid>
                    <Editor
                        apiKey={'2yigo6um2aq207gcvw7a4geh74yql076jmg7y6r14ogk9dnb'}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={article?.articleContent}
                        init={editorInit}
                    />
                    <Input type="file" ref={inputFileRef} accept={'image/*'} display={'none'}/>
                    <HStack spacing={4}>
                        {
                            article?.status != 4 ? (
                                <>
                                    <Button colorScheme={'green'} onClick={submitArticle}>Submit</Button>
                                    <Button colorScheme={'gray'} onClick={() => formik.handleSubmit()}>Save draft</Button>
                                </>
                            ) : <Button colorScheme={'yellow'} onClick={unpublishArticle}>Unpublish</Button>
                        }
                    </HStack>
                </Stack>
            </Container>
        </>
    );
}
