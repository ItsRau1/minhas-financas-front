import { CardProps } from "../@types/props";

export function Card({ title, children }: CardProps) {
    return (
        <div className="card-box">
            <div className="card-box-header">
                <p className="card-box-title">{title}</p>
            </div>
            {children}
        </div>
    )
}

