import { Observable } from 'rxjs';

export class FileUpload {
  url: string;
  resourceId: number;
  file: File;
  path: string;
  filename: string;
  pathObservable: Observable<string>;

  constructor(file: File, path: string, resourceId: number) {
    this.file = file;
    this.path = path;
    this.resourceId = resourceId;
    this.filename = String(resourceId);
    this.url = '';
    this.pathObservable = new Observable<string>();
  }
}
