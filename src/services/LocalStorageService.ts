export class LocalStorageService {
    static addItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key: string) {
        let item = localStorage.getItem(key);
        let response;
        if (item) {
            response = JSON.parse(item);
        }
        return response;
    }

    static removeItem(key: string) {
        localStorage.removeItem(key)
    }
}