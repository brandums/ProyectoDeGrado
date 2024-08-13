import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UsuarioService } from '../services/usuario-service';
import { of } from 'rxjs';
import { Usuario } from '../Models/Usuario';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let usuarioService: UsuarioService;
  let mockUsuarios: Usuario[];

  beforeEach(async () => {
    mockUsuarios = [
      { id: 1, nombre: 'Usuario 1', correoElectronico: 'usuario1@example.com', contraseña: 'password1', rolId: 1, rol: { id: 1, nombre: 'Rol 1' } },
      { id: 2, nombre: 'Usuario 2', correoElectronico: 'usuario2@example.com', contraseña: 'password2', rolId: 2, rol: { id: 2, nombre: 'Rol 2' } },
      { id: 3, nombre: 'Usuario 3', correoElectronico: 'usuario3@example.com', contraseña: 'password3', rolId: 3, rol: { id: 3, nombre: 'Rol 3' } },
    ];

    const usuarioServiceMock = {
      getUsuarios: jasmine.createSpy('getUsuarios').and.returnValue(of(mockUsuarios)),
      eliminarUsuario: jasmine.createSpy('eliminarUsuario').and.returnValue(of({})),
      seleccionarUsuario: jasmine.createSpy('seleccionarUsuario'),
      $listaUsuarios: of(mockUsuarios)
    };

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with usuarios from the service', () => {
    expect(component.usuarios.length).toBe(3);
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('should filter usuarios based on search term', () => {
    component.buscarPalabra = '1';
    const filtered = component.filtroUsuarios;
    expect(filtered.length).toBe(1);
    expect(filtered[0].nombre).toContain('1');
  });

  it('should call seleccionarUsuario on the service when seleccionarUsuario is called', () => {
    const id = 1;
    component.seleccionarUsuario(id);
    expect(usuarioService.seleccionarUsuario).toHaveBeenCalledWith(id);
  });

  it('should get usuarios on init', () => {
    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('should remove usuario from list on eliminarUsuario', () => {
    const id = 1;
    component.eliminarUsuario(id);
    expect(usuarioService.eliminarUsuario).toHaveBeenCalledWith(id);
    expect(component.usuarios.length).toBe(2);
    expect(component.usuarios.find(usuario => usuario.id === id)).toBeUndefined();
  });
});
