import React, { useRef } from 'react';
import {Editor} from "@tinymce/tinymce-react";
import { Container } from '@chakra-ui/react';

export default function ArticleEditor() {
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const editorInit = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor code image | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
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
          <button onClick={log}>Log editor content</button>
        </Container>
      </>
  );
}
