export class RtmsConstantService {
    settings = {
        FilterOpened: 'FilterOpened',
        DefaultFacility: 'DefaultFacility'
    };

    settingTypes = {
        Boolean: 'Boolean',
        Numeric: 'Numeric',
        String: 'String'
    };

    filterTypes = {
        Date: 'Date',
        Payer: 'Payer',
        LongStay: 'LongStay',
        ShortStay: 'ShortStay',
        None: 'None',
        AlertsCategory: 'AlertsCategory',
        FunctionalScoreCategory: 'FunctionalScoreCategory',
        PDPMSummaryCategory: 'PDPMSummaryCategory',
        PDPMSummarySubCategory: 'PDPMSummarySubCategory',
        Diagnosis: 'Diagnosis',
        ThirtyNinety: 'ThirtyNinety',
        PayerRatioDetail: 'PayerRatioDetail',
        Quarter: 'Quarter',
        Month: 'Month',
        Facility: 'Facility',
        QM : 'QM',
        CorporationStateNational: 'CorporationStateNational',
        AntibioticPointPrevalence: 'AntibioticPointPrevalence',
        AntibioticStarts: 'AntibioticStarts',
        AntibioticDOT: 'AntibioticDOT',
        RiskLevel: 'RiskLevel',
        UnitName: 'UnitName',
        PhysicianName: 'PhysicianName',
        InfectionType: 'InfectionType',
        MonthYear: 'MonthYear',
        PayerCategory: 'PayerCategory'
    };

    organizationTypes = {
        None: 0,
        Facility: 1,
        Corporation: 2,
        Region: 3,
        HealthSystem: 4,
        MembershipOrg: 5,
        Provider: 6
    };

    allOrganizationTypes = [this.organizationTypes.Facility,
    this.organizationTypes.Corporation,
    this.organizationTypes.Region,
    this.organizationTypes.HealthSystem,
    this.organizationTypes.MembershipOrg,
    this.organizationTypes.Provider,
    this.organizationTypes.None, null];
}

export const DisplayFormats = {
    date: 'mm/dd/yy'
};

export const RtmsConstantServiceObj = new RtmsConstantService();
