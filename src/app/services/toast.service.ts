import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IndividualToastConfig } from '@config/toast.config';

/**
 * Default service for handling user notifications 
 * based on notification type
 */
@Injectable({
    providedIn: 'root'
})
export class ToastService {
    config = IndividualToastConfig;

    constructor(
        private toast: ToastrService,
    ) { }

    success(message: string, title: string = '') {
        this.toast.success(message, title, this.config);
    }

    error(message: string, title: string = '') {
        this.toast.error(message, title, this.config);
    }

    info(message: string, title: string = '') {
        this.toast.info(message, title, this.config);
    }

    warn(message: string, title: string = '') {
        this.toast.warning(message, title, this.config);
    }
}
