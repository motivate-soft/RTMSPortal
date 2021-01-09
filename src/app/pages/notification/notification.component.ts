import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NotificationService } from '../notification/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'rtms-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @ViewChild('notificationPopup', {static: false}) public template: TemplateRef<any>;
  protected _notifications: any[];
  protected _subjectDisplay: string;
  public _hasNotifications: boolean;

  constructor(
    private _notificationService: NotificationService,
    private _modalService: NgbModal
  ) {
  }
  ngOnInit() {
    this._hasNotifications = false;
    this.getNotificationData();
  }

  getNotificationData(): void {
    this._notificationService.getNotificationsByType(1).subscribe((response: any[]) => {
     this._notifications = response;
      if (this._notifications  && this._notifications !== null && this._notifications.length > 0) {
      this._hasNotifications = true;
      if (this._notifications.length > 1 ) {
          this._subjectDisplay = this.getNotificationTypes(this._notifications);
      } else {this._subjectDisplay = this._notifications[0].SubjectDisplay; }
    }
    });
  }

  getNotificationTypes(notifications): string {
    let foundWarnings = false;
    let foundInfo = false;
    notifications.forEach(element => {
      if (element.NotificationTypeId === 1) {
        foundWarnings = true;
      } else {
        foundInfo = true;
      }
    });
    return this.getDisplayMessage(foundWarnings, foundInfo);
  }

  getDisplayMessage(foundWarnings, foundInfo): string {
    if (foundWarnings && !foundInfo) {
      return 'Click to view multiple Warning messages';
    } else if (!foundWarnings && foundInfo) {
      return 'Click to view multiple Informational messages';
    } else {
      return 'Click to view multiple Informational/Warming messages';
    }
  }


  displayNotification(): void {
    this._modalService.open(this.template);
  }

  closeModal(): void {
      if (this._modalService.hasOpenModals()) {
        this._modalService.dismissAll();
      }
  }
}
