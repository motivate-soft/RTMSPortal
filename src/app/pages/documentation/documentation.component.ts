import { Component, OnInit, Pipe } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { DocumentationStateService } from 'src/app/documentation/store/services/documentation-state.service';
import { BaseComponent } from 'src/app/shared/components';
import { Directory } from 'src/app/shared/models/directory';
import { DocumentsDataService } from 'src/app/shared/services/portal/documentsData.service';
import { list } from 'src/app/shared/utility/list';
import { getFileIconClassFromFileExtension, getMimeTypeFromFileExtension } from 'src/app/shared/utility/ui-helper';
import * as _ from 'lodash';
import { PagingService } from 'src/app/shared/services/services-index';

@Pipe({
  name: 'searchFilter',
  pure: false
})

@Component({
  selector: 'rtms-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})

export class DocumentationComponent extends BaseComponent implements OnInit {
  data = [];
  public directoryDrillDownHistory: Directory[] = [];
  _searchText = '';  
  sortReverse = false;
  sortType = 'Name';
  showNoDataDiv = false;
  constructor(private documentsDataService: DocumentsDataService,
    private fileSaver: FileSaverService,
    private documentationStateService: DocumentationStateService,
    private pagingService: PagingService) {
    super();
    this.subscriptions.push(this.documentationStateService.getDirectoryDrillDownHistoryStream()
      .subscribe(data => {
        this.directoryDrillDownHistory = list(data).ToArray();
      }));
  }

  ngOnInit(): void {
    this.directoryDrillDownHistory = this.documentationStateService.getDirectoryDrillDownHistory();
    if (this.directoryDrillDownHistory && this.directoryDrillDownHistory.length > 0) {
      this.getDirectory(this.directoryDrillDownHistory[this.directoryDrillDownHistory.length - 1], true);
    } else {
      this.getDirectory({ Name: '', Path: '' });
    }
  }

  getDirectory(directory, IsNavigateBack?): void {
    this.documentsDataService.getDirectory(directory.Path).subscribe(response => {
      if (!IsNavigateBack) {
        this.documentationStateService.addDirectoryDrillDownHistory(directory);
      } else {
        this.documentationStateService.navigateBack(directory);
      }
      this.data = response;
      this.sortData();
      this.showNoDataDiv = true;
      this.data.map((element) => {
        element.IsDownloading = false;
      });
    });
  }

  getFile(file): void {
    this.documentsDataService.getFile(file.Path).subscribe(response => {
      this.saveFile(response, file);
      file.IsDownloading = false;
    });
  }

  onClick(item) {
    if (item.IsDirectory) {
      this.getDirectory(item);
    } else {
      item.IsDownloading = true;
      this.getFile(item);
    }
  }

  saveFile(response, file) {
    const byteCharacters = atob(response);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray],
      { type: getMimeTypeFromFileExtension(this.getFileExtensionFromFileName(file.Name)) });
    this.fileSaver.save(blob, file.Name);
  }

  getFileExtensionFromFileName(fileName) {
    const array = fileName.split('.');
    return array[array.length - 1];
  }

  getFileIconClass(item) {
    if (item.IsDirectory) return 'fa-folder';
    if (item.IsDownloading) {
      return 'fa-circle-notch fa-spin';
    } else {
      return getFileIconClassFromFileExtension(this.getFileExtensionFromFileName(item.Name));
    }
  }

  setSortIcon(sortType): string {
    return sortType ? 'fa fa-sort-desc' : 'fa fa-sort-asc';
  }

  sortChanged(column) {
    this.sortReverse = this.sortType === column && this.sortReverse !== undefined ? !this.sortReverse : false;
    this.sortType = column;
    this.sortData();
  }

  sortData() {
    let sortingConfig: Array<{
      field: string,
      direction: 'asc' | 'desc'
    }> = [];

    sortingConfig.push({
      field: 'IsDirectory',
      direction: 'desc'
    });

    sortingConfig.push({
      field: this.sortType,
      direction: this.sortReverse ? 'desc' : 'asc'
    });

    this.data = this.pagingService.sortData(this.data, sortingConfig);    
  }
}  