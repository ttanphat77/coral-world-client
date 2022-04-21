import GoogleMapReact from "google-map-react";
import * as React from "react";
import {Circle, Icon} from "@chakra-ui/react";
import { FaMapMarker } from "react-icons/fa";

export default function CoralMap(){
    const MAP_OPTIONS = {
        scrollwheel: true,
    };

    const areas = [
        {
            "English": "Gulf of Tonkin",
            "Name": "Vịnh Bắc Bộ",
            "Lat": 20.73,
            "Long": 107.22,
            "Species": "177"
        },
        {
            "English": "Central Vietnam",
            "Name": "Trung Bộ",
            "Lat": 15.95,
            "Long": 108.52,
            "Species": "204"
        },
        {
            "English": "Gulf of Siam",
            "Name": "Vịnh Thái Lan",
            "Lat": 9.95,
            "Long": 104.32,
            "Species": "240"
        },
        {
            "English": "Nhatrang Bay",
            "Name": "Vịnh Nha Trang",
            "Lat": 12.26,
            "Long": 109.31,
            "Species": "?"
        },
        {
            "English": "Island Thu",
            "Name": "Cù lao Thu/ Đảo Phú Quý",
            "Lat": 10.53,
            "Long": 108.94,
            "Species": "211"
        },
        {
            "English": "Kondao Islands",
            "Name": "Côn Đảo",
            "Lat": 8.7,
            "Long": 106.61,
            "Species": "211"
        },
        {
            "English": "Spratly archipelago",
            "Name": "Quần đảo Trường Sa",
            "Lat": 8.644,
            "Long": 111.92,
            "Species": "251"
        }
    ]

    // @ts-ignore
    return (
        <GoogleMapReact
            options={MAP_OPTIONS}
            bootstrapURLKeys={{
                key: 'AIzaSyDrYv6k4vyvM4mScKoysweL6874oSf1MUk   ',
                language: "en",
                region: "VN"
            }}
            defaultCenter={{ lat: 16.32, lng: 111.72 }}
            defaultZoom={5}
        >
            {
                areas.map((area) => (
                        <MapMarker
                            key={area.Name}
                            lat={area.Lat}
                            lng={area.Long}
                            text={area.English}
                            species={area.Species}
                        />
                    ))
            }
        </GoogleMapReact>
    );
};

const MapMarker = (props: any) => {
    return (
        <div>
            <Icon as={FaMapMarker} h={'40px'} w={'40px'} color='#005A80' cursor={'pointer'}
                  transform={'translate(-20px, -40px)'}
            />
        </div>
    );
};
