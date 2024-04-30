import { NavLink } from "react-router-dom";

export function LandingPage() {
    return (
        <div className="container-landing-page">
            <h1 className="home-title">Bem vindo ao sistema Minhas Finanças</h1>
            <p className="landing-page-paragraph">
                Esse é o seu sistema para controle de finanças pessoais, clique no botão para acessar o sistema:
            </p>
            <NavLink to={"/home"} className="home-button blue">
                <i className="icon box-arrow-in-right"></i>
                Acessar
            </NavLink>
        </div>
    )
}