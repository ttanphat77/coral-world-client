import React, {useEffect} from "react";
import {
  Badge,
  Button,
  Container, FormControl, FormErrorMessage, FormLabel,
  Heading,
  HStack,
  IconButton, Input, Link,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Select, Stack, Tag,
  useDisclosure
} from "@chakra-ui/react";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useTable, useSortBy} from 'react-table'
import {useFormik} from "formik";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Datatable, {OptionFilter} from "../../components/datatable";
import AlbumServices from "../../services/albumServices";
import * as Yup from "yup";
import {useAuth} from "../../hooks/useAuth";

export default function UserArticles() {

  const data = [
    {
      title: 'Our Blue Planet, On Earth Day',
      tags: ['News', 'Coral'],
      status: 'Submitted',
      date: new Date()
    },
    {
      title: 'To Protect Coral Reefs, We Must Protect the Ocean',
      tags: ['Coral', 'Environment'],
      status: 'Draft',
      date: new Date()
    },
    {
      title: 'When it Comes to Our Ocean, We Must Till and Keep It',
      tags: ['News', 'Environment'],
      status: 'Published',
      date: new Date()
    }
  ];

  const columns = [
    {
      Header: 'Title',
      accessor: 'title' as const,
    },
    {
      Header: 'Tags',
      accessor: 'tags' as const,
      Cell: ({row}: { row: any }) =>
          <HStack spacing={2}>
            {row.values.tags.map((tag: string) => (
                <Tag>{tag}</Tag>
            ))}
          </HStack>,
    },
    {
      Header: 'Status',
      accessor: 'status' as const,
      Cell: ({cell}: { cell: any }) => (
          <>
            {cell.value == 'Submitted' ? <Badge colorScheme={'blue'}>Submitted</Badge> : ''}
            {cell.value == 'Published' ? <Badge colorScheme={'green'}>Published</Badge> : ''}
            {cell.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
            {cell.value == 'Draft' ? <Badge>Draft</Badge> : ''}
          </>
      ),
      Filter: OptionFilter,
      filter: 'includes',
      disableSortBy: true
    },
    {
      Header: 'Created date',
      accessor: 'date' as const,
      disableFilters: true,
      Cell: (props: any) => <>{(new Date(props.value)).toLocaleString()}</>
    },
    {
      id: 'edit-button',
      Cell: ({row}: { row: any }) =>
          <HStack spacing={2}>
            <IconButton aria-label='Add to friends' icon={<EditIcon/>} color={'#005A80'}/>
            <IconButton aria-label='Add to friends' icon={<DeleteIcon/>} colorScheme={'red'}/>
          </HStack>,
    },
  ];

  return (
      <Container maxW={"container.xl"} p={2}>
        <Heading as='h2' size='xl'>
          My Articles <NewArticle/>
        </Heading>
        <Datatable columns={columns} data={data}/>
      </Container>
  );
}

const validationSchema = Yup.object({
  albumName: Yup.string()
      .required('Album name is required'),
  areaId: Yup.number()
      .required('Area is required'),
});

export function NewArticle() {
  const user = useAuth().user;

  const {isOpen, onOpen, onClose} = useDisclosure()
  return (
      <>
        <IconButton aria-label='Add to friends' icon={<AddIcon/>} color={'#005A80'}
                    onClick={onOpen}/>

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>New article</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <form>
                <Stack spacing={4}>
                  <FormControl id="albumName" isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input placeholder={'Input article title'}/>
                  </FormControl>
                </Stack>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={'blue'}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}

export function AlbumDelete({
                              album, reload = () => {
  }
                            }: { album?: any, reload?: () => void }) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const deleteAlbum = () => {
    AlbumServices.remove(album.albumId).then(() => {
      onClose();
      reload();
    })
  }

  return (
      <>
        <IconButton aria-label='Add to friends' icon={<DeleteIcon/>} colorScheme={'red'}
                    onClick={onOpen}/>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Delete album</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <p>Are you sure you want to delete this album?</p>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={'red'} onClick={() => deleteAlbum()}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}
