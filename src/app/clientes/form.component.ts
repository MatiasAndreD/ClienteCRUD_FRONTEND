import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import  swal  from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
   cliente: Cliente = new Cliente();
   titulo:string = "Crear cliente"

  errores: string[];

  constructor(private clienteService: ClienteService, private router:Router, private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente()
  }

  cargarCliente(): void{
    this.titulo = "Cargar cliente"
    this.activateRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente)=> this.cliente = cliente)
      }

    })
  }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente =>  {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente',  `Cliente: ${cliente.nombre} creado con exito`,'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo de error desde el backend ' + err.status)
        console.error(err.error.errors);
      
      }
    );
    console.log("Clicked!");
    console.log(this.cliente)

  }
  public update():void{
    this.clienteService.update(this.cliente)
    .subscribe( json =>{
       this.router.navigate(['/clientes'])
       swal.fire('Cliente actualizado', `Cliente:  ${json.cliente.nombre} actualizado con exito`,'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo de error desde el backend ' + err.status)
      console.error(err.error.errors);
    })
  }
}
