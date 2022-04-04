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
import { Link as RouterLink } from "react-router-dom";

export default function Taxonomy() {
    const [searchValue, setSearchValue] = React.useState("");

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
                            <AccordionItem>
                                <AccordionButton>
                                    <AccordionIcon/>
                                    <h2><Link>Acanthastrea</Link></h2>
                                </AccordionButton>
                                <AccordionPanel>
                                    <List>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            bowerbanki</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            brevis</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            echinata</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            faviaformis</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            hemprichii</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            hillae</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            ishigakiensis</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            lordhowensis</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            regularis</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            rotundoflora</Link></ListItem>
                                        <ListItem><ListIcon as={GiLightningBranches} color={'#005A80'}/><Link as={RouterLink} to={'/taxonomy/1'}>Acanthastrea
                                            subechinata</Link></ListItem>
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>

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
