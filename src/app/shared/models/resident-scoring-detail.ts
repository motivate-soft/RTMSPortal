import { ResidentScoringGrid } from './resident-scoring-grid';

export interface ResidentScoringDetail extends ResidentScoringGrid {
    AlertDetailsParsed: Array<string>;
    DiagnosisDetailsParsed: Array<string>;
    TotalScoreFormatted: string;
    FacilityName: string;
    FacId: number;
    Keywords: Array<any>;
    AlertsAndInterventions: string;
}
