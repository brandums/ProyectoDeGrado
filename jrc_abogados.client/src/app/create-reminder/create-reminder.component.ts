import { Component, OnInit } from '@angular/core';
import { RecordatorioService } from '../services/recordatorio-service';
import { Recordatorio } from '../Models/Recordatorio';
import { Cliente } from '../Models/Cliente';
import { ClienteService } from '../services/cliente-service';
import { AlertService } from '../services/AlertService';

@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html'
})
export class CreateReminderComponent implements OnInit {
  recordatorio: Recordatorio = new Recordatorio;
  clientes: Cliente[] = [];
  recordatorioId: number = 0;
  creandoRecordatorio = false;
  tituloForm = "Crear nuevo Recordatorio";
  formValidado = false;

  constructor(
    private recordatorioService: RecordatorioService,
    private clienteService: ClienteService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(data => this.clientes = data);

    this.recordatorioService.$recordatorioId.subscribe(id => {
      this.recordatorioId = id;
      if (id != 0) {
        this.recordatorioService.getRecordatorio(id).subscribe(data => {
          this.recordatorio = data;
          this.tituloForm = "Actualizar datos del Recordatorio"
        })
      }
      else {
        this.limpiarForm()
      }
    })
  }

  obtenerFecha(): string {
    const fechaActual = new Date();
    const formatoFecha = fechaActual.toISOString().split('T')[0];

    return formatoFecha;
  }

  FechaMaxima(): string {
    const fechaActual = new Date();
    const fechaFutura = new Date(fechaActual);
    fechaFutura.setFullYear(fechaActual.getFullYear() + 3);

    const formatoFecha = fechaFutura.toISOString().split('T')[0];
    return formatoFecha;
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
          if (this.recordatorioId != 0) {
            this.actualizarRecordatorio();
          }
          else {
            this.crearRecordatorio();
          }
        }

        typedForm.classList.add('was-validated');
      }, false);
    });
  }

  crearRecordatorio() {
    this.creandoRecordatorio = true;
    this.recordatorio.clienteId = parseInt(this.recordatorio.clienteId);
    this.recordatorioService.crearRecordatorio(this.recordatorio).subscribe(() => {
      this.recordatorioService.nuevoRecordatorio();

      this.cerrarForm();
      this.creandoRecordatorio = false;
      this.alertService.showMessage('Recordatorio creado con exito.');
    }, () => {
      this.creandoRecordatorio = false;
    })
  }

  actualizarRecordatorio() {
    this.creandoRecordatorio = true;
    this.recordatorioService.actualizarRecordatorio(this.recordatorioId, this.recordatorio).subscribe(() => {
      this.recordatorioService.nuevoRecordatorio();

      this.cerrarForm();
      this.creandoRecordatorio = false;
      this.alertService.showMessage('Recordatorio actualizado con exito.');
    }, () => {
      this.creandoRecordatorio = false;
    })
  }

  cerrarForm() {
    const button = document.getElementById('bClose');
    if (button instanceof HTMLElement) {
      button.click()
    }
  }

  limpiarForm() {
    this.recordatorio = new Recordatorio;
    this.tituloForm = "Crear nuevo Recordatorio";
    this.formValidado = false;

    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form: Element) => {
      form.classList.remove('was-validated');
    });
  }
}
