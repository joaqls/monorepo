import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent {

  // ===== FORMULARIO DE CONTACTO =====
  contacto = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  // ===== FORMULARIO DE INSCRIPCIÓN =====
  inscripcion = {
    nombre: '',
    email: '',
    deporte: ''
  };

  // ===== CONTROL MODAL =====
  modalAbierto = false;

  // ===== MÉTODOS =====
  enviarMensaje() {
    alert('Mensaje enviado correctamente');
    this.contacto = { nombre: '', email: '', mensaje: '' };
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  inscribirse() {
    alert('Inscripción realizada');
    this.inscripcion = { nombre: '', email: '', deporte: '' };
    this.cerrarModal();
  }
}
