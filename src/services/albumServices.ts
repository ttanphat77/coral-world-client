import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Album/'

const AlbumServices = {
    getAll: () => {
        return http.get(apiUrl + 'albums')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    getByAuthor: (id: any) => {
        return http.get(apiUrl + 'GetAllAlbumsByAccountId?id=' + id)
    },
    create: (data: any) => {
        return http.post(apiUrl, data)
    },
    update: (data: any) => {
        return http.put(apiUrl, data)
    },
    remove: (id: any) => {
        return http.delete(apiUrl + '?id=' + id)
    }
}

export default AlbumServices;
