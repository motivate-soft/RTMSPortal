import { ErrorSeverity } from '../enums/error-severity';

export class ValidationError {
    public Field: string;
    public ErrorMessages: string[];
    public Severity: ErrorSeverity;

    constructor(error: ValidationError) {
        this.Field = error.Field;
        this.ErrorMessages = error.ErrorMessages;
        this.Severity = error.Severity;
    }

    public toDisplayString(separator: string = '<br />'): string {
        return this.ErrorMessages.join(separator);
    }
}