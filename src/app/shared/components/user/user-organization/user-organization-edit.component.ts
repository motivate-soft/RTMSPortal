import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationModel, UserModel } from 'src/app/shared/models/models-index';
import { UserOrganizationService } from 'src/app/shared/services/user/user-organization/user-organization.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { throwIfEmpty } from 'rxjs/operators';


@Component({
    selector: 'user-organization-edit',
    templateUrl: 'user-organization-edit.component.html'
})
export class UserOrganizationEditComponent {

    closeResult = '';

    @ViewChild('content', { static: false })
    private content: TemplateRef<any>;

    private user: UserModel;
    private userId: number;
    private organizations: OrganizationModel[];

    form: FormGroup;
    formSubmitted: boolean = false;

    @Output() userOrgEditFinished = new EventEmitter<number>();

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private userOrgSvc: UserOrganizationService,        
    ) {
        this.form = this.fb.group({
            'organizationId': ['', Validators.required]
        });
    }

    open(user: UserModel) {
        this.user = user;
        this.userOrgSvc.getAllByUserId(user.userId)
            .subscribe((response) => {
                this.organizations = response;
                this.form.get('organizationId').setValue(user.OrganizationId);
                this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'});
            })
    }

    save() {
        if (!this.form.valid) {
            this.formSubmitted = true;
            return;
        }

        if (this.user.OrganizationId === this.form.value.organizationId) {
            this.close();
            return;
        }

        this.userOrgSvc.saveUserOrganization(this.user.userId, this.form.value.organizationId)
            .subscribe(res => {
                if (this.modalService.hasOpenModals()) {
                    this.modalService.dismissAll();
                }
                this.userOrgEditFinished.emit(this.form.value.organizationId);
            });
    }

    close() {
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
    }
}
