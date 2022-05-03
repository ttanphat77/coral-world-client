import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/SpeciesMedia/'

const SpeciesMediaServices = {
    getAll: () => {
        return http.get(apiUrl + 'speciesMedias')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    getByAuthor: (id: any) => {
        return http.get(apiUrl + 'GetAllSpeciesMediasByUser?id=' + id)
    },

    getPaging: (page: number) => {
        return http.get(apiUrl + 'GetSpeciesMediasWithPaging?page=' + page)
    },

    getBySpecies: (id: any) => {
        return http.get(apiUrl + 'GetAllApprovedSpeciesMediasByCoral?coralId=' + id)
    },
    create: (data: any) => {
        return http.post(apiUrl, data)
    },
    update: (data: any) => {
        return http.put(apiUrl, data)
    },
    delete: (id: any) => {
        return http.delete(apiUrl + '?id=' + id)
    }
}

export default SpeciesMediaServices;
