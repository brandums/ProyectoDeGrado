//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { of, BehaviorSubject } from 'rxjs';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CreateClientComponent } from './create-client.component';
//import { ClienteService } from '../services/cliente-service';
//import { UbicacionService } from '../services/ubicacion-service';
//import { Cliente } from '../Models/Cliente';
//import { Ubicacion } from '../Models/Ubicacion';

//describe('CreateClientComponent', () => {
//  let component: CreateClientComponent;
//  let fixture: ComponentFixture<CreateClientComponent>;
//  let clienteService: jasmine.SpyObj<ClienteService>;
//  let ubicacionService: jasmine.SpyObj<UbicacionService>;

//  beforeEach(async () => {
//    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
//      'crearCliente',
//      'actualizarCliente',
//      'getCliente',
//      'nuevoCliente',
//      '$clienteId'
//    ]);

//    const ubicacionServiceSpy = jasmine.createSpyObj('UbicacionService', [
//      'crearUbicacion',
//      'actualizarUbicacion'
//    ]);

//    // Simular el BehaviorSubject en lugar de Observable para $clienteId
//    const clienteIdSubject = new BehaviorSubject<number>(0);
//    clienteServiceSpy.$clienteId = clienteIdSubject.asObservable();

//    // Mock responses
//    clienteServiceSpy.getCliente.and.returnValue(of({
//      id: 1,
//      nombre: 'Cliente Test',
//      apellido: 'Apellido Test',
//      telefono: '12432312',
//      fechaNacimiento: '2000-01-01',
//      correoElectronico: 'test@example.com',
//      ubicacionId: 1,
//      ubicacion: {
//        id: 1,
//        direccion: 'Direccion Test',
//        estado: 'Estado Test',
//        ciudad: 'Ciudad Test',
//        codigoPostal: '12345'
//      } as Ubicacion
//    } as Cliente));

//    clienteServiceSpy.crearCliente.and.returnValue(of({}));
//    clienteServiceSpy.actualizarCliente.and.returnValue(of({}));
//    clienteServiceSpy.nuevoCliente.and.returnValue(of({}));

//    ubicacionServiceSpy.crearUbicacion.and.returnValue(of({
//      id: 1,
//      direccion: 'Direccion Test',
//      estado: 'Estado Test',
//      ciudad: 'Ciudad Test',
//      codigoPostal: '12345'
//    } as Ubicacion));

//    ubicacionServiceSpy.actualizarUbicacion.and.returnValue(of({
//      id: 1,
//      direccion: 'Direccion Test',
//      estado: 'Estado Test',
//      ciudad: 'Ciudad Test',
//      codigoPostal: '12345'
//    } as Ubicacion));

//    await TestBed.configureTestingModule({
//      imports: [FormsModule, ReactiveFormsModule],
//      declarations: [CreateClientComponent],
//      providers: [
//        { provide: ClienteService, useValue: clienteServiceSpy },
//        { provide: UbicacionService, useValue: ubicacionServiceSpy }
//      ]
//    }).compileComponents();

//    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
//    ubicacionService = TestBed.inject(UbicacionService) as jasmine.SpyObj<UbicacionService>;

//    fixture = TestBed.createComponent(CreateClientComponent);
//    component = fixture.componentInstance;
//    fixture.detectChanges();
//  });

//  it('should create', () => {
//    expect(component).toBeTruthy();
//  });

//  it('should set fecha mínima correctamente', () => {
//    const fechaMinima = component.FechaMinima();
//    const expectedFechaMinima = new Date();
//    expectedFechaMinima.setFullYear(expectedFechaMinima.getFullYear() - 95);
//    const expectedFormatoFecha = expectedFechaMinima.toISOString().split('T')[0];
//    expect(fechaMinima).toBe(expectedFormatoFecha);
//  });

//  it('should set fecha máxima correctamente', () => {
//    const fechaMaxima = component.FechaMaxima();
//    const expectedFechaMaxima = new Date();
//    expectedFechaMaxima.setFullYear(expectedFechaMaxima.getFullYear() - 18);
//    const expectedFormatoFecha = expectedFechaMaxima.toISOString().split('T')[0];
//    expect(fechaMaxima).toBe(expectedFormatoFecha);
//  });

//  it('should sanitize input value for limitarNumero', () => {
//    const event = { target: { value: '123abc456' } } as any;
//    component.limitarNumero(event);
//    expect(event.target.value).toBe('123456');
//  });

//  it('should sanitize input value for limitarCodigoPostal', () => {
//    const event = { target: { value: '123abc456' } } as any;
//    component.limitarCodigoPostal(event);
//    expect(event.target.value).toBe('123456');
//  });

