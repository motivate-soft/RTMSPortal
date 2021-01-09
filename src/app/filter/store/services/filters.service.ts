import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { List } from 'linqts';
import { Observable, forkJoin, Subject, ConnectableObservable } from 'rxjs';
import { take, map, publish, filter } from 'rxjs/operators';
import { FilterState } from '../../store/states/filter-state';
import { getFilterValue, getResMRNSelector } from '../../store/selectors/getFilterValue';
import { SetFilterAction, ClearFilterAction } from '../../store/actions';
import { FilterValues } from '../../filter-values';
import { OrganizationModel } from '../../../shared/models/organization.model';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { list } from '../../../shared/utility/list';
import { FeatureService } from 'src/app/shared/services/feature.service';
import { CardFilter } from 'src/app/shared/models/card-filter';
import { ReportDataFilter } from 'src/app/shared/models/report-data-filter.model';

@Injectable()
export class FiltersService {
    constructor(private store: Store<FilterState>, private userStateService: UserStateService,
        private featureService: FeatureService) { }

    organizations = new OrganizationsValueService(this.store, this, this.userStateService, this.featureService);
    allowedOrganizationTypes = new FilterValueService<number[]>(FilterValues.AllowedOrganizationTypes, this.store);
    selectedHsOrganization = new FilterValueService<OrganizationModel>(FilterValues.SelectedHsOrganization, this.store);
    selectedEnterpriseOrganization = new EnterpriseOrganizationValueService(this.store, this, this.featureService);
    isFilterApplied = new FilterValueService<boolean>(FilterValues.IsFilterApplied, this.store);
    isDefault = new FilterValueService<boolean>(FilterValues.IsDefault, this.store);
    filterSettings = new FilterValueService<any>(FilterValues.FilterSettings, this.store);
    isQMAverageDrillDown = new FilterValueService<boolean>(FilterValues.IsQMAverageDrillDown, this.store);
    isQMNumerator = new FilterValueService<boolean>(FilterValues.IsQMNumerator, this.store);
    isQMDenominator = new FilterValueService<boolean>(FilterValues.IsQMDenominator, this.store);
    cardFilters = new FilterValueService<CardFilter[]>(FilterValues.CardFilters, this.store);
    isEnterpriseDashboard = new FilterValueService<boolean>(FilterValues.IsEnterpriseDashboard, this.store);
    isHSDashboard = new FilterValueService<boolean>(FilterValues.IsHSDashboard, this.store);
    currentDashboardDataFilters = new FilterValueService<ReportDataFilter[]>(FilterValues.CurrentDashboardDataFilters, this.store);
    getUnitIdCSV(): string {
        let unitIdCSV = null;
        if (this.filterSettings.get() && this.filterSettings.get().Units) {
            unitIdCSV = this.filterSettings.get().Units;
        }
        return unitIdCSV;
    }

    getQmTypeIdCSV(): string {
        let qmTypeIdCSV = null;
        if (this.filterSettings.get() && this.filterSettings.get().QMTypeIDs) {
            qmTypeIdCSV = this.filterSettings.get().QMTypeIDs;
        }
        return qmTypeIdCSV;
    }

    getPayersIdCSV(): string {
        let payerIdCSV = null;
        if (this.filterSettings.get() && this.filterSettings.get().Payers) {
            payerIdCSV = this.filterSettings.get().Payers;
        }
        return payerIdCSV;
    }

    getCategoryTagIdCSV(): string {
        let categoryTagIdCSV = null;
        if (this.filterSettings.get() && this.filterSettings.get().Categories) {
            categoryTagIdCSV = this.filterSettings.get().Categories;
        }
        return categoryTagIdCSV;
    }

    getTypeIdCSV(): string {
        let typeIdCSV = null;
        if (this.filterSettings.get() && this.filterSettings.get().Type) {
            typeIdCSV = this.filterSettings.get().Type;
        }
        return typeIdCSV;
    }

    resetFilter(): void {
      this.filterSettings.clear();
      this.isFilterApplied.set(false);
      this.isQMNumerator.set(false);
      this.isQMDenominator.set(false);
      this.isQMAverageDrillDown.set(false);
    }

    getResMRN(): Observable<string> {
        return this.store.select(getResMRNSelector) as Observable<string>;

    }
  }
export class FilterValueService<TValue> {
    private clearSubject = new Subject<void>();

    constructor(private filter: FilterValues, private store: Store<FilterState>) { }

    public set(value: TValue): void {
        const mutatedValue = value !== null ? (typeof value === 'object' && !(value instanceof Date))
            ? Array.isArray(value) ? [...value] : { ...value } : value : value;

        this.store.dispatch(new SetFilterAction(mutatedValue, this.filter));
    }

    public getStream(): Observable<TValue> {
        return this.store.select(getFilterValue, this.filter) as Observable<any> as Observable<TValue>;
    }

    public get(): TValue {
        let value: TValue;

        this.getStream()
            .pipe(take(1))
            .subscribe(v => value = v);

        return value;
    }

    public clear(): void {
        this.store.dispatch(new ClearFilterAction(this.filter));
        this.clearSubject.next();
    }
    public onClear(): Observable<void> {
        return this.clearSubject.asObservable();
    }
}


export class OrganizationsValueService extends FilterValueService<OrganizationModel[]> {

    private organizationFeaturesFilterService: FilterValueService<OrganizationModel[]>;

