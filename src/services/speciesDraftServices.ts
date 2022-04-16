import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/SpeciesDraft/'

const SpeciesDraftServices = {
    getAll: () => {
        return http.get(apiUrl + 'speciesDrafts')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    getByAuthor: (id: any) => {
        return http.get(apiUrl + 'GetAllSpeciesDraftsByAccountId?id=' + id)
    },
    approve: (id: any, status: any) => {
        return http.put(apiUrl + 'ApproveRejectDraft?id=' + id + '&status=' + status)
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

export default SpeciesDraftServices;
