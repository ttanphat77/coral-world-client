import React, {useEffect, useState} from "react";
import {
  Badge, Button,
  Container, FormControl, FormErrorMessage, FormLabel,
  Heading,
  HStack,
  IconButton, Input,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Select, Stack, Text, Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {useFormik} from "formik";
import * as Yup from "yup";
import DivingSessionServices from "../../services/divingSessionServices";
import AreaServices from "../../services/areaServices";
import {DatePicker} from "../../components/datePicker";

export default function DivingSessionManagement() {
  const [divingSessionList, setDivingSessionList] = useState<any[]>([]);
  const [areaList, setAreaList] = useState<any[]>([]);


  useEffect(() => {
    loadDivingSession()
    loadArea()
  }, []);

  const loadDivingSession = () => {
    DivingSessionServices.getAll().then((res: any) => {
      setDivingSessionList(res.data);
    });
  };

  const loadArea = () => {
    AreaServices.getAll().then((res: any) => {
      setAreaList(res.data);
    });
  };

  const data =  divingSessionList.map((s: any) => {
    return {
      name: s.divingSessionName,
      area: areaList.find((g: any) => g.areaId === s.areaId)?.areaName ?? "",
      agency: s.agency,
      startTime: s.startTime,
      endTime: s.endTime,
      date: s.createdTime,
      session: s
    }})

  const columns = [
        {
          Header: 'Name',
          accessor: 'name' as const,
        },
        {
          Header: 'Agency',
          accessor: 'agency' as const,
        },
        {
          Header: 'Area',
          accessor: 'area' as const,
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
                <DivingSessionForm session={row.original.session} area={areaList} reload={loadDivingSession}/>
                <DeleteSession session={row.original.session} reload={loadDivingSession}/>
              </HStack>,
        },
      ] as any

  const sortBy = React.useMemo(
      () => [
        {
          id: 'date',
          desc: true,
        },
      ],
      [],
  ) as any

  return (
      <Container maxW={"container.xl"} p={2}>
        <Heading as='h2' size='xl'>
          Diving session <DivingSessionForm area={areaList} reload={loadDivingSession}/>
        </Heading>
        <Datatable data={data} columns={columns} sortBy={sortBy}/>
      </Container>
  );
}

const validationSchema = Yup.object({
  divingSessionName: Yup.string()
      .required('Diving session name is required'),
  areaId: Yup.number()
      .required('Area is required'),
  startTime: Yup.date()
      .required('Start time is required'),
  endTime: Yup.date()
      .required('End time is required'),
});

function DivingSessionForm({session, area, reload}: { session?: any, area: any[], reload: () => void }) {

  const {isOpen, onOpen, onClose} = useDisclosure();
  const formik = useFormik({
    initialValues: {
      divingSessionId: session ? session.divingSessionId : 0,
      divingSessionName: session ? session.divingSessionName : "",
      areaId: session ? session.areaId : '',
      agency: session ? session.agency : "",
      agencyInformation: session ? session.agencyInformation : "",
      startTime: session ? new Date(session.startTime) : null,
      endTime: session ? new Date(session.startTime) : null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (formik.isValid) {
        if(values.divingSessionId === 0) {
          DivingSessionServices.create(values).then(() => {
            reload();
            onClose();
          });
        } else {
          DivingSessionServices.update(values).then(() => {
            reload();
            onClose();
          });
        }
      }
    },
  })
  return (
      <>
        <IconButton aria-label={'edit'} variant={'solid'} icon={session ? <EditIcon/> :  <AddIcon/>} onClick={onOpen}></IconButton>
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'} closeOnOverlayClick={false}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>
              { session ? 'Edit diving session' : 'New diving session'}
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <form>
                <Stack spacing={4} mt={4}>
                  <FormControl id="divingSessionName" isRequired
                               isInvalid={Boolean(formik.touched?.divingSessionName && formik.errors?.divingSessionName)}>
                    <FormLabel htmlFor="divingSessionName">Diving session name</FormLabel>
                    <Input id="divingSessionName" name="divingSessionName"
                           value={formik.values.divingSessionName}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           placeholder={'Enter diving session name'}/>
                    <FormErrorMessage>
                      {formik.errors?.divingSessionName}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id={'areaId'} isRequired
                               isInvalid={Boolean(formik.touched?.areaId && formik.errors?.areaId)}>
                    <FormLabel htmlFor={'areaId'}>Area</FormLabel>
                    <Select id={'areaId'} name={'areaId'}
                            value={formik.values.areaId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                      <option value={''}>None</option>
                      {area.map((a: any) =>
                          <option key={a.areaId} value={a.areaId}>{a.areaName}</option>
                      )}
                    </Select>
                    <FormErrorMessage>
                      {formik.errors?.areaId}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="agency">
                    <FormLabel htmlFor="agency">Agency</FormLabel>
                    <Input id="agency" name="agency"
                           value={formik.values.agency}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           placeholder={'Enter agency'}/>
                  </FormControl>
                  <FormControl id="agencyInformation">
                    <FormLabel>Agency information</FormLabel>
                    <Textarea value={formik.values.agencyInformation}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="agencyInformation"
                              id="agencyInformation"
                              placeholder="Enter characters"/>
                  </FormControl>
                  <FormControl id="startTime" isRequired isInvalid={Boolean(formik.touched?.startTime && formik.errors?.startTime)}>
                    <FormLabel htmlFor="startTime">Start time</FormLabel>
                    <DatePicker
                        name="startTime"
                        id="startTime"
                        showTimeSelect
                        selected={formik.values.startTime}
                        onBlur={formik.handleBlur}
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        onChange={(date: any) => {
                          formik.setFieldValue('startTime', date);
                        }}
                    />
                    <FormErrorMessage>
                      {formik.errors?.divingSessionName}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl id="endTime" isRequired isInvalid={Boolean(formik.touched?.endTime && formik.errors?.endTime)}>
                    <FormLabel htmlFor="endTime">End time</FormLabel>
                    <DatePicker
                        name="endTime"
                        id="endTime"
                        showTimeSelect
                        selected={formik.values.endTime}
                        onBlur={formik.handleBlur}
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        onChange={(date: any) => {
                          formik.setFieldValue('endTime', date);
                        }}
                    />
                    <FormErrorMessage>
                      {formik.errors?.divingSessionName}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' onClick={() => formik.handleSubmit()}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  )
}

export function DeleteSession({ session, reload = () => {}}: { session: any, reload?: () => void }) {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const deleteSession = () => {
    DivingSessionServices.delete(session.divingSessionId).then(() => {
      onClose();
      reload();
    })
  }

  return (
      <>
        <IconButton aria-label='Delete' icon={<DeleteIcon/>} colorScheme={'red'}
                    onClick={onOpen}/>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Delete diving session</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <p>Are you sure you want to delete this diving sesion?</p>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={'red'} onClick={() => deleteSession()}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  );
}
