import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Image/';

const CroppedImageServices = {
    getAll: () => {
        return http.get(apiUrl + 'images');
    },

    get: (id: any) => {
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

export default CroppedImageServices;
