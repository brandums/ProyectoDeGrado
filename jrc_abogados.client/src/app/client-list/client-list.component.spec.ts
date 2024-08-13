import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { ClientListComponent } from './client-list.component';
import { ClienteService } from '../services/cliente-service';
import { Cliente } from '../Models/Cliente';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let clienteService: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ClienteService', ['getClientes', 'eliminarCliente', 'seleccionarCliente']);
    await TestBed.configureTestingModule({
      declarations: [ClientListComponent],
      providers: [
        { provide: ClienteService, useValue: spy }
      ]
    })
      .compileComponents();

    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    
    const clientesMock: Cliente[] = [
      {
        id: 1,
        nombre: "Cliente 1",
        apellido: "Apellido 1",
        fechaNacimiento: "2000-01-01",
        telefono: "1234567890",
        correoElectronico: "cliente1@example.com",
        ubicacionId: 1,
        ubicacion: { id: 1, direccion: "Direccion 1", estado: "Estado 1", ciudad: "Ciudad 1", codigoPostal: "00001" }
      },
      {
        id: 2,
        nombre: "Cliente 2",
        apellido: "Apellido 2",
        fechaNacimiento: "1990-05-15",
        telefono: "0987654321",
        correoElectronico: "cliente2@example.com",
        ubicacionId: 2,
        ubicacion: { id: 2, direccion: "Direccion 2", estado: "Estado 2", ciudad: "Ciudad 2", codigoPostal: "00002" }
      }
    ];
    
    const listaClientesSubject = new BehaviorSubject<Cliente[]>(clientesMock);
    clienteService.getClientes.and.returnValue(of(clientesMock));
    clienteService.$listaClientes = listaClientesSubject;
    clienteService.eliminarCliente.and.returnValue(of({}));
    clienteService.seleccionarCliente.and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch clients on init', () => {
    component.ngOnInit();
    expect(clienteService.getClientes).toHaveBeenCalled();
    expect(component.clientes.length).toBe(2);
  });

  it('should filter clients by name and surname', () => {
    component.buscarPalabra = 'Cliente 1';
    fixture.detectChanges();
    const filteredClients = component.filtroClientes;
    expect(filteredClients.length).toBe(1);
    expect(filteredClients[0].nombre).toBe('Cliente 1');
  });

  it('should call eliminarCliente and remove client from list', () => {
    spyOn(component, 'getClientes').and.callThrough(); // Ensure `getClientes` is still called in `eliminarCliente`
    component.eliminarCliente(1);
    expect(clienteService.eliminarCliente).toHaveBeenCalledWith(1);
    expect(component.clientes.length).toBe(1); // After deletion, there should be 1 client left
    expect(component.clientes[0].id).toBe(2); // The remaining client should be the one with id 2
  });
});
