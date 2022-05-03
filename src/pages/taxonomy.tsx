import * as React from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box, Button,
    Checkbox,
    CheckboxGroup,
    Container, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement,
    Link, List, ListIcon, ListItem,
    SimpleGrid,
    Stack
} from "@chakra-ui/react";
import {GiLightningBranches} from "react-icons/gi";
import {CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Link as RouterLink, useSearchParams} from "react-router-dom";
import CoralGenusServices from "../services/coralGenusServices";
import CoralSpeciesServices from "../services/coralSpeciesServices";
import {useEffect} from "react";

export default function Taxonomy() {
    const [searchValue, setSearchValue] = React.useState<any>();
    const [searchTrigger, setSearchTrigger] = React.useState<any>();
    const [genus, setGenus] = React.useState<any[]>([]);
    const [species, setSpecies] = React.useState<any[]>([]);
    let [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
        setSearchTrigger(searchParams.get("search") || "");
        loadData();
    }, []);

    const loadData = () => {
        CoralGenusServices.getAll().then(res => {
            setGenus(res.data)
        });
        CoralSpeciesServices.getAll().then(res => {
            setSpecies(res.data)
        });
    }

    const clearSearch = () => {
        setSearchValue('');
        setSearchTrigger('');
    }

    var delayTimer: any;
    const handleSearch = (value: any) => {
        setSearchValue(value);
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
            triggerSearch(value);
        }, 700); // Will do the ajax stuff after 1000 ms, or 1 s
    };

    const triggerSearch = (value: any) => {
        setSearchTrigger(value);
    }

    const speciesView = species.filter(s => searchTrigger ? s.scientificName.toLowerCase().includes(searchTrigger.toLowerCase()) : true);
    const genusView = genus.filter((g: any) => {
        const child = speciesView.filter((s:any) => s.parentId == g.coralGenusId);
        g.species = child;
        return g.scientificName.toLowerCase().includes(searchTrigger.toLowerCase()) || child.length > 0;
    })

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
                                <Input placeholder='by scientific name' id={'coralSpecie'} bg={'white'} value={searchValue}
                                       onChange={e => handleSearch(e.target.value)}/>
                                {
                                    searchValue &&
                                    <InputRightElement>
                                        <CloseIcon color='gray.500' onClick={clearSearch} cursor={'pointer'}/>
                                    </InputRightElement>
                                }
                            </InputGroup>
                        </Stack>
                    </FormControl>
                </Box>
                <Box>
                    <SimpleGrid columns={[1, 1, 3]} spacing={8}>
                        <Accordion allowMultiple allowToggle>
                            {
                                genusView.map((g: any, index) => {
                                    return ((index % 3 == 0) &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species.map((s: any) => {
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
                                genusView.map((g: any, index) => {
                                    return ((index % 3 == 1) &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species.map((s: any) => {
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
                                genusView.map((g: any, index) => {
                                    return ((index % 3 == 2) &&
                                        <AccordionItem>
                                            <AccordionButton>
                                                <AccordionIcon/>
                                                <h2>{g.scientificName}</h2>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <List>
                                                    {
                                                        g.species.map((s: any) => {
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
            </Stack>
        </Container>
    );
}
