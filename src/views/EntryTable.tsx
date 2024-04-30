import { EntryTableProps } from "../@types/props"
import { EntryService } from "../services/EntryService";
import { Chip } from "../components/Chip";

export function EntryTable({ entries, changeStatus, editAction, deleteAction }: EntryTableProps) {
    const service = new EntryService();

    const formatMonthes = (month: number) => {
        const monthes = service.getMonthes();
        let response;
        monthes.filter(item => {
            if (item.value == month) {
                response = item.label
            }
        })
        return response
    }

    const rows = entries.map(entry => {
        return (
            <tr key={entry.id} className="table-row">
                <td className="table-column-description description"><p className="table-column-description-text" title={entry.descricao}>{entry.descricao}</p></td>
                <td className="value">{service.formatCurrency(entry.valor)}</td>
                <td className="type">{entry.tipo}</td>
                <td className="month">{formatMonthes(entry.mes)}</td>
                <td className="status">{entry.status}</td>
                <td className="table-column-categories categories">
                    {entry.categoria.length > 0 ?
                        entry.categoria.map(category => {
                            return <Chip description={category.descricao} id={category.id} />
                        })
                        :
                        null
                    }
                </td>
                <td className="table-column-actions action">
                    <button
                        className="table-button blue"
                        title="Efetivar"
                        disabled={entry.status !== "PENDENTE"}
                        onClick={() => changeStatus(entry, "EFETIVADO")}
                    >
                        <i className="icon check-icon"></i>
                    </button>
                    <button
                        className="table-button yellow"
                        title="Cancelar"
                        disabled={entry.status !== "PENDENTE"}
                        onClick={() => changeStatus(entry, "CANCELADO")}
                    >
                        <i className="icon x-icon"></i>
                    </button>
                    <button
                        title="Editar"
                        className="table-button dark-gray"
                        onClick={() => editAction(entry)}>
                        <i className="icon pencil-icon"></i>
                    </button>
                    <button
                        title="Excluir"
                        className="table-button red"
                        onClick={() => deleteAction(entry)}
                    >
                        <i className="icon trash-icon"></i>
                    </button>
                </td>
            </tr >
        )
    })

    return (
        <div className="container-table">
            <table className="table">
                <thead>
                    <tr className="table-head">
                        <th scope="col" className="table-head-column description">Descrição</th>
                        <th scope="col" className="table-head-column value">Valor</th>
                        <th scope="col" className="table-head-column type">Tipo</th>
                        <th scope="col" className="table-head-column month">Mês</th>
                        <th scope="col" className="table-head-column status">Situação</th>
                        <th scope="col" className="table-head-column categories">Categorias</th>
                        <th scope="col" className="table-head-column action">Ações</th>
                    </tr>
                    <tr className="table-head">
                        <td colSpan={6} style={{ width: "100%" }}>
                            <hr />
                        </td>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {rows}
                </tbody>
            </table>
        </div>
    )
}