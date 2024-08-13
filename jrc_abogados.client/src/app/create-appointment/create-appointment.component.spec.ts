//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { of, BehaviorSubject } from 'rxjs';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CreateAppointmentComponent } from './create-appointment.component';
//import { CitaService } from '../services/cita-service';
//import { UbicacionService } from '../services/ubicacion-service';
//import { EstadoService } from '../services/estado-service';
//import { ClienteService } from '../services/cliente-service';
//import { Cita } from '../Models/Cita';
//import { Estado } from '../Models/Estado';
//import { Ubicacion } from '../Models/Ubicacion';
//import { Cliente } from '../Models/Cliente';

//describe('CreateAppointmentComponent', () => {
//  let component: CreateAppointmentComponent;
//  let fixture: ComponentFixture<CreateAppointmentComponent>;
//  let citaService: jasmine.SpyObj<CitaService>;
//  let ubicacionService: jasmine.SpyObj<UbicacionService>;
//  let estadoService: jasmine.SpyObj<EstadoService>;
//  let clienteService: jasmine.SpyObj<ClienteService>;

//  beforeEach(async () => {
//    const citaServiceSpy = jasmine.createSpyObj('CitaService', ['crearCita', 'actualizarCita', 'getCita', 'nuevaCita']);
//    const ubicacionServiceSpy = jasmine.createSpyObj('UbicacionService', ['crearUbicacion', 'actualizarUbicacion']);
//    const estadoServiceSpy = jasmine.createSpyObj('EstadoService', ['getEstados']);
//    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);

//    // Simular el BehaviorSubject en lugar de Observable para $citaId
//    const citaIdSubject = new BehaviorSubject<number>(1);
//    citaServiceSpy.$citaId = citaIdSubject.asObservable();

//    // Mock responses
//    estadoServiceSpy.getEstados.and.returnValue(of([{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }] as Estado[]));
//    clienteServiceSpy.getClientes.and.returnValue(of([{ id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1' }] as Cliente[]));

//    // Mock responses for update and create methods
//    ubicacionServiceSpy.crearUbicacion.and.returnValue(of({ id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion));
//    ubicacionServiceSpy.actualizarUbicacion.and.returnValue(of({}));
//    citaServiceSpy.actualizarCita.and.returnValue(of({}));

//    await TestBed.configureTestingModule({
//      imports: [FormsModule, ReactiveFormsModule],
//      declarations: [CreateAppointmentComponent],
//      providers: [
//        { provide: CitaService, useValue: citaServiceSpy },
//        { provide: UbicacionService, useValue: ubicacionServiceSpy },
//        { provide: EstadoService, useValue: estadoServiceSpy },
//        { provide: ClienteService, useValue: clienteServiceSpy }
//      ]
//    }).compileComponents();

//    citaService = TestBed.inject(CitaService) as jasmine.SpyObj<CitaService>;
//    ubicacionService = TestBed.inject(UbicacionService) as jasmine.SpyObj<UbicacionService>;
//    estadoService = TestBed.inject(EstadoService) as jasmine.SpyObj<EstadoService>;
//    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

//    fixture = TestBed.createComponent(CreateAppointmentComponent);
//    component = fixture.componentInstance;
//    fixture.detectChanges();
//  });

//  it('should initialize form and fetch data on init', () => {
//    const citaId = 1;
//    const citaMock: Cita = {
//      id: citaId,
//      tipoCita: 'Tipo 1',
//      fechaInicio: '2024-07-01',
//      hora: '10:00',
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      estadoId: 1,
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      notas: 'Notas de prueba',
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1', fechaNacimiento: '2000-01-01', telefono: '1234567890', correoElectronico: 'cliente1@example.com', ubicacionId: 1 } as Cliente
//    };

//    citaService.getCita.and.returnValue(of(citaMock));

//    component.citaId = citaId;
//    component.ngOnInit();

//    expect(estadoService.getEstados).toHaveBeenCalled();
//    expect(clienteService.getClientes).toHaveBeenCalled();
//    expect(citaService.getCita).toHaveBeenCalledWith(citaId);
//    expect(component.estados.length).toBe(2);
//    expect(component.clientes.length).toBe(1);
//    expect(component.cita).toEqual(citaMock);
//  });

//  it('should create a new appointment', () => {
//    const citaMock: Cita = {
//      id: 0,
//      tipoCita: 'Tipo 1',
//      fechaInicio: '2024-07-01',
//      hora: '10:00',
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      estadoId: 1,
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      notas: 'Notas de prueba',
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1', fechaNacimiento: '2000-01-01', telefono: '1234567890', correoElectronico: 'cliente1@example.com', ubicacionId: 1 } as Cliente
//    };

