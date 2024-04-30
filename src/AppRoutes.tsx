import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { NavBar } from "./components/NavBar";
import { Home } from "./views/Home";
import { EntryConsult } from "./views/EntryConsult";
import { EntryRegister } from "./views/EntryRegister";
import { LandingPage } from "./views/LandingPage";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./contexts/auth";

export function AppRoutes() {
    const Private = ({ children }: any) => {
        const { isAuthenticated, isLoading }: any = useContext(AuthContext);
        if (isLoading) {
            return "";
        } else if (isAuthenticated) {
            return children
        }
        return <Navigate to="/entrar" />
    }

    return (
        <BrowserRouter basename="/ruan">
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<NavBar />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/entrar" element={<Login />} />
                        <Route path="/registrar" element={<Register />} />
                        <Route path="/home" element={<Private> <Home /> </Private>} />
                        <Route path="/consulta-lancamentos" element={<Private> <EntryConsult /> </Private>} />
                        <Route path="/registrar-lancamentos/:id?" element={<Private> <EntryRegister /> </Private>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}