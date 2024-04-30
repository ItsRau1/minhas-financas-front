import { useContext, useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { ShowError } from "../components/Toastr";
import { AuthContext } from "../contexts/auth";
import { ContextType } from "../@types/types";
import { EntryService } from "../services/EntryService";
import { NavLink } from "react-router-dom";
import { Root, Thumb } from "@radix-ui/react-switch";
import hi from "../assets/hi.gif"

export function Home() {
    const { userAuthenticated, changeTheme } = useContext(AuthContext) as ContextType;

    const [balance, setBalance] = useState(0);
    const [balanceMonth, setBalanceMonth] = useState(0);
    const userService = new UserService();
    const entryService = new EntryService();

    const handleChangeTheme = () => {
        changeTheme!();
    }

    useEffect(() => {
        userService.getBalanceById(userAuthenticated!.id)
            .then(res => {
                setBalance(res.data.total);
                setBalanceMonth(res.data.mensal);
            }).catch(err => {
                ShowError(err.response.data)
            })
    }, []);

    return (
        <div className="home-box">
            <div className="home-box-header">
                <h1 className="home-title">Bem vindo {userAuthenticated!.nome}!</h1>
                <img className="home-gif" src={hi} />
            </div>
            <p className="home-paragraph">Esse é seu sistema de finanças.</p>
            <p className="home-paragraph">Seu saldo total atual é de {entryService.formatCurrency(balance)} </p>
            <p className="home-paragraph">Seu saldo do mês atual é de {entryService.formatCurrency(balanceMonth)} </p>
            <hr className="home-box-separator" />
            <div className="home-box-theme">
                <p className="home-paragraph">Altere o tema de seu sistema quando quiser:</p>
                <Root className="SwitchRoot" onCheckedChange={handleChangeTheme}>
                    <Thumb className="SwitchThumb" />
                </Root>
            </div>
            <hr className="home-box-separator" />
            <p className="home-paragraph"> E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema. </p>
            <div className="home-box-footer">
                <NavLink to={"/registrar"} className="home-button gray">
                    <i className="icon register-user-icon"></i>
                    Cadastrar Usuário
                </NavLink>
                <NavLink to={"/registrar-lancamentos"} className="home-button blue">
                    <i className="icon register-entry-icon"></i>
                    Cadastrar Lançamento
                </NavLink>
            </div>
        </div>
    )
}