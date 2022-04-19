import * as React from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Checkbox,
    CheckboxGroup,
    Container, FormControl, FormLabel, Input, InputGroup, InputLeftElement,
    Link, List, ListIcon, ListItem,
    SimpleGrid,
    Stack
} from "@chakra-ui/react";
import {GiLightningBranches} from "react-icons/gi";
import {SearchIcon} from "@chakra-ui/icons";
import {Link as RouterLink} from "react-router-dom";
import CoralGenusServices from "../services/coralGenusServices";
import CoralSpeciesServices from "../services/coralSpeciesServices";
import {useEffect} from "react";

export default function Taxonomy() {
    const [searchValue, setSearchValue] = React.useState("");
    const [genus, setGenus] = React.useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        CoralGenusServices.getAll().then(res => {
            setGenus(res.data)
            const genusData = res.data.sort((a: any, b: any) => a.scientificName < b.scientificName ? -1 : a.scientificName > b.scientificName ? 1 : 0);
            genusData.forEach((g: any) => {
                CoralSpeciesServices.getByGenus(g.coralGenusId).then(r => {
                    g.species = r.data.sort((a: any, b: any) => a.scientificName < b.scientificName ? -1 : a.scientificName > b.scientificName ? 1 : 0);
                    setGenus([])
                    setGenus(genusData);
                });
            });
        });
    }

    const handleSearch = (event: any) => {
        setSearchValue(event.target.value);
    };

    return (
        <Container maxW={'container.xl'} py={8}>
            <Stack spacing={8}>
                <Box>
                    <FormControl>
                        <FormLabel htmlFor='coralSpecies'>
                            Find your species</FormLabel>
                        <Stack spacing={4}>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.500'/>}
                                />
                                <Input placeholder='by scientific name' id={'coralSpecie'} bg={'white'}
                                       onChange={e => handleSearch(e)}/>
                            </InputGroup>
                            <CheckboxGroup colorScheme='green' defaultValue={['1', '2']}>
                                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                                    <Checkbox value='1'>Genus</Checkbox>
                                    <Checkbox value='2'>Species</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </Stack>
                    </FormControl>
                </Box>
                {searchValue === '' &&
                <Box>
                    <SimpleGrid columns={[1, 1, 3]} spacing={8}>
                        <Accordion allowMultiple allowToggle>
                            {
                                genus.map((g: any, index) => {
                                    return ( index % 3 == 0 &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species?.map((s: any) => {
                                                            return (
                                                                <ListItem>
                                                                    <ListIcon as={GiLightningBranches}
                                                                              color={'#005A80'}/>
                                                                    <Link
                                                                        as={RouterLink}
                                                                        to={'/taxonomy/' + s.coralSpeciesId}>{s.scientificName}</Link></ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </AccordionPanel>
                                        </AccordionItem>)
                                })
                            }

                        </Accordion>
                        <Accordion allowMultiple allowToggle>
                            {
                                genus.map((g: any, index) => {
                                    return ( index % 3 == 1 &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species?.map((s: any) => {
                                                            return (
                                                                <ListItem>
                                                                    <ListIcon as={GiLightningBranches}
                                                                              color={'#005A80'}/>
                                                                    <Link
                                                                        as={RouterLink}
                                                                        to={'/taxonomy/' + s.coralSpeciesId}>{s.scientificName}</Link></ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </AccordionPanel>
                                        </AccordionItem>)
                                })
                            }

                        </Accordion>
                        <Accordion allowMultiple allowToggle>
                            {
                                genus.map((g: any, index) => {
                                    return ( index % 3 == 2 &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species?.map((s: any) => {
                                                            return (
                                                                <ListItem>
                                                                    <ListIcon as={GiLightningBranches}
                                                                              color={'#005A80'}/>
                                                                    <Link
                                                                        as={RouterLink}
                                                                        to={'/taxonomy/' + s.coralSpeciesId}>{s.scientificName}</Link></ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </AccordionPanel>
                                        </AccordionItem>)
                                })
                            }

                        </Accordion>
                    </SimpleGrid>
                </Box>
                }

                {searchValue !== '' &&
                <Box>
                </Box>
                }
            </Stack>
        </Container>
    );
}
