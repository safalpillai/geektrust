/**
 * ngx-toastr global toast config
 */
export const GlobalToastConfig = {
    maxOpened: 3,
    preventDuplicates: true,
};

/** 
 * ngx-toastr individual toast config
 */
export const IndividualToastConfig = {
    closeButton: false,
    disableTimeOut: false,
    timeOut: 3000,
    extendedTimeOut: 0,
    enableHtml: false,
    progressBar: true,
    toastClass: 'ngx-toastr',
    positionClass: 'toast-bottom-right',
    titleClass: 'toast-title',
    messageClass: 'toast-message',
    easing: 'ease-in',
    easeTime: 200,
    tapToDismiss: true,
    onActivateTick: false,
};