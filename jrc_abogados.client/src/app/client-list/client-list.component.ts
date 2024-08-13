import { Component, OnInit } from '@angular/core';
import { Cliente } from '../Models/Cliente';
import { ClienteService } from '../services/cliente-service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  clientes: Cliente[] = [];
  buscarPalabra: string = '';
  clienteSeleccionado: Cliente | null = null;

  paginaActual: number = 1;
  clientesPorPagina: number = 10;

  campoFiltro: string = 'nombre';

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.getClientes();

    this.clienteService.$listaClientes.subscribe(data => {
      this.clientes = data;
    })
  }

  seleccionarCliente(clienteId: number) {
    this.clienteService.seleccionarCliente(clienteId);
  }

  verCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  editarCliente(clienteId: number) {
    this.seleccionarCliente(clienteId);
  }

  getClientes(): void {
    this.clienteService.getClientes()
      .subscribe((clientes: Cliente[]) => this.clientes = clientes);
  }

  get filtroClientes(): Cliente[] {
    return this.clientes.filter(cliente =>
      cliente[this.campoFiltro].toString().toLowerCase().includes(this.buscarPalabra.toLowerCase())
    );
  }

  eliminarCliente(id: number): void {
    this.clienteService.eliminarCliente(id)
      .subscribe(() => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      });
  }

  // Métodos para la paginación
  get clientesPaginados(): Cliente[] {
    const inicio = (this.paginaActual - 1) * this.clientesPorPagina;
    const fin = inicio + this.clientesPorPagina;
    return this.filtroClientes.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  get totalPaginas(): number {
    return Math.ceil(this.filtroClientes.length / this.clientesPorPagina);
  }
}

