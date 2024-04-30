import toastr from "toastr";

toastr.options = {
    "toastClass": "alert",
    "iconClasses": {
        "error": 'alert-error',
        "info": 'alert-info',
        "success": 'alert-success',
        "warning": 'alert-warning'
    },
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "showDuration": 300,
    "hideDuration": 500,
    "timeOut": 3000,
    "extendedTimeOut": 500,
    "showEasing": "swing",
    "hideEasing": "swing",
    "showMethod": "slideDown",
    "hideMethod": "slideUp"
}

enum TypeToaster {
    success = "success",
    error = "error",
    warning = "warning"
}

export function showMessage(title: string, message: any, type: TypeToaster) {
    toastr[type](message, title)
}

export function ShowError(message: string) {
    showMessage('', message, TypeToaster.error)
}

export function ShowSuccess(message: string) {
    showMessage('', message, TypeToaster.success)
}

export function ShowAlert(message: string) {
    showMessage('', message, TypeToaster.warning)
}