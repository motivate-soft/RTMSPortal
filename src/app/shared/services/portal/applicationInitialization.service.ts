import { Injectable, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { ApplicationInfoService } from './applicationInfo.service';
import { UserInterfaceStateService } from 'src/app/userInterface/store/services/userInterface-state.service';
import { UserStateService } from 'src/app/user/store/services/user-state.service';
import { Keepalive } from '@ng-idle/keepalive';
import { Transition, TransitionService, StateService } from '@uirouter/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../../environment/env.service';
import { TokenService } from '../../auth/services/token.service';
import { FiltersService } from 'src/app/filter/store/services/filters.service';
import { RtmsCardComponent } from '../../cards/rtms-card/rtms-card.component';
import { RtmsConstantService } from '../rtms-constant.service';
import { LoginService } from 'src/app/pages/login/login.service';
import { PrincipalService } from './principal.service';
import { AuthorizationService } from './authorization.service';
import * as $ from 'jquery';
import { DirectUrlStateService } from './directUrlState.service';

@Injectable()
export class ApplicationInitializationService {

  constructor(
    private applicationInfoService: ApplicationInfoService,
    private userInterfaceStateService: UserInterfaceStateService,
    private userStateService: UserStateService,
    private idle: Idle,
    private keepalive: Keepalive,
    private modalService: NgbModal,
    private transitionService: TransitionService,
    private envService: EnvService,
    private tokenService: TokenService,
    private filtersService: FiltersService,
    private rtmsConstantService: RtmsConstantService,
    private loginService: LoginService,
    private principalFactory: PrincipalService,
    private authorizationFactory: AuthorizationService,
    private stateService: StateService,
    private directUrlStateService: DirectUrlStateService) {

  }


  public Initialize() {
    this.idle.setIdle(1800); // set default
    this.idle.setTimeout(30);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.keepalive.interval(10);
    setInterval(() => {
      this.checkVersion();
    }, 120000);
    const _isNotMobile = this.isNotMobile();
    if (_isNotMobile) {
      this.userInterfaceStateService.setIsSideBarExpanded(true);
    } else {
      this.userInterfaceStateService.setIsSideBarExpanded(false);
    }

    this.applicationInfoService.getApplicationSettings().subscribe((applicationInfo: any) => {
      this.userInterfaceStateService.setVersion(applicationInfo.VersionNumber);
      this.userStateService.setMarketingUrl(applicationInfo.MarketingFormUrl);
      if (applicationInfo.IdleTimeout > 0) {
        this.idle.setIdle(applicationInfo.IdleTimeout); // override from api
      }
    });

    this.registerTransitionHooks();
  }

  private registerTransitionHooks(): void {
    this.transitionService.onStart({}, (trans: Transition) => {
      this.modalService.dismissAll();

      let returnVal = null;
      const toState = trans.to();
      const toStateParams = trans.params();
      const fromState = trans.from();
      const token = this.tokenService.getAsyncToken();

      if (toState.data && toState.data.allowedOrganizationTypes) {
        this.filtersService.allowedOrganizationTypes.set(toState.data.allowedOrganizationTypes);
      } else {
        this.filtersService.allowedOrganizationTypes.set([this.rtmsConstantService.organizationTypes.Facility]);
      }
      if (this.principalFactory.isAuthenticated()) {
        const requiresFeatures = (toState.data && toState.data.requiresFeatures)
          ? toState.data.requiresFeatures : undefined;
        if (requiresFeatures) {
          this.filtersService.organizations.setFacilityByFeature(requiresFeatures);
        }
      }
      this.userInterfaceStateService.setFromStateParams(this.userInterfaceStateService.getToStateParams());
      this.userInterfaceStateService.setToState(toState);
      this.userInterfaceStateService.setToStateParams(toStateParams);
      this.userInterfaceStateService.setFromState(fromState);

      this.configureGlobalSpinner(fromState, toState);

      if (this.principalFactory.isIdentityResolved()) {
        returnVal = this.authorizationFactory.authorize().toPromise();
        this.userInterfaceStateService.toggleLoginStates(true);
        this.userInterfaceStateService.setHideSideBarMenu(false);
      } else if (toState.name === '' || toState.name === 'home.passwordreset' || toState.name === 'home.help' ||
                toState.name === 'home.requestPasswordReset') {
        this.userInterfaceStateService.toggleLoginStates(true);
        this.userInterfaceStateService.setHideSideBarMenu(true);
        return;
      } else if (toState.name === 'home.logoutSSO') {
        this.userInterfaceStateService.toggleLoginStates(false);
      } else if (toState.data && toState.data.allowAnonymous) {
        this.userInterfaceStateService.toggleLoginStates(false);
        this.userInterfaceStateService.setHideSideBarMenu(false);
      } else if (toState.name !== 'home.login') {
        if (token) {
          if (!toState.resolve) {
            toState.resolve = {};
          }

        returnVal = this.loginService.loginUsingToken()
          .toPromise().then(_ => {
            this.userInterfaceStateService.toggleLoginStates(true);
            return this.authorizationFactory.authorize().toPromise();
          });

        } else {
          if (toState.name !== 'home.login') {
            this.directUrlStateService.set(toState, toStateParams);
          }
          this.userInterfaceStateService.toggleLoginStates(false);
          this.stateService.transitionTo('home.login');
          trans.abort();
          return;
        }
      } else if (toState.name === 'home.login') {
        if (trans.params().slug) {
          trans.abort();
          this.loginService.redirectSSO(trans.params().slug);
        }
      }
      return returnVal;
    });

    this.transitionService.onSuccess({}, (trans: Transition) => {
      const toState = trans.to();
    });
  }

  private isNotMobile(): boolean {
    return (function () {
      let check = false;
      // tslint:disable-next-line
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window['opera']);
      return !check;
    })();
  }

  private configureGlobalSpinner(fromState, toState): void {
    if (fromState.data && fromState.data.noGlobalSpinner === true) {
      $('body').removeClass('no-global-spinner');
    }

    if (toState.data && toState.data.noGlobalSpinner === true) {
      $('body').addClass('no-global-spinner');
    }
  }

  private checkVersion(): void {
    this.applicationInfoService.getApplicationSettings().subscribe(applicationInfo => {
      if (!applicationInfo || (this.userInterfaceStateService.getVersion() !== applicationInfo.VersionNumber)) {
        this.loginService.reload();
      }
    });
  }
}
