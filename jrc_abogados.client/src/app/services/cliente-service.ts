import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Cliente } from '../Models/Cliente';
import { API_BASE_URL } from '../configuracion';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = `${API_BASE_URL}/Cliente`;
  public $listaClientes: BehaviorSubject<Cliente[]> = new BehaviorSubject<Cliente[]>([]);
  public $clienteId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}`).pipe(
      map((clientes: Cliente[]) => {
        return clientes.map(cliente => {
          cliente.fechaNacimiento = new Date(cliente.fechaNacimiento).toISOString().split('T')[0];
          return cliente;
        });
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`).pipe(
      map(cliente => {
        cliente.fechaNacimiento = new Date(cliente.fechaNacimiento).toISOString().split('T')[0];
        return cliente;
      })
    );
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}`, cliente).pipe(
      catchError((error) => {
        if (error.status === 409) {
          return throwError(() => new Error('Este correo electrónico ya está registrado.'));
        }
        return throwError(() => new Error('Error creando el cliente. Inténtalo de nuevo más tarde.'));
      })
    );
  }

  actualizarCliente(id: number, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  nuevoCliente() {
    this.getClientes().subscribe(data => {
      this.$listaClientes.next(data);
    })
  }

  seleccionarCliente(id: number) {
    this.$clienteId.next(id)
  }
}
