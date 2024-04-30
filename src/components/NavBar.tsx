import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { NavBarItem } from "./NavBarItem";
import { AuthContext } from "../contexts/auth";
import { ContextType } from "../@types/types";
import { Dropdown } from "./Dropdown";

export function NavBar() {
    const { isAuthenticated, endSession } = useContext(AuthContext) as ContextType;

    return (
        <div className="container">
            <div className="navbar">
                <Link to="/home" className="navbar-logo">Minhas Finanças</Link>
                <div className="navbar-links">
                    {isAuthenticated &&
                        <>
                            <NavBarItem to={"/home"} title="Home" label="Home" />
                            <NavBarItem to={"/registrar"} title="Usuários" label="Usuários" />
                            <NavBarItem to={"/consulta-lancamentos"} title="Lançamentos" label="Lançamentos" />
                            <NavBarItem to={"/entrar"} onClick={endSession} title="Sair" label="Sair" />
                            <Dropdown />
                        </>
                    }
                </div>
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}