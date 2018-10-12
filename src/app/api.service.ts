import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs/';

var SERVER = ''
if (window.location.hostname === 'localhost') {
  SERVER = 'https://dev-unotv.tmx-internacional.net'
  // SERVER = 'https://unotv-admin-bo.tmx-internacional.net'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public static END_POINTS = {
    // post 	find all
    deportes: '/YOG_WSB_BackOffice/rest/catalogos/deportes/',
    // post 	find all
    CEventoFindAll: '/YOG_WSB_BackOffice/rest/cEventoController/',
    // post 	find by id Widget
    CEventoFindByWidget: '/YOG_WSB_BackOffice/rest/cEventoController/',
    // post 	update
    CEventoUpdate: '/YOG_WSB_BackOffice/rest/cEventoController/update'
  }

  constructor(
    private http: HttpClient) {
  }

  private makeQueryParams (params) {
    var pares = [];
    for (let key in params) {
      if (params[key] != undefined) {
        pares.push(key + '=' + params[key]);
      }
    }
    if (pares.length > 0) {
      return pares.join('&');
    } else {
      return '';
    }
  }

  private makeUrl (endPoint, params): string {
    let url = SERVER + endPoint;
    url += params.params ? params.params + '/' : '';
    url += params.query ? '?' + this.makeQueryParams(params.query) + '/' : '';
    return url;
  }

  public post(endPoint, params) {
    let url = this.makeUrl(endPoint, params);
    console.log(url)
    console.log(JSON.stringify(params.body))
    return this.http.post<any>(url, params.body)
    .pipe(catchError(this.handleError(endPoint)));
  }

  //- ==================
  //- HANDLE ERROR
  //- ==================
  handleError <T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`[api.services] ${operation}: `);
      console.error(error);
      if (error.status == 0) {
        console.log("Occurrio un error, intente mas tarde porfavor");
        throw error;
      }
      return of(error as T);
    }
  }

}
