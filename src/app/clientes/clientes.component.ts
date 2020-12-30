import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes : Cliente[];
  paginador:any;
  clienteSeleccionado:Cliente; 

  constructor(private clienteService:ClienteService,
              private activatedRoute:ActivatedRoute,
              private modalService:ModalService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe( params =>{
      let page:number = +params.get('page');
      if (!page){
        page = 0;
      }
    this.clienteService.getClientes(page)
    .subscribe(response => {
        this.clientes = response.content as Cliente[]
        this.paginador = response;
      }
    )});

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes.map(clienteOriginal =>{
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal
      })
    })
  }

  delete(cliente: Cliente): void{
     
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: `¿Estas segur@ de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
  text: "Esta acción no es reversible",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Si, eliminar',
  cancelButtonText: 'No, cancelar',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
      this.clientes = this.clientes.filter(cli=> cli !== cliente)

    this.clienteService.delete(cliente.id).subscribe(
      response => {
        swalWithBootstrapButtons.fire(
          '¡Eliminado!',
          `El cliente ${cliente.nombre} ${cliente.apellido} se ha eliminado con exito`,
          'success'
        )
      }
    )
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Cancelado',
      'La operacion a sido cancelada',
      'error'
    )
  }
})
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente
    this.modalService.modelActivate();
  }
}
