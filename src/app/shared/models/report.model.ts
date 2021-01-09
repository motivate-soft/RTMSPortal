export class ReportModel {
    public ReportId: Number;
    public ReportName: string;
    public ReportGroup: number;
    public OrganizationId: number;
    public OrganizationName: string;
    public ReportImage: string;
    public ReportRoute: string;
    public ReportType: number;
    public FeatureId: number;
    public DrillsIntoReportId: number;
    public isVisible: boolean;
    public ReportDashboardId: number;
    public ReportCategory: string;

    public constructor(init?: Partial<ReportModel>) {
      Object.assign(this, init);
  }
}
