
export function getRiskColor(riskLevel: string): string {
    let riskColor = '';
    switch (riskLevel.toLowerCase()) {
        case 'high': {
            riskColor = 'Red';
            break;
        }
        case 'moderate': {
            riskColor = '#FFCE42';
            break;
        }
        case 'low': {
            riskColor = 'Green';
            break;
        }
        default: {
            riskColor = '';
            break;
        }
    }
    return riskColor;
}

export function getFileIconClassFromFileExtension(fileExtension): string {
    switch (fileExtension) {
        case "bmp":
        case "gif":
        case "jpeg":
        case "jpg":
        case "png": return "fa-file-image-o";
        case "csv": return "fa-file-csv";
        case "doc":
        case "docx":
        case "gdoc": return "fa-file-word-o";
        case "mp3":
        case "opus":
        case "oga": return "fa-file-audio-o";
        case "mp4":
        case "mpeg":
        case "avi":
        case "ogv": return "fa-file-video-o";
        case "pdf": return "fa-file-pdf-o";
        case "txt": return "fa-file-text";
        case "xls":
        case "xlsx": return "fa-file-excel-o";
        case "ppt": 
        case "pptx": return "fa-file-powerpoint-o";
        default: return "fa-file";
    }
}

export function getMimeTypeFromFileExtension(fileExtension): string {
    switch (fileExtension) {
        case "avi": return "video/x-msvideo";
        case "bmp": return "image/bmp";
        case "csv": return "text/csv";
        case "doc": return "application/msword";
        case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "gdoc": return "application/vnd.google-apps.document";
        case "gif": return "image/gif";
        case "jpeg":
        case "jpg": return "image/jpeg";
        case "mp3": return "audio/mpeg";
        case "mp4": return "video/mp4";
        case "mpeg": return "video/mpeg";
        case "oga": return "audio/ogg";
        case "ogv": return "video/ogg";
        case "opus": return "audio/opus";
        case "png": return "image/png";
        case "pdf": return "application/pdf";
        case "txt": return "text/plain";
        case "xls": return "application/vnd.ms-excel";
        case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "ppt": return "application/vnd.ms-powerpoint";
        case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";        
        default: return "application/octet-stream";
    }
}

