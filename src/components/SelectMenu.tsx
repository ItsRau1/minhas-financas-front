import { SelectMenuProps } from "../@types/props"

export function SelectMenu({ id, value, onChange, list, className, disabled }: SelectMenuProps) {
    const options = list.map((option, index) => {
        return (
            <option key={index} value={option.value} defaultChecked={option.value == 0 ? true : false} title={option.label}>{option.label}</option>
        )
    })

    return (
        <select id={id} value={value} onChange={onChange} className={className} disabled={disabled}>
            {options}
        </select>
    )
}