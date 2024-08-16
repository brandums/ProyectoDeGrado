import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente-service';
import { Cliente } from '../Models/Cliente';
import { UbicacionService } from '../services/ubicacion-service';
import { CityStateService } from '../services/city-state.service';
import { AlertService } from '../services/AlertService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html'
})
export class CreateClientComponent implements OnInit {
  cliente: Cliente = new Cliente;
  clienteId = 0;
  extencionEmail = "gmail";
  extencionEmail2 = "com";
  tituloForm = "Crear nuevo Cliente";
  nickEmail = ""
  creandoCliente = false;
  formValidado = false;
  errorMensaje: string | null = null;

  estados: string[] = [];
  ciudades: string[] = [];

  constructor(
    private clienteService: ClienteService,
    private ubicacionService: UbicacionService,
    private cityStateService: CityStateService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.clienteService.$clienteId.subscribe(id => {
      this.clienteId = id;
      if (id != 0) {
        this.clienteService.getCliente(id).subscribe(data => {
          this.cliente = data;
          const partesEmail = data.correoElectronico.split('@');
          this.nickEmail = partesEmail[0];
          this.extencionEmail = partesEmail[1].split('.')[0];
          this.extencionEmail2 = partesEmail[1].split('.')[1];
          this.onStateChange(this.cliente.ubicacion.estado);
        })
        this.tituloForm = "Actualizar datos del Cliente"
      }
      else {
        this.limpiarForm();
      }
    })

    this.cityStateService.getStates().subscribe(data => {
      this.estados = data;
    });
  }

  onStateChange(state: string): void {
    this.cityStateService.getCitiesByState(state).subscribe(ciudades => {
      this.ciudades = ciudades;
      
      if (this.cliente.ubicacion.ciudad) {
        this.cliente.ubicacion.ciudad = this.cliente.ubicacion.ciudad;
      }
    });
  }

  FechaMinima(): string {
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 95);
    const formatoFecha = fechaActual.toISOString().split('T')[0];

    return formatoFecha;
  }

  FechaMaxima(): string {
    const fechaActual = new Date();
    fechaActual.setFullYear(fechaActual.getFullYear() - 18);
    const formatoFecha = fechaActual.toISOString().split('T')[0];

    return formatoFecha;
  }

  validarEmail(event: KeyboardEvent | ClipboardEvent) {
    const teclaPresionada = (event as KeyboardEvent).key;
    const patron = /^[^\s'"]$/;

    if (event instanceof KeyboardEvent) {
      if (!patron.test(teclaPresionada) && teclaPresionada !== 'Backspace' && teclaPresionada !== 'Delete' && teclaPresionada !== 'ArrowLeft' && teclaPresionada !== 'ArrowRight') {
        event.preventDefault();
      }
    }

    if (event instanceof ClipboardEvent) {
      const clipboardData = event.clipboardData?.getData('text') || '';
      if (/[^\s'"]/.test(clipboardData)) {
        event.preventDefault();
      }
    }
  }

  limitarNumeros(event: KeyboardEvent | ClipboardEvent) {
    const teclaPresionada = (event as KeyboardEvent).key;
    const patron = /^[0-9]$/;
    
    if (event instanceof KeyboardEvent) {
      if (!patron.test(teclaPresionada) && teclaPresionada !== 'Backspace' && teclaPresionada !== 'Delete' && teclaPresionada !== 'ArrowLeft' && teclaPresionada !== 'ArrowRight') {
        event.preventDefault();
      }
    }
    
    if (event instanceof ClipboardEvent) {
      event.preventDefault();
    }
  }

  validarTexto(event: KeyboardEvent) {
    const teclaPresionada = event.key;
    const patron = /^[a-zA-Z\s]*$/;
    if (!patron.test(teclaPresionada)) {
      event.preventDefault();
    }
  }

  unirEmail() {
    this.cliente.correoElectronico = this.nickEmail + "@" + this.extencionEmail + "." + this.extencionEmail2
  }

  iniciarValidadores() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach((form: Element) => {
      const typedForm = form as HTMLFormElement;
      typedForm.addEventListener('submit', (event) => {
        if (this.formValidado) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (!typedForm.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        else {
          if (!this.creandoCliente) {
            this.formValidado = true;
            if (this.clienteId != 0) {
              this.actualizarCliente();
            }
            else {
              this.crearCliente();
            }
          }
        }

        typedForm.classList.add('was-validated');
      }, false);
    });
  }

  crearCliente() {
    this.creandoCliente = true;
    this.errorMensaje = null;
    this.unirEmail()
    this.ubicacionService.crearUbicacion(this.cliente.ubicacion).subscribe(data => {
      this.cliente.ubicacionId = data.id;

      this.clienteService.crearCliente(this.cliente).subscribe(() => {
        this.clienteService.nuevoCliente();

        this.cerrarForm();
        this.creandoCliente = false;
        this.alertService.showMessage('Cliente creado con exito.');
      }, error => {
        this.errorMensaje = error.message;
        this.creandoCliente = false;
        this.formValidado = false;
      })
    })
  }

  actualizarCliente() {
    this.unirEmail();
    this.ubicacionService.actualizarUbicacion(this.cliente.ubicacionId, this.cliente.ubicacion).subscribe(() => {
      this.clienteService.actualizarCliente(this.clienteId, this.cliente).subscribe(() => {
        this.clienteService.nuevoCliente();

        this.cerrarForm();
        this.creandoCliente = false;
        this.alertService.showMessage('Cliente actualizado con exito.');
      }, () => {
        this.creandoCliente = false;
        this.formValidado = false;
      })
    })
  }

  cerrarForm() {
    const button = document.getElementById('bClose');
    if (button instanceof HTMLElement) {
      button.click()
    }
  }

  limpiarForm() {
    this.nickEmail = "";
    this.cliente = new Cliente;
    this.tituloForm = "Crear nuevo Cliente"
    this.formValidado = false;
    this.errorMensaje = null;

    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form: Element) => {
      form.classList.remove('was-validated');
    });
  }
}
