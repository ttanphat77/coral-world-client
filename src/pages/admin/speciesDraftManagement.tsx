import React, {useEffect} from 'react';
import {Badge, Container, Heading, HStack} from "@chakra-ui/react";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Simulate} from "react-dom/test-utils";
import SpeciesDraftServices from "../../services/speciesDraftServices";
import AccountServices from "../../services/accountServices";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import {DeleteDraft} from "../contributeMangement/draftTable";

const draftStatus = [
  {
    value: "1",
    label: "Pending"
  },
  {
    value: "2",
    label: "Published"
  },
  {
    value: "3",
    label: "Rejected"
  },
  {
    value: "4",
    label: "Overwritten"
  }
];


export default function SpeciesDraftManagement() {
  const [drafts, setDrafts] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [species, setSpecies] = React.useState<any[]>([]);

  useEffect(() => {
    loadData();
    loadDrafts();
  }, []);


  const loadDrafts = () => {
    SpeciesDraftServices.getAll().then(res => {
      setDrafts(res.data);
    });
  }

  const loadData = () => {
    AccountServices.getAll().then(res => {
      setUsers(res.data);
    });
    CoralSpeciesServices.getAll().then(res => {
      setSpecies(res.data);
    });
  }

  const data = drafts.map((d: any) => {
    d.species = species.find((s: any) => s.coralSpeciesId == d.coralSpeciesId);
    d.account = users.find((u: any) => u.accountId == d.author);
    return {
      name: d.species ? d.species.scientificName + ' (' + d.species.authorCitation + ')': '',
      author: d.account ? d.account.firstName + ' ' + (d.account.lastName ? d.account.lastName : '') : '',
      status: draftStatus.find((s: any) => s.value == d.status)?.label,
      date: d.createdTime,
      draft: d
    }
  })

  const columns = React.useMemo(
      () => [
        {
          Header: 'Species',
          accessor: 'name' as const,
        },
        {
          Header: 'Author',
          accessor: 'author' as const,
        },
        {
          Header: 'Status',
          accessor: 'status' as const,
          Cell: ({cell}: { cell: any }) => (
              <>
                {cell.value == 'Pending' ? <Badge colorScheme={'blue'}>Pending</Badge> : ''}
                {cell.value == 'Published' ? <Badge colorScheme={'green'}>Published</Badge> : ''}
                {cell.value == 'Rejected' ? <Badge colorScheme={'red'}>Rejected</Badge> : ''}
                {cell.value == 'Overwritten' ? <Badge>Overwritten</Badge> : ''}
              </>
          ),
          Filter: OptionFilter,
          filter: 'includes',
          disableSortBy: true
        },
        {
          Header: 'Created date',
          accessor: 'date' as const,
          Cell: (props: any) => <>{(new Date(props.value)).toLocaleString()}</>,
          disableFilters: true,
        },
        {
          id: 'edit-button',
          Cell: ({row}: { row: any }) =>
              <HStack spacing={2}>
              </HStack>,
        },
      ],
      [],
  ) as any

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
          Species factsheet draft
        </Heading>
        <Datatable data={data} columns={columns} sortBy={sortBy}/>
      </Container>
  );
}
