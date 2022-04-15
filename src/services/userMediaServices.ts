import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/UserMedia/'

const UserMediaServices = {
    getAll: () => {
        return http.get(apiUrl + 'userMedias')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    getByAlbum: (id: any) => {
        return http.get(apiUrl + 'GetAllUserMediasByAlbumId?id=' + id)
    },
    create: (data: any) => {
        return http.post(apiUrl, data)
    },
    update: (data: any) => {
        return http.put(apiUrl, data)
    },
    delete: (id: any) => {
        return http.delete(apiUrl + '?id=' + id)
    },
    triggerDetect: (id: any) => {
        return http.post('http://localhost:5000/v1/object-detection/yolov5s', { usermediaID: id })
    }
}

export default UserMediaServices;