//    ubicacionService.crearUbicacion.and.returnValue(of(citaMock.ubicacion));
//    citaService.crearCita.and.returnValue(of(citaMock));

//    component.cita = citaMock;
//    component.crearCita();

//    expect(ubicacionService.crearUbicacion).toHaveBeenCalledWith(citaMock.ubicacion);
//    expect(citaService.crearCita).toHaveBeenCalledWith(citaMock);
//    expect(component.creandoCita).toBeFalse();
//  });

//  it('should update an existing appointment', () => {
//    const citaMock: Cita = {
//      id: 1,
//      tipoCita: 'Tipo 1',
//      fechaInicio: '2024-07-01',
//      hora: '10:00',
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      estadoId: 1,
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      notas: 'Notas de prueba',
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1', fechaNacimiento: '2000-01-01', telefono: '1234567890', correoElectronico: 'cliente1@example.com', ubicacionId: 1 } as Cliente
//    };

//    citaService.actualizarCita.and.returnValue(of(citaMock));
//    ubicacionService.actualizarUbicacion.and.returnValue(of({}));

//    component.cita = citaMock;
//    component.citaId = 1;
//    component.actualizarCita();

//    expect(ubicacionService.actualizarUbicacion).toHaveBeenCalledWith(citaMock.ubicacionId, citaMock.ubicacion);
//    expect(citaService.actualizarCita).toHaveBeenCalledWith(1, citaMock);
//    expect(component.creandoCita).toBeFalse();
//  });

//  // Test for FechaMinima
//  it('should return the current date in ISO format as minimum date', () => {
//    const fechaMinima = component.FechaMinima();
//    const fechaActual = new Date().toISOString().split('T')[0];
//    expect(fechaMinima).toBe(fechaActual);
//  });

//  // Test for limitarCodigoPostal
//  it('should limit postal code to numeric characters only', () => {
//    const input = document.createElement('input');
//    input.value = '12345abc';

//    const event = {
//      target: input,
//      bubbles: false,
//      cancelBubble: false,
//      cancelable: true,
//      composed: false,
//      currentTarget: null,
//      defaultPrevented: false,
//      eventPhase: 0,
//      isTrusted: true,
//      returnValue: true,
//      srcElement: null,
//      timeStamp: Date.now(),
//      type: 'input',
//      preventDefault: () => { },
//      stopImmediatePropagation: () => { },
//      stopPropagation: () => { }
//    } as unknown as Event;

//    component.limitarCodigoPostal(event);

//    expect(input.value).toBe('12345');
//  });

//  // Test for validarTexto
//  it('should prevent input of non-alphabetic characters', () => {
//    const event = new KeyboardEvent('keypress', { key: '1' });
//    spyOn(event, 'preventDefault');
//    component.validarTexto(event);
//    expect(event.preventDefault).toHaveBeenCalled();
//  });

//  it('should allow input of alphabetic characters', () => {
//    const event = new KeyboardEvent('keypress', { key: 'a' });
//    spyOn(event, 'preventDefault');
//    component.validarTexto(event);
//    expect(event.preventDefault).not.toHaveBeenCalled();
//  });

//  it('should initialize form validators and handle form submission', () => {
//    // Crear un formulario y añadir clases necesarias
//    const form = document.createElement('form');
//    form.classList.add('needs-validation');
//    form.noValidate = true; // Deshabilitar la validación nativa del navegador

//    // Añadir un campo de entrada que sea requerido para que el formulario no sea válido
//    const input = document.createElement('input');
//    input.type = 'text';
//    input.required = true; // Este campo es obligatorio
//    form.appendChild(input);

//    // Añadir el formulario al DOM del documento
//    document.body.appendChild(form);

//    // Establecer citaId y llamar a iniciarValidadores
//    component.citaId = 0;
//    component.iniciarValidadores();

//    // Disparar el evento submit en el formulario
//    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

//    // Asegurarse de que formValidado sea falso porque el formulario no es válido
//    expect(component.formValidado).toBeFalse();

//    // Eliminar el formulario del DOM
//    document.body.removeChild(form);
//  });


//  it('should close the form', () => {
//    const button = document.createElement('button');
//    button.id = 'bClose';
//    spyOn(document, 'getElementById').and.returnValue(button);
//    spyOn(button, 'click');
//    component.cerrarForm();
//    expect(button.click).toHaveBeenCalled();
//  });
//});
