import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import  swal  from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente: Cliente;
  titulo: String = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso:number = 0;


  constructor(private clienteService:ClienteService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params =>{
        let id = +params.get('id')

        if(id){
          this.clienteService.getCliente(id).subscribe(cliente =>{
            this.cliente = cliente;
          })
        }
      }
    )
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
     console.log(this.fotoSeleccionada);
     if(this.fotoSeleccionada.type.indexOf('image') < 0 ){
      swal.fire(`Error seleccionar imagen:`, `El archivo tiene que ser del tipo imagen`,'error');
      this.fotoSeleccionada = null  
     }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire(`No ha seleccionado ninguna imagen`, `Porfavor, selecciona una imagen para continuar`,'error')  
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada,this.cliente.id).subscribe(
      event =>{
        if (event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100)
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          swal.fire('La foto se ha subido completamente', response.mensaje, 'success' );
        }

        }
      );
        swal.fire('La foto del cliente ', `se a subido con exito`,'success')     
      }
    }
  }

  


  

