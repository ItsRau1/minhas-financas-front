import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import { ContextType } from '../@types/types';

export function Dropdown() {
    const { endSession } = useContext(AuthContext) as ContextType;
    const navigate = useNavigate();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild className="dropdown-menu-open">
                <i className="icon hamburguer-icon clickable"></i>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => navigate("/home")}>
                        Home
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => navigate("/registrar")}>
                        Usuários
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => navigate("/consulta-lancamentos")}>
                        Lançamentos
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={endSession}>
                        Sair
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}