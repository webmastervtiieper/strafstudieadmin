import { HttpClient, HttpParams } from '@angular/common/http';

export class MetadataRepositorySmartschool {
  constructor(private baseUrl: string, private httpClient: HttpClient) { }

  public fetchMetaData() {
    const httpParams: HttpParams = new HttpParams();
    const url = this.baseUrl + 'smartshoolmetadata';
    return this.httpClient.get(url);
  }
}
