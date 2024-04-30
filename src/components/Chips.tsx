import { ChipsProps } from "../@types/props"

export function Chips({ list, label, onCloseChip }: ChipsProps) {
    const chips = list.map(item => {
        return (
            <div key={item.value} className="chips-container">
                <p className="chip-text" title={item.label}>{item.label}</p>
                <button className="chips-close" onClick={() => onCloseChip(item)}>
                    <i className="icon x-icon clickable" />
                </button>
            </div>
        )
    })

    return (
        <>
            {list.length < 1 ?
                <p className="paragraph-no-chips">
                    {label}
                </p>
                :
                <>
                    {chips}
                </>
            }
        </>
    )
}