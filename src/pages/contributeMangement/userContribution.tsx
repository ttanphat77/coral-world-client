import React from 'react';
import {
    Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel,
} from "@chakra-ui/react";
import DraftTable from "./draftTable";
import MediaContributeTable from "./mediaContributeTable";

export default function UserContribution() {
    return (
        <Container maxW={"container.xl"} p={2}>
            <Heading as='h2' size='xl'>
                My Contribution
            </Heading>
            <Tabs>
                <TabList>
                    <Tab>Factsheet</Tab>
                    <Tab>Media</Tab>
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
