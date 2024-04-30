import { useState } from "react";
import { Card } from "../components/Card";
import { FormGroup } from "../components/FormGroup";
import { NavLink, useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { ShowError, ShowSuccess } from "../components/Toastr";

export function Register() {
    const service = new UserService();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const register = () => {
        const user = { name, email, password, passwordRepeat }
        try {
            service.valid(user);
        } catch (error: any) {
            const messages: string[] = error;
            messages.forEach(msg => ShowError(msg));
            return false;
        }
        service.register(user)
            .then(() => {
                ShowSuccess('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.')
                navigate('/entrar')
            }).catch(error => {
                ShowError(error.response.data)
            })
    }

    return (
        <div className="register-user-container">
            <Card title={"Cadastro de Usuário"}>
                <div className="card-box-form-body">
                    <FormGroup label={"*Nome Completo: "} htmlFor={"inputName"}>
                        <input type="text" name="name" id="inputName" className="form-control" onChange={e => setName(e.target.value)} value={name} placeholder="Insira seu nome completo" />
                    </FormGroup>
                    <FormGroup label={"*E-mail: "} htmlFor={"inputEmail"}>
                        <input type="email" name="email" id="inputEmail" className="form-control" onChange={e => setEmail(e.target.value)} value={email} placeholder="Insira o e-mail de login" />
                    </FormGroup>
                    <FormGroup label={"*Senha: "} htmlFor={"inputPassword"}>
                        <input type="password" name="password" id="inputPassword" className="form-control" onChange={e => setPassword(e.target.value)} value={password} placeholder="Insira sua senha" />
                    </FormGroup>
                    <FormGroup label={"*Repetir senha: "} htmlFor={"inputPasswordRepet"}>
                        <input type="password" name="passwordRepet" id="inputPasswordRepet" className="form-control" onChange={e => setPasswordRepeat(e.target.value)} value={passwordRepeat} placeholder="Insira sua senha" />
                    </FormGroup>
                </div>
                <div className="card-box-form-footer">
                    <p className="card-register-message">*Preenchimento obrigatórios</p>
                    <div className="card-register-user-buttons">
                        <NavLink to={"/home"} className="home-button gray">
                            <i className="icon trash-icon"></i>
                            Cancelar
                        </NavLink>
                        <button onClick={register} className="home-button blue">
                            <i className="icon plus-icon"></i>
                            Registrar
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
