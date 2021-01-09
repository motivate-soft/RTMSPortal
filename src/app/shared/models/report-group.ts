export class ReportGroup {
  Id: number;
  Name: string;
  IconClass: string;
  Route: string;

  public constructor(init?: Partial<ReportGroup>) {
    Object.assign(this, init);
  }
}
