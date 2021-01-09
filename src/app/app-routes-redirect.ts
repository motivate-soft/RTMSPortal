import { Ng2StateDeclaration } from '@uirouter/angular';

export const ROUTESREDIRECT: Array<Ng2StateDeclaration> = [
    {
        name: 'home.facilityPortalUsageReportRedirect',
        url: 'FacilityPortalUsageReport',
        redirectTo: {
            state: 'home.facilityPortalUsageReport'
        }
    },
    {
        name: 'home.portalUsageReportRedirect',
        url: 'PortalUsageReport',
        redirectTo: {
            state: 'home.portalUsageReport'
        }
    },
    {
        name: 'home.keywordReportRedirect',
        url: 'keywordReport',
        redirectTo: {
            state: 'home.keywordReport'
        }
    },
    {
        name: 'home.utilizationScoreCardRedirect',
        url: 'UtilizationScoreCard',
        redirectTo: {
            state: 'home.utilizationScoreCard'
        }
    },
];
