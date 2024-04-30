import { ChipComponentProps } from "../@types/props";

export function Chip ({description, id}: ChipComponentProps) {
    return (
        <div key={id} className="chip-container">
            <p className="chip-text" title={description}>{description}</p>
        </div>
    )
}