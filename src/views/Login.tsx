import { useContext, useState } from "react";
import { Card } from "../components/Card"
import { FormGroup } from "../components/FormGroup";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { ShowError } from "../components/Toastr";
import { ContextType } from "../@types/types";
import { AuthContext } from "../contexts/auth";

export function Login() {
    const { initSession } = useContext(AuthContext) as ContextType;

    const userService = new UserService();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.SyntheticEvent) => {
        e.preventDefault();
        userService.authenticate({
            email,
            senha: password
        }).then(res => {
            initSession!(res.data);
            navigate("/home");
        }).catch(res => {
            ShowError(res.response.data)
        })
    }

    return (
        <div className="login-user-container">
            <form onSubmit={e => handleLogin(e)}>
                <Card title={"Login"}>
                    <div className="card-box-form-body">
                        <FormGroup label={"*E-mail:"} htmlFor={"inputEmail"}>
                            <input
                                id="exampleInputEmail1"
                                type="email"
                                placeholder="Insira o e-mail de login"
                                className="form-control"
                                tabIndex={1}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            ></input>
                        </FormGroup>
                        <FormGroup label={"*Senha:"} htmlFor={"inputPassword"}>
                            <input
                                id="exampleInputPassword1"
                                type="password"
                                placeholder="Insira sua senha"
                                className="form-control"
                                value={password}
                                tabIndex={2}
                                onChange={e => setPassword(e.target.value)}
                            ></input>
                        </FormGroup>
                    </div>
                    <div className="card-box-form-footer">
                        <p className="card-register-message">*Preenchimento obrigatórios</p>
                        <div className="card-register-user-buttons">
                            <NavLink to={"/registrar"} className="home-button gray">
                                Cadastrar
                            </NavLink>
                            <button type="submit" className="home-button blue" tabIndex={3}>
                                Entrar
                            </button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
}