    constructor(store: Store<FilterState>,
        private filtersService: FiltersService,
        private userStateService: UserStateService,
        private featureService: FeatureService) {
        super(FilterValues.Organizations, store);

        this.organizationFeaturesFilterService = new FilterValueService(FilterValues.OrganizationFeatures, store);
    }
    clear(): void {
        this.organizationFeaturesFilterService.clear();
        super.clear();
    }
    set(value: OrganizationModel[]): Observable<any> {
        const previousOrg = super.get();
        if (previousOrg && previousOrg.length > 0
            && value[0].OrganizationId !== previousOrg[0].OrganizationId) {
            this.removeFilterUnitAndPayers();
        }
        const orgObservable = new Observable(observer => {
            const observables = [];
        super.set(value);
        value.forEach((fac, index) => {
            observables.push(this.featureService.getOrgFeatures(fac.OrganizationId).pipe(
                map((response: any) => {
                    fac.Features = response.Features;
                    fac.LandingPageRoute = response.LandingPageRoute;
                })
            ));
        });

        forkJoin(observables)
            .subscribe(() => {
                this.organizationFeaturesFilterService.set(value);
                    observer.next();
                    observer.complete();
            });
        }).pipe(publish()) as ConnectableObservable<any>;
        orgObservable.connect();
        return orgObservable;
    }

    private removeFilterUnitAndPayers() {
        const filterSettings = this.filtersService.filterSettings.get();
        if (filterSettings && filterSettings !== '') {
            filterSettings.Units = null;
            filterSettings.Payers = null;
            this.filtersService.filterSettings.set(filterSettings);
        }
    }

    get(): OrganizationModel[] {
        const selectedOrganizations = this.filterOrganizations(super.get());

        return this.defaultIfEmpty(selectedOrganizations);
    }

    getOrganizationFeature(): OrganizationModel[] {
        const selectedOrganizations = this.filterOrganizations(this.organizationFeaturesFilterService.get());

        return this.defaultIfEmpty(selectedOrganizations);
    }

    getFirstOrDefault(): OrganizationModel {
        return list(this.get()).FirstOrDefault();
    }

    getFirstOrDefaultOrganizationFeature(): OrganizationModel {
        return list(this.getOrganizationFeature()).FirstOrDefault();
    }

    getStream(): Observable<OrganizationModel[]> {
        return super.getStream()
            .pipe(filter(data => data && data.length > 0),
                  map(organizations => this.filterOrganizations(organizations)));
    }

    getOrganizationFeatureStream(): Observable<OrganizationModel[]> {
        return this.organizationFeaturesFilterService.getStream()
            .pipe(filter(data => data && data.length > 0),
                map(organizations => this.filterOrganizations(organizations)));
    }

    setFacilityByFeature(requiredFeatures: string[]) {
        const allowedOrganizationTypes = list(this.filtersService.allowedOrganizationTypes.get());
        const allowedOrganizations = list(super.get())
            .Where(o => allowedOrganizationTypes.Any(t => t === o.OrganizationType));

        let featureEligibleOrganization = allowedOrganizations
            .Where(a => list(requiredFeatures).All(f => list(a.Features).Any(x => x.FeatureName === f))).FirstOrDefault();
        if (!featureEligibleOrganization) {
            featureEligibleOrganization = this.userStateService.getDefaultFacility(this.filtersService.allowedOrganizationTypes.get());
        }
        if (featureEligibleOrganization) {
            if (allowedOrganizations.Count() === 0 ||
            allowedOrganizations.ToArray()[0].OrganizationId !== featureEligibleOrganization.OrganizationId) {
            this.set([featureEligibleOrganization]);
            }
        }
    }

    private filterOrganizations(organizations: OrganizationModel[]): OrganizationModel[] {
        const allowedOrganizationTypes = list(this.filtersService.allowedOrganizationTypes.get());
        if (organizations && organizations.length > 0) {
            return list(organizations)
                .Where(o => !allowedOrganizationTypes.Any() || allowedOrganizationTypes.Any(t => t === o.OrganizationType))
                .ToArray();
        } else {
            return new List<OrganizationModel>().ToArray();
        }

    }

    private defaultIfEmpty(selectedOrganizations: OrganizationModel[]): OrganizationModel[] {

        if (selectedOrganizations && selectedOrganizations.length === 0) {
            const defaultFacility = this.userStateService.getDefaultFacility(this.filtersService.allowedOrganizationTypes.get());
            if (defaultFacility) {
                selectedOrganizations = [defaultFacility];
                this.filtersService.organizations.set(selectedOrganizations);
            }
        }

        return selectedOrganizations;
    }
}

export class EnterpriseOrganizationValueService extends FilterValueService<OrganizationModel> {

    private organizationFeaturesFilterService: FilterValueService<OrganizationModel>;

    constructor(store: Store<FilterState>,
        private filtersService: FiltersService,
        private featureService: FeatureService) {
        super(FilterValues.SelectedEnterpriseOrganization, store);

        this.organizationFeaturesFilterService = new FilterValueService(FilterValues.OrganizationFeatures, store);
    }
    set(value: OrganizationModel): Observable<any> {
        const previousOrg = super.get();
        if (previousOrg && value.OrganizationId !== previousOrg.OrganizationId) {
            this.removeFilterUnitAndPayers();
        }

        const orgObservable = new Observable(observer => {
            const observable = [];
            observable.push(this.featureService.getOrgFeatures(value.OrganizationId).pipe(
                map((response: any) => {
                    value.Features = response.Features;
                    value.LandingPageRoute = response.LandingPageRoute;
                })
            ));
            forkJoin(observable)
            .subscribe(() => {
                super.set(value);
                    observer.next();
                    observer.complete();
            });
        }).pipe(publish()) as ConnectableObservable<any>;
        orgObservable.connect();
        return orgObservable;
    }
    private removeFilterUnitAndPayers() {
        const filterSettings = this.filtersService.filterSettings.get();
        if (filterSettings && filterSettings !== '') {
            filterSettings.Units = null;
            filterSettings.Payers = null;
            this.filtersService.filterSettings.set(filterSettings);
        }
    }
}
