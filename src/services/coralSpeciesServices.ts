import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/CoralSpecies/';

const CoralSpeciesServices = {
    getAll: () => {
        return http.get(apiUrl + 'corals');
    },

    get: (id: any) => {
        return http.get(apiUrl + id);
    },

    getEmpty: () => {
        return http.get(apiUrl + 'GetAllEmptyCorals');
    },

    getByGenus: (genusId: any) => {
        return http.get(apiUrl + 'GetAllCoralsByGenus?id=' + genusId);
    },

    getByArea: (areaId: any) => {
        return http.get(apiUrl + 'GetAllCoralsByArea?areaId=' + areaId);
    },

    create: (data: any) => {
        return http.post(apiUrl, data);
    },

    update: (data: any) => {
        return http.put(apiUrl, data);
    },

    delete: (id: any) => {
        return http.delete(apiUrl + '?id=' + id);
    }

}

export default CoralSpeciesServices;
