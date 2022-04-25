import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Article/'

const ArticleServices = {
    getAll: () => {
        return http.get(apiUrl + 'articles')
    },
    getPublished: () => {
        return http.get(apiUrl + 'published')
    },
    get: (id: any) => {
        return http.get(apiUrl + id)
    },
    getByAuthor: (id: any) => {
        return http.get(apiUrl + 'GetArticlesByAuthor?author=' + id)
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

export default ArticleServices;