//  it('should prevent non-alphabetic input for validarTexto', () => {
//    const event = { key: '1', preventDefault: jasmine.createSpy() } as any;
//    component.validarTexto(event);
//    expect(event.preventDefault).toHaveBeenCalled();
//  });

//  it('should correctly concatenate email parts in unirEmail', () => {
//    component.nickEmail = 'test';
//    component.extencionEmail = 'gmail';
//    component.extencionEmail2 = 'com';
//    component.unirEmail();
//    expect(component.cliente.correoElectronico).toBe('test@gmail.com');
//  });

//  it('should initialize validators on iniciarValidadores', () => {
//    const spy = spyOn(document, 'querySelectorAll').and.returnValue([{
//      addEventListener: jasmine.createSpy('addEventListener')
//    }] as any);
//    component.iniciarValidadores();
//    expect(spy).toHaveBeenCalledWith('.needs-validation');
//  });

//  it('should create a new client with crearCliente', () => {
//    // Configurar el cliente en el componente
//    component.cliente = {
//      id: 0,
//      nombre: 'Test',
//      apellido: 'Cliente',
//      telefono: '123456789',
//      fechaNacimiento: '2000-01-01',
//      correoElectronico: '@gmail.com',
//      ubicacionId: 1,
//      ubicacion: {
//        id: 1,
//        direccion: 'Direccion Test',
//        estado: 'Estado Test',
//        ciudad: 'Ciudad Test',
//        codigoPostal: '12345'
//      }
//    } as Cliente;

//    // Llamar al método
//    component.crearCliente();

//    // Verificar que el cliente ha sido creado con los valores correctos
//    expect(clienteService.crearCliente).toHaveBeenCalledWith(jasmine.objectContaining({
//      nombre: 'Test',
//      apellido: 'Cliente',
//      telefono: '123456789',
//      fechaNacimiento: '2000-01-01',
//      correoElectronico: '@gmail.com',
//      ubicacionId: 1,
//      ubicacion: jasmine.objectContaining({
//        direccion: 'Direccion Test',
//        estado: 'Estado Test',
//        ciudad: 'Ciudad Test',
//        codigoPostal: '12345'
//      })
//    }));
//  });



//  it('should update an existing client with actualizarCliente', () => {
//    // Configurar el cliente en el componente
//    component.clienteId = 1;
//    component.cliente = {
//      id: 1,
//      nombre: 'Test',
//      apellido: 'Cliente',
//      telefono: '123456789',
//      fechaNacimiento: '2000-01-01',
//      correoElectronico: '@gmail.com',
//      ubicacionId: 1,
//      ubicacion: {
//        id: 1,
//        direccion: 'Direccion Test',
//        estado: 'Estado Test',
//        ciudad: 'Ciudad Test',
//        codigoPostal: '12345'
//      }
//    } as Cliente;

//    // Llamar al método
//    component.actualizarCliente();

//    // Verificar que el cliente ha sido actualizado con los valores correctos
//    expect(clienteService.actualizarCliente).toHaveBeenCalledWith(component.clienteId, jasmine.objectContaining({
//      nombre: 'Test',
//      apellido: 'Cliente',
//      telefono: '123456789',
//      fechaNacimiento: '2000-01-01',
//      correoElectronico: '@gmail.com',
//      ubicacionId: 1,
//      ubicacion: jasmine.objectContaining({
//        direccion: 'Direccion Test',
//        estado: 'Estado Test',
//        ciudad: 'Ciudad Test',
//        codigoPostal: '12345'
//      })
//    }));
//  });

//  it('should close the form', () => {
//    const button = document.createElement('button');
//    button.id = 'bClose';
//    spyOn(document, 'getElementById').and.returnValue(button);
//    spyOn(button, 'click');
//    component.cerrarForm();
//    expect(button.click).toHaveBeenCalled();
//  });


//  it('should reset the form with limpiarForm', () => {
//    component.nickEmail = 'test';
//    component.cliente = new Cliente();
//    component.tituloForm = 'Actualizar Cliente';
//    component.formValidado = true;
//    const forms = document.querySelectorAll('.needs-validation');
//    spyOn(document, 'querySelectorAll').and.returnValue([{
//      classList: {
//        remove: jasmine.createSpy('remove')
//      }
//    }] as any);
//    component.limpiarForm();
//    expect(component.nickEmail).toBe('');
//    expect(component.cliente).toEqual(new Cliente());
//    expect(component.tituloForm).toBe('Crear nuevo Cliente');
//    expect(component.formValidado).toBe(false);
//  });
//});
