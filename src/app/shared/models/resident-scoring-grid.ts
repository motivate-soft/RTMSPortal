import { ResidentModel } from './resident';

export interface ResidentScoringGrid extends ResidentModel {
  AlertScore: string;
  AlertDetail: string;
  LengthOfStayScore: string;
  LengthOfStayDetail: string;
  AcuityScore: string;
  AcuityDetail: string;
  DiagnosisScore: string;
  DiagnosisDetail: string;
  PayerName: string;
  ScoreDate: string;
  FacId: number;
}
