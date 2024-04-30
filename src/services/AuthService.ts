import { LocalStorageService } from './LocalStorageService'
import { ApiService } from '../utils/axios'
import { CredentialsType, UserAuthenticatedType } from '../@types/types'
export const USUARIO_LOGADO = '_logged_user'
export const TOKEN = 'access_token'
import { decodeJwt } from "jose"
import { UserService } from './UserService'
import { useNavigate } from 'react-router-dom'

export class AuthService {
    service = new UserService();
    navigate = useNavigate();

    static isUserAuthenticated() {
        const token = LocalStorageService.getItem(TOKEN)
        if (!token) {
            return false;
        }
        const { exp } = decodeJwt(token);
        const isTokenInvalido = Date.now() >= (exp! * 1000)
        return !isTokenInvalido;
    }

    static removeUserAuthenticated() {
        LocalStorageService.removeItem(USUARIO_LOGADO)
        LocalStorageService.removeItem(TOKEN);
    }

    static saveCredentials(user: UserAuthenticatedType, token: string) {
        LocalStorageService.addItem(USUARIO_LOGADO, user)
        LocalStorageService.addItem(TOKEN, token);
        ApiService.registerToken(token);
    }

    static getUserAuthenticated() {
        return LocalStorageService.getItem(USUARIO_LOGADO);
    }

    static refreshSession() {
        const token = LocalStorageService.getItem(TOKEN)
        const usuario = AuthService.getUserAuthenticated()
        this.saveCredentials(usuario, token)
        return usuario;
    }

    login(user: CredentialsType) {
        this.service.authenticate(user).then(res => {
            AuthService.saveCredentials({ id: res.data.id, nome: res.data.nome }, res.data.token)
        }).then(() => {
            this.navigate("/home");
        })
    }
}

