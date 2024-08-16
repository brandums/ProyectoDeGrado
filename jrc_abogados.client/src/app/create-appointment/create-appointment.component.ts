import { Component, OnInit } from '@angular/core';
import { CitaService } from '../services/cita-service';
import { Cita } from '../Models/Cita';
import { UbicacionService } from '../services/ubicacion-service';
import { Estado } from '../Models/Estado';
import { EstadoService } from '../services/estado-service';
import { Cliente } from '../Models/Cliente';
import { ClienteService } from '../services/cliente-service';
import { CityStateService } from '../services/city-state.service';
import { AlertService } from '../services/AlertService';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html'
})
export class CreateAppointmentComponent implements OnInit {
  cita: Cita = new Cita;
  citaId = 0;
  estados: Estado[] = [];
  clientes: Cliente[] = [];
  tituloForm = "Crear nueva Cita";
  creandoCita = false;
  formValidado = false;

  estadosUbi: string[] = [];
  ciudades: string[] = [];

  constructor(
    private clienteService: ClienteService,
    private citaService: CitaService,
    private ubicacionService: UbicacionService,
    private estadoService: EstadoService,
    private cityStateService: CityStateService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.estadoService.getEstados().subscribe(data => this.estados = data);
    this.clienteService.getClientes().subscribe(data => this.clientes = data);

    this.citaService.$citaId.subscribe(id => {
      this.citaId = id;
      if (id != 0) {
        this.citaService.getCita(id).subscribe(data => {
          this.cita = data;

          this.onStateChange(this.cita.ubicacion.estado);
        })
        this.tituloForm = "Actualizar datos de la Cita"
      }
      else {
        this.limpiarForm()
      }
    })

    this.cityStateService.getStates().subscribe(data => {
      this.estadosUbi = data;
    });
  }

  onStateChange(state: string): void {
    this.cityStateService.getCitiesByState(state).subscribe(ciudades => {
      this.ciudades = ciudades;

      if (this.cita.ubicacion.ciudad) {
        this.cita.ubicacion.ciudad = this.cita.ubicacion.ciudad;
      }
    });
  }

  FechaMinima(): string {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 1);
    const formatoFecha = fechaActual.toISOString().split('T')[0];

    return formatoFecha;
  }

  FechaMaxima(): string {
    const fechaActual = new Date();
    const fechaFutura = new Date(fechaActual);
    fechaFutura.setFullYear(fechaActual.getFullYear() + 1);

    const formatoFecha = fechaFutura.toISOString().split('T')[0];
    return formatoFecha;
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
          this.formValidado = true;
          if (this.citaId != 0) {
            this.actualizarCita();
          }
          else {
            this.crearCita();
          }
        }

        typedForm.classList.add('was-validated');
      }, false);
    });
  }

  crearCita() {
    this.creandoCita = true;
    this.ubicacionService.crearUbicacion(this.cita.ubicacion).subscribe(ubicacion => {
      this.cita.ubicacionId = ubicacion.id;

      this.citaService.crearCita(this.cita).subscribe(() => {
        this.citaService.nuevaCita();

        this.cerrarForm();
        this.creandoCita = false;
        this.alertService.showMessage('Cita creada con exito.');
      }, () => {
        this.creandoCita = false;
        this.formValidado = false;
      })
    })
  }

  actualizarCita() {
    this.creandoCita = true;
    this.ubicacionService.actualizarUbicacion(this.cita.ubicacionId, this.cita.ubicacion).subscribe(() => {
      this.citaService.actualizarCita(this.citaId, this.cita).subscribe(() => {
        this.citaService.nuevaCita();

        this.cerrarForm();
        this.creandoCita = false;
        this.alertService.showMessage('Cita actualizada con exito.');
      }, () => {
        this.creandoCita = false;
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
    this.cita = new Cita;
    this.tituloForm = "Crear nueva Cita"
    this.formValidado = false;

    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form: Element) => {
      form.classList.remove('was-validated');
    });
  }
}
