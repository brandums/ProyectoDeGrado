import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Usuario } from '../Models/Usuario';
import { API_BASE_URL } from '../configuracion';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${API_BASE_URL}/Empleado`;
  public $listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  public $usuarioId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}`, usuario).pipe(
      catchError((error) => {
        if (error.status === 409) {
          return throwError(() => new Error('Este correo electrónico ya está registrado.'));
        }
        return throwError(() => new Error('Error creando el usuario. Inténtalo de nuevo más tarde.'));
      })
    );
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  nuevoUsuario() {
    this.getUsuarios().subscribe(data => {
      this.$listaUsuarios.next(data);
    })
  }

  seleccionarUsuario(id: number) {
    this.$usuarioId.next(id)
  }
}
