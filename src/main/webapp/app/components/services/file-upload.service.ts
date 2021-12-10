import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../firebase/file-upload.model';
import { IProduct, Product } from '../../entities/product/product.model';
import { ProductService } from '../../entities/product/service/product.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private basePath = '/uploads';

  constructor(private storage: AngularFireStorage, private productService: ProductService) {}

  pushFileToStorage(fileUpload: FileUpload): [Observable<number | undefined>, Observable<string | undefined>] {
    const filePath = `${this.basePath}/${fileUpload.path}/${fileUpload.filename}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    let subscriber: Subscriber<string | undefined>;
    const filePathObservable = new Observable<string | undefined>(sub => (subscriber = sub));

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            fileUpload.url = downloadURL;
            this.saveFileData(fileUpload, subscriber);
          });
        })
      )
      .subscribe();

    return [uploadTask.percentageChanges(), filePathObservable];
  }

  private saveFileData(fileUpload: FileUpload, subscriber: Subscriber<string | undefined>): void {
    const product: IProduct = new Product();
    product.id = fileUpload.resourceId;
    product.imagePath = fileUpload.url;
    this.productService.partialUpdate(product).subscribe(() => {
      subscriber.next(product.imagePath!);
    });
  }

  // getFiles(numberItems: number): AngularFireList<FileUpload> {
  //   return this.db.list(this.basePath, ref =>
  //     ref.limitToLast(numberItems));
  // }

  // deleteFile(fileUpload: FileUpload): void {
  //   this.deleteFileDatabase(fileUpload.key)
  //     .then(() => {
  //       this.deleteFileStorage(fileUpload.name);
  //     })
  //     .catch(error => console.log(error));
  // }

  // private deleteFileDatabase(key: string): Promise<void> {
  //   return this.db.list(this.basePath).remove(key);
  // }

  // private deleteFileStorage(name: string): void {
  //   const storageRef = this.storage.ref(this.basePath);
  //   storageRef.child(name).delete();
  // }
}
