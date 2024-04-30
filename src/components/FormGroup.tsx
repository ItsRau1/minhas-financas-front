import { FormGroupProps } from "../@types/props";

export function FormGroup({ label, children, htmlFor }: FormGroupProps) {
    return (
        <div className="form-group">
            <label htmlFor={htmlFor}>{label}</label>
            {children}
        </div>
    )
}

