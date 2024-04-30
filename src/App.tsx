import "toastr/build/toastr.css";
import "toastr/build/toastr.min.js";
import '@radix-ui/themes/styles.css';
import "./Custom.css"
import { AppRoutes } from "./AppRoutes";

export function App() {
    return (
        <div className="container">
            <AppRoutes />
        </div>
    )
}

