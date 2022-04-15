import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/CoralGenus/'

const CoralGenusServices = {
    getAll: () => {
        return http.get(apiUrl + 'coralGenuses');
    },

    get: (id: number) => {
        return http.get(apiUrl + id);
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

export default CoralGenusServices;
