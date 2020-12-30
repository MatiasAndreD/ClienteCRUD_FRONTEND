import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal:boolean = false;

  constructor() { }


  modelActivate(){
    this.modal = true
  }
  modelDesactivate(){
    this.modal = false;
  }
}
