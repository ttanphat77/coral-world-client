import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Area/'

const AreaServices = {
    getAll: () => {
        return http.get(apiUrl + 'areas')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    create: (data: any) => {
        return http.post(apiUrl, data)
    },
    update: (data: any) => {
        return http.put(apiUrl, data)
    },
    remove: (id: any) => {
        return http.delete(apiUrl + '?id=' + id)
    },
    getBySpecies: (id: any) => {
        return http.get(apiUrl + 'GetAreasByCoralId?coralId=' + id)
    },
    addAreaToSpecies: (id: any, data: any) => {
        return http.post(process.env.REACT_APP_API_URL + '/CoralArea/AddCoralAreasForCoral?coralId=' + id, data)
    }
}

export default AreaServices;
