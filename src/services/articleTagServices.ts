import http from '../http-common'

const apiUrl = process.env.REACT_APP_API_URL + '/Tag/'

const ArticleTagsServices = {
    getAll: () => {
        return http.get(apiUrl + 'tags');
    },

    get: (id: number) => {
        return http.get(apiUrl + id);
    },

    getByArticle: (id: any) => {
        return http.get(apiUrl + 'GetTagsByArticleId?articleId=' + id);
    },

    addTags: (id: any, data: any) => {
        return http.post(process.env.REACT_APP_API_URL + '/ArticleTag/AddArticleTags?articleId=' + id, data);
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

export default ArticleTagsServices;
