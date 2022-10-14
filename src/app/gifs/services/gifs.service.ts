import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey     : string = '7oYyHHFCDAQMsUCVcMgMtQtInY7ICBBu';
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial: string[] = [];  

  public resultados : Gif[] = [];

  constructor( private http: HttpClient ) { 
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem('resultados')!) || [];
    /*
    if(localStorage.getItem('historial')){
        this._historial = JSON.parse( localStorage.getItem('historial')! );
    }
    */
  }

  get historial(){
    return [...this._historial];
  }

  buscarGifs( query:string ){
    query = query.trim().toLocaleLowerCase();
    if ( !this._historial.includes(query) ){
      this._historial.unshift( query ); //Agrega al inicio
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit','10')
          .set('q', query );

    //console.log( params.toString()); ver en consola los query params       

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe( resp => {
        this.resultados = resp.data;

        localStorage.setItem('resultados', JSON.stringify(this.resultados)); 
        //console.log(resp.data);
      });
  }
}
