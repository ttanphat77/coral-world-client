import GoogleMapReact from "google-map-react";
import * as React from "react";
import {
    Circle, Flex, Icon, Link, Popover, PopoverArrow,
    PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spacer, Stack
} from "@chakra-ui/react";
import {FaMapMarker} from "react-icons/fa";
import {useEffect} from "react";
import AreaServices from "../services/areaServices";
import CoralSpeciesServices from "../services/coralSpeciesServices";
import { Link as RouterLink} from "react-router-dom";

export default function CoralMap() {
    const MAP_OPTIONS = {
        // scrollwheel: true,
    };
    const [areas, setAreas] = React.useState<any[]>([]);

    useEffect(() => {
        AreaServices.getAll().then(response => {
            let i = 0;
            response.data.forEach((area: any) => {
                CoralSpeciesServices.getByArea(area.areaId).then(species => {
                    i++;
                    area.coralSpecies = species.data;
                    if (i == response.data.length) {
                        setAreas(response.data);
                    }
                });
            })
        });
    }, []);

    // @ts-ignore
    return (
        <>
            <GoogleMapReact
                options={MAP_OPTIONS}
                bootstrapURLKeys={{
                    key: 'AIzaSyDrYv6k4vyvM4mScKoysweL6874oSf1MUk   ',
                    language: "en",
                    region: "VN"
                }}
                defaultCenter={{lat: 16.32, lng: 111.72}}
                defaultZoom={5}
            >
                {
                    areas.map((area) => (
                        <MapMarker
                            key={area.areaName}
                            lat={area.mapPolygon.split(', ')[0]}
                            lng={area.mapPolygon.split(', ')[1]}
                            area={area}
                        />
                    ))
                }
            </GoogleMapReact>
        </>
    );
};

const MapMarker = (props: any) => {
    const [showPopover, setShowPopover] = React.useState(false);

    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <Icon as={FaMapMarker} h={'40px'} w={'40px'} color='#005A80' cursor={'pointer'}
                          transform={'translate(-20px, -40px)'}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow/>
                    <PopoverHeader>{props.area.areaName}</PopoverHeader>
                    <PopoverBody>{props.area.description}
                        <Flex>
                            <Spacer/>
                            <Popover>
                                <PopoverTrigger>
                                    <Link color={'blue'}>{props.area?.coralSpecies?.length} species founded.</Link>
                                </PopoverTrigger>
                                {
                                    props.area?.coralSpecies?.length > 0 &&
                                    <PopoverContent maxW={200} maxH={300} overflow={'auto'}>
                                        <PopoverArrow />
                                        <PopoverBody>
                                            <Stack>
                                                {props.area?.coralSpecies.map((species: any) =>
                                                    <Link as={RouterLink} to={'/taxonomy/' + species.coralSpeciesId}>{species.scientificName}</Link>)
                                                }</Stack>
                                        </PopoverBody>
                                    </PopoverContent>
                                }
                            </Popover>
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </div>
    );
};
