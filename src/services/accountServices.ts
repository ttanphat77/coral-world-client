import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Account/'

const AccountServices = {
    getAll: () => {
        return http.get(apiUrl + 'accounts')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    changeRole: (data: any) => {
        return http.put(apiUrl + 'SwitchAccountRole', data)
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

export default AccountServices;
