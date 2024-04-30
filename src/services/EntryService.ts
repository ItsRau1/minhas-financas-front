import { ApiService } from '../utils/axios'
import { ValidationError } from '../errors/ValidationError'
import { EntryType, FindEntryType } from '../@types/types'
import { useRegisterEntryInFeatureLayer } from '../hooks/useRegisterEntryInFeatureLayer'
import { useDeleteEntryInFeatureLayer } from '../hooks/useDeleteEntryInFeatureLayer'
import { useUpdateEntryInFeatureLayer } from '../hooks/useUpdateEntryInFeatureLayer'
import { useChangeStatusEntryInFeatureLayer } from '../hooks/useChangeStatusEntryInFeatureLayer'
import { useMassiveRegisterEntriesInFeatureLayer } from '../hooks/useMassiveRegisterEntriesInFeatureLayer'

export class EntryService extends ApiService {
    constructor() {
        super('/api/lancamentos')
    }

    getMonthes() {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 },
        ]
    }

    getTypes() {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Despesa', value: 'DESPESA' },
            { label: 'Receita', value: 'RECEITA' }
        ]
    }

    getExtensions() {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'JSON', value: 'json' },
            { label: 'CSV', value: 'csv' }
        ]
    }

    getById(id: number) {
        return this.get(`/${id}`);
    }

    changeStatus(id: number, status: string) {
        const response = this.put(`/${id}/atualiza-status`, { status }).then(res => {
            useChangeStatusEntryInFeatureLayer(res)
        })
        return response;
    }

    valid(entry: EntryType) {
        const erros = [];
        if (!entry.year) {
            erros.push("Informe o Ano.")
        }
        if (!entry.month) {
            erros.push("Informe o Mês.")
        }
        if (!entry.description) {
            erros.push("Informe a Descrição.")
        }
        if (!entry.value) {
            erros.push("Informe o Valor.")
        }
        if (!entry.type) {
            erros.push("Informe o Tipo.")
        }
        return ValidationError(erros);
    }

    register(entry: EntryType) {
        const categories = entry.category.map(item => {
            return item.value
        })
        const entryDto = {
            descricao: entry.description,
            mes: entry.month,
            ano: entry.year,
            valor: entry.value,
            tipo: entry.type,
            categoria: categories,
            usuario: entry.user,
            latitude: entry.latitude,
            longitude: entry.longitude
        }
        const response = this.post('/', entryDto).then(res => {
            useRegisterEntryInFeatureLayer(res);
        })
        return response;
    }

    update(entry: EntryType) {
        const categories = entry.category.map(item => {
            return item.value
        })
        const entryDto = {
            id: entry.id,
            descricao: entry.description,
            mes: entry.month,
            ano: entry.year,
            valor: entry.value,
            tipo: entry.type,
            usuario: entry.user,
            categoria: categories,
            latitude: entry.latitude,
            longitude: entry.longitude
        }
        const response = this.put(`/${entry.id}`, entryDto).then(res => {
            useUpdateEntryInFeatureLayer(res);
        })
        return response;
    }

    find(entry: FindEntryType) {
        let params = `?year=${entry.year}`
        if (entry.month) {
            params = `${params}&month=${entry.month}`
        }
        if (entry.type) {
            const convertType = (type: string) => {
                if (type == "DESPESA") {
                    return "EXPENSE"
                }
                return "RECIPE"
            }
            let type = convertType(entry.type)
            params = `${params}&type=${type}`
        }
        if (entry.user) {
            params = `${params}&user=${entry.user}`
        }
        if (entry.description) {
            params = `${params}&description=${entry.description}`
        }
        if (entry.category) {
            params = `${params}&category=${entry.category}`
        }
        return this.get(params);
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        let response = this.post("/upload", formData).then(res => {
            useMassiveRegisterEntriesInFeatureLayer(res)
            return res
        })
        return response
    }

    toDelete(id: number) {
        const response = this.delete(`/${id}`).then(() => {
            useDeleteEntryInFeatureLayer(id)
        })
        return response
    }

    formatCurrency(value: number) {
        return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    download(entry: FindEntryType) {
        let params = "/download?d=0";
        if (entry.year) {
            params = `${params}&year=${entry.year}`
        }
        if (entry.month) {
            params = `${params}&month=${entry.month}`
        }
        if (entry.type) {
            params = `${params}&type=${entry.type}`
        }
        if (entry.description) {
            params = `${params}&description=${entry.description}`
        }
        if (entry.category) {
            params = `${params}&category=${entry.category}`
        }
        if (entry.format) {
            params = `${params}&format=${entry.format}`
        }
        return this.get(params);
    }

    downloadArchive(content: any, extension: string) {
        let contentType = "aplication/json";
        if (extension === "csv") {
            contentType = "text/csv"
        }
        const fileName = `lancamentos-${new Date().toISOString()}`
        const link = document.createElement("a");
        let file;
        if (extension === "json") {
            file = new Blob([JSON.stringify(content)], { type: contentType });
        } else {
            file = new Blob([content], { type: contentType });
        }
        link.href = window.URL.createObjectURL(file);
        link.download = fileName + "." + extension;
        link.click();
    }
}