import { CategoryDtoType } from "../@types/types"

export function useFormatCategoriesToList(categories: CategoryDtoType[]) {
    let categoriesInString = "<ul>"

    for (let i = 0; i < categories.length; i++) {
        categoriesInString = categoriesInString + "<li>" + categories[i].descricao + "</li>"
    }

    return categoriesInString + "</ul>"
}