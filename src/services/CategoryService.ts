import { CategoryDtoType, SelectInputData } from '../@types/types';
import { ApiService } from '../utils/axios'

export class CategoryService extends ApiService {
    constructor() {
        super('/api/categorias')
    }

    async getCategories() {
        let categoriesDto: CategoryDtoType[] = [];
        let categories: SelectInputData[] = [];
        categories.push({ label: 'Selecione...', value: 0 });
        await this.get("").then(res => {
            categoriesDto = res.data;
        });
        categoriesDto.forEach(category => {
            categories.push({
                label: category.descricao,
                value: category.id
            })
        })
        return categories;
    }

    convertCategoriesDtoToSelectType(categoriesDto: CategoryDtoType[]) {
        let categories: SelectInputData[] = [];
        categoriesDto.forEach(category => {
            categories.push({
                label: category.descricao,
                value: category.id
            })
        })
        return categories;
    }

    register(description: string) {
        return this.post("", { descricao: description })
    }
}