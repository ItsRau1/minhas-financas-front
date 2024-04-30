import { CredentialsType, UserDtoType, UserType } from "../@types/types";
import { ApiService } from "../utils/axios";

export class UserService extends ApiService {
    constructor() {
        super("/api/usuarios");
    }

    authenticate(credenciais: CredentialsType) {
        return this.post('/autenticar', credenciais);
    }

    getBalanceById(id: Number) {
        return this.get(`/${id}/saldo`);
    }

    register(user: UserType) {
        const userDto: UserDtoType = {
            nome: user.name!,
            email: user.email!,
            senha: user.password!
        }
        return this.post("", userDto);
    }

    valid(user: UserType) {
        const erros: string[] = []
        if (!user.name) {
            erros.push('O campo Nome é obrigatório.')
        }
        if (!user.email) {
            erros.push('O campo Email é obrigatório.')
        } else if (!user.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push('Informe um Email válido.')
        }
        if (!user.password && !user.passwordRepeat) {
            erros.push('Digite a senha 2x.')
        } else if (user.password !== user.passwordRepeat) {
            erros.push('As senhas não batem.')
        }
        if (erros && erros.length > 0) {
            throw erros;
        }
    }
}