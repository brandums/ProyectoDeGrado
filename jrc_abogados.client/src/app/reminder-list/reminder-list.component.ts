import { Component, OnInit } from '@angular/core';
import { RecordatorioService } from '../services/recordatorio-service';
import { Recordatorio } from '../Models/Recordatorio';
import { AlertService } from '../services/AlertService';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html'
})
export class ReminderListComponent implements OnInit {
  recordatorios: Recordatorio[] = [];
  buscarPalabra: string = '';
  recordatorioSeleccionado: Recordatorio | null = null;

  paginaActual: number = 1;
  recordatoriosPorPagina: number = 10;

  campoFiltro: string = 'cliente.nombre';

  constructor(
    private recordatorioService: RecordatorioService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getRecordatorios();

    this.recordatorioService.$listaRecordatorios.subscribe(data => {
      this.recordatorios = data;
    })
  }

  seleccionarRecordatorio(recordatorioId: number) {
    this.recordatorioService.seleccionarRecordatorio(recordatorioId);
  }

  verRecordatorio(recordatorio: Recordatorio) {
    this.recordatorioSeleccionado = recordatorio;
  }

  editarRecordatorio(recordatorioId: number) {
    this.seleccionarRecordatorio(recordatorioId);
  }

  getRecordatorios(): void {
    this.recordatorioService.getRecordatorios().subscribe((recordatorios: Recordatorio[]) => this.recordatorios = recordatorios);
  }

  get filtroRecordatorios(): Recordatorio[] {
    return this.recordatorios.filter(recordatorio => {
      const valor = this.obtenerValor(recordatorio, this.campoFiltro);
      return valor && valor.toString().toLowerCase().includes(this.buscarPalabra.toLowerCase());
    });
  }

  obtenerValor(obj: any, ruta: string): any {
    return ruta.split('.').reduce((o, i) => o?.[i], obj);
  }

  eliminarRecordatorio(id: number): void {
    this.recordatorioService.eliminarRecordatorio(id).subscribe(() => {
      this.recordatorios = this.recordatorios.filter(recordatorio => recordatorio.id !== id);
      this.alertService.showMessage('Recordatorio eliminado con exito.');
      });
  }

  // Métodos para la paginación
  get clientesPaginados(): Recordatorio[] {
    const inicio = (this.paginaActual - 1) * this.recordatoriosPorPagina;
    const fin = inicio + this.recordatoriosPorPagina;
    return this.filtroRecordatorios.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.filtroRecordatorios.length / this.recordatoriosPorPagina);
  }
}

