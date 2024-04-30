import axios from "axios";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

export class ApiService {
    apiurl: string;

    constructor(apiurl: string) {
        this.apiurl = apiurl;
    }

    static registerToken(token: string) {
        if (token) {
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }

    post(url: string, object: Object): Promise<any> {
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.post(requestUrl, object);
    }

    put(url: string, object: Object): Promise<any> {
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.put(requestUrl, object);
    }

    delete(url: string): Promise<any> {
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.delete(requestUrl)
    }

    get(url: string): Promise<any> {
        const requestUrl = `${this.apiurl}${url}`
        return httpClient.get(requestUrl)
    }
}
