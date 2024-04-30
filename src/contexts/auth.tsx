import { createContext, useCallback, useEffect, useState } from "react";
import { AuthContextProps } from "../@types/props";
import { ContextType, FilterMapType, TokenDtoType, UserAuthenticatedType } from "../@types/types";
import { AuthService } from "../services/AuthService";
import { decodeJwt } from "jose";
import { LocalStorageService } from "../services/LocalStorageService";

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
    const [userAuthenticated, setUserAuthenticated] = useState<UserAuthenticatedType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [theme, setTheme] = useState<string>("classic");
    const [filtersMap, setFiltersMap] = useState<FilterMapType>({});

    const initSession = (tokenDTO: TokenDtoType) => {
        const token = tokenDTO.token
        const { userId, name } = decodeJwt(token) as {
            userId: number,
            name: string
        };
        const user = {
            id: userId,
            nome: name
        }
        AuthService.saveCredentials(user, token);
        setUserAuthenticated(user);
        setIsAuthenticated(true);
        setIsLoading(false)
    }

    const endSession = () => {
        AuthService.removeUserAuthenticated();
        setUserAuthenticated(null);
        setIsAuthenticated(false);
    }

    const changeTheme = useCallback(() => {
        if (theme === "classic") {
            LocalStorageService.addItem("theme", "light");
            document.getElementsByTagName("html")[0].setAttribute("data-color-theme", "light");
            setTheme("light")
        } else if (theme === "light") {
            LocalStorageService.addItem("theme", "classic");
            document.getElementsByTagName("html")[0].setAttribute("data-color-theme", "classic");
            setTheme("classic")
        }
    }, [theme])

    const getTheme = () => {
        const themeSelected = LocalStorageService.getItem("theme");
        if (themeSelected !== undefined) {
            setTheme(themeSelected)
            document.getElementsByTagName("html")[0].setAttribute("data-color-theme", themeSelected);
        } else {
            LocalStorageService.addItem("theme", "classic")
            setTheme("classic")
        }
    }

    async function setUp() {
        getTheme();
        const isAuthenticated = AuthService.isUserAuthenticated();
        if (isAuthenticated) {
            const user = await AuthService.refreshSession()
            setUserAuthenticated(user);
            setIsAuthenticated(true);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        };
    }

    useEffect(() => {
        setUp();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated: isAuthenticated, userAuthenticated, endSession, initSession, isLoading, changeTheme, setFiltersMap, filtersMap }}>
            {children}
        </AuthContext.Provider>
    )
}