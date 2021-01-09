export class ExceptionLoggerModel{
    public ErrorMessage : string;
    public LogDate: Date;
    
    constructor(errorMessage) {
        this.ErrorMessage = errorMessage;
        this.LogDate = new Date(); 
    }
}
