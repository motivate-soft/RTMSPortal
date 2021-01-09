import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, Injector } from '@angular/core';
import { ModalInputs } from '../models/modal-inputs';

@Injectable()
export class ModalPopupService{
    constructor(private modalService : NgbModal){}

    showModal(modalContent: any, compInstanceValues: ModalInputs[]) {
        const modalRef = this.modalService.open(modalContent);
        compInstanceValues.forEach(inst => {
            modalRef.componentInstance[inst.instanceName] = inst.instanceValue;
        })
    }
}