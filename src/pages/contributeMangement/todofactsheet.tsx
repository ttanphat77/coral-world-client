import React, {useEffect, useState} from 'react';
import {
    Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Link,
} from "@chakra-ui/react";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Link as RouterLink} from 'react-router-dom';
import CoralGenusServices from "../../services/coralGenusServices";
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function Todofactsheet() {
    const [todoFactsheet, setTodoFactsheet] = React.useState<any[]>([]);
    const [genusList, setGenusList] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);


    const load = () => {
        CoralSpeciesServices.getEmpty().then(res => {
            setTodoFactsheet(res.data);
        });
        CoralGenusServices.getAll().then((res: any) => {
            setGenusList(res.data);
        });
    }

    const data = todoFactsheet.map((s: any) => {
        return {
            genus: genusList.find((g: any) => g.coralGenusId === s.parentId)?.scientificName ?? "",
            author: s.authorCitation,
            date: s.createdTime,
            coral: s
        }
    })

    const columns = [
        {
            Header: 'Name',
            accessor: 'coral',
            Cell: (props: any) =>
                <Link as={RouterLink} to={'/taxonomy/' + props.value.coralSpeciesId} target={'_blank'}>
                    {props.value.scientificName} ({props.value.authorCitation}) <ExternalLinkIcon mx='2px' />
                </Link>
        },
        {
            Header: 'Genus',
            accessor: 'genus' as const,
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
                Todo factsheet
            </Heading>
            <Datatable data={data} columns={columns} sortBy={sortBy}/>
        </Container>
    );
}
