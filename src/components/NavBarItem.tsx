import { NavLink } from "react-router-dom";
import { NavBarItemProps } from "../@types/props";

export function NavBarItem({ to, title, label, onClick }: NavBarItemProps) {
    return (
        <NavLink to={to} title={title} className="navbar-item" onClick={onClick}>
            {label}
        </NavLink>
    )
}