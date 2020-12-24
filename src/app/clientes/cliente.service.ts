import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of,Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import { map,catchError,tap } from 'rxjs/operators'
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = "http://localhost:8080/api/clientes"
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http:HttpClient, private router:Router) { }

  getClientes(page:number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
      tap((response:any) =>{
        console.log("ClienteService: tap 1");
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre)
        })
      }),
      map((response:any) => {
       
        ( response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase(); 
          //cliente.createAt = formatDate(cliente.createAt,"fullDate","cl","GMT-3")
          return cliente;
        
        });
        return response;
      }),
      tap(response =>{
        console.log("ClienteService: tap 2");
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre)
        })
      })
    );
  }

  create(cliente: Cliente):  Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      //Convertir tipo json a Cliente
      map((response:any) => response.cliente as Cliente),
      catchError(e =>{

        if (e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire('Error',e.error.mensaje, 'error');
        return throwError(e)
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      //Mandar error en el caso de que no encuentre la ID del cliente
      catchError(e => {
        //Router: Dirigir a una pagina establecida en este caso clientes, en caso de que no encuentre ningun
        //cliente con esa id
        this.router.navigate(['/clientes'])
        //Escribe el error en la consola del navegador
        //e.error.mensaje: Se obtiene del backend 
        console.error(e.error.mensaje);
        Swal.fire('Error',e.error.mensaje, 'error');
        return throwError(e)
      })
    )
  }
  update(cliente:Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente,  {headers:this.httpHeaders}).pipe(
      catchError(e =>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error',e.error.mensaje, 'error');
        return throwError(e)
      })
    )
  }
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError(e =>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error',e.error.mensaje, 'error');
        return throwError(e)
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST', '`${this.urlEndPoint}/upload`',formData, {
      reportProgress: true
    });
    
    return this.http.request(req)
  }
}
