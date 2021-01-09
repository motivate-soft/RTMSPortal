import { Feature } from 'src/app/shared/models/feaure';

export class OrganizationModel {
    public OrganizationId: number;
    public OrganizationName: string;
    public OrganizationType: Number;
    public LandingPageRoute?: string;
    public Features: Feature[];
    public OrgLevel: number;
    public OrganizationTypeName?: string;
    constructor(
    ) {
        this.Features = new Array() as Array<Feature>;
    }
}
