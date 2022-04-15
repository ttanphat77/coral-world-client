import React, {useEffect, useState} from 'react';
import {
    Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Link,
} from "@chakra-ui/react";
import CoralSpeciesServices from "../../services/coralSpeciesServices";
import Datatable, {OptionFilter} from "../../components/datatable";
import {Link as RouterLink} from 'react-router-dom';
import CoralGenusServices from "../../services/coralGenusServices";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import DraftTable from "./draftTable";
import MediaContributeTable from "./mediaContributeTable";

export default function ImageLabeling() {
    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                Label coral images
            </Heading>
            <Tabs>
                <TabList>
                    <Tab>Suggest label</Tab>
                    <Tab>Verify label</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <DraftTable />
                    </TabPanel>
                    <TabPanel>
                        <MediaContributeTable/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

