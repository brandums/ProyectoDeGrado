//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { of, BehaviorSubject } from 'rxjs';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CreateCaseComponent } from './create-case.component';
//import { CasoService } from '../services/caso-service';
//import { UbicacionService } from '../services/ubicacion-service';
//import { TipoCasoService } from '../services/tipoCaso-service';
//import { EstadoService } from '../services/estado-service';
//import { JuzgadoService } from '../services/juzgado-service';
//import { ClienteService } from '../services/cliente-service';
//import { Caso } from '../Models/Caso';
//import { Estado } from '../Models/Estado';
//import { TipoCaso } from '../Models/TipoCaso';
//import { Cliente } from '../Models/Cliente';
//import { Juzgado } from '../Models/Juzgado';
//import { Ubicacion } from '../Models/Ubicacion';

//describe('CreateCaseComponent', () => {
//  let component: CreateCaseComponent;
//  let fixture: ComponentFixture<CreateCaseComponent>;
//  let casoService: jasmine.SpyObj<CasoService>;
//  let ubicacionService: jasmine.SpyObj<UbicacionService>;
//  let tipoCasoService: jasmine.SpyObj<TipoCasoService>;
//  let estadoService: jasmine.SpyObj<EstadoService>;
//  let juzgadoService: jasmine.SpyObj<JuzgadoService>;
//  let clienteService: jasmine.SpyObj<ClienteService>;

//  beforeEach(async () => {
//    const casoServiceSpy = jasmine.createSpyObj('CasoService', ['crearCaso', 'actualizarCaso', 'getCaso', 'nuevoCaso']);
//    const ubicacionServiceSpy = jasmine.createSpyObj('UbicacionService', ['crearUbicacion', 'actualizarUbicacion']);
//    const tipoCasoServiceSpy = jasmine.createSpyObj('TipoCasoService', ['getTipoDeCasos']);
//    const estadoServiceSpy = jasmine.createSpyObj('EstadoService', ['getEstados']);
//    const juzgadoServiceSpy = jasmine.createSpyObj('JuzgadoService', ['crearJuzgado', 'actualizarJuzgado']);
//    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);

//    // Simular el BehaviorSubject en lugar de Observable para $casoId
//    const casoIdSubject = new BehaviorSubject<number>(1);
//    casoServiceSpy.$casoId = casoIdSubject.asObservable();

//    // Mock responses
//    tipoCasoServiceSpy.getTipoDeCasos.and.returnValue(of([{ id: 1, nombre: 'Tipo Caso 1' }] as TipoCaso[]));
//    estadoServiceSpy.getEstados.and.returnValue(of([{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }] as Estado[]));
//    clienteServiceSpy.getClientes.and.returnValue(of([{ id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1' }] as Cliente[]));

//    // Mock responses for update and create methods
//    ubicacionServiceSpy.crearUbicacion.and.returnValue(of({ id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion));
//    ubicacionServiceSpy.actualizarUbicacion.and.returnValue(of({}));
//    juzgadoServiceSpy.crearJuzgado.and.returnValue(of({ id: 1, nombre: 'Juzgado de prueba' } as Juzgado));
//    juzgadoServiceSpy.actualizarJuzgado.and.returnValue(of({}));
//    casoServiceSpy.crearCaso.and.returnValue(of({ id: 1 } as Caso));
//    casoServiceSpy.actualizarCaso.and.returnValue(of({}));

//    await TestBed.configureTestingModule({
//      imports: [FormsModule, ReactiveFormsModule],
//      declarations: [CreateCaseComponent],
//      providers: [
//        { provide: CasoService, useValue: casoServiceSpy },
//        { provide: UbicacionService, useValue: ubicacionServiceSpy },
//        { provide: TipoCasoService, useValue: tipoCasoServiceSpy },
//        { provide: EstadoService, useValue: estadoServiceSpy },
//        { provide: JuzgadoService, useValue: juzgadoServiceSpy },
//        { provide: ClienteService, useValue: clienteServiceSpy }
//      ]
//    }).compileComponents();

//    casoService = TestBed.inject(CasoService) as jasmine.SpyObj<CasoService>;
//    ubicacionService = TestBed.inject(UbicacionService) as jasmine.SpyObj<UbicacionService>;
//    tipoCasoService = TestBed.inject(TipoCasoService) as jasmine.SpyObj<TipoCasoService>;
//    estadoService = TestBed.inject(EstadoService) as jasmine.SpyObj<EstadoService>;
//    juzgadoService = TestBed.inject(JuzgadoService) as jasmine.SpyObj<JuzgadoService>;
//    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

//    fixture = TestBed.createComponent(CreateCaseComponent);
//    component = fixture.componentInstance;
//    fixture.detectChanges();
//  });

//  it('should initialize form and fetch data on init', () => {
//    const casoId = 1;
//    const casoMock: Caso = {
//      id: casoId,
//      tipoCasoId: '1',
//      tipoCaso: { id: 1, nombre: 'Tipo Caso 1' } as TipoCaso,
//      juzgadoId: 1,
//      juzgado: { id: 1, nombre: 'Juzgado de prueba', numeroExpediente: 12336354 } as Juzgado,
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      descripcion: 'Descripción de prueba',
//      fechaInicio: '2024-07-01',
//      fechaTermino: '2024-07-31',
//      estadoId: '1',
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1' } as Cliente
//    };

//    casoService.getCaso.and.returnValue(of(casoMock));

//    component.casoId = casoId;
//    component.ngOnInit();

//    expect(tipoCasoService.getTipoDeCasos).toHaveBeenCalled();
//    expect(estadoService.getEstados).toHaveBeenCalled();
//    expect(clienteService.getClientes).toHaveBeenCalled();
//    expect(casoService.getCaso).toHaveBeenCalledWith(casoId);
//    expect(component.tiposCaso.length).toBe(1);
//    expect(component.estados.length).toBe(2);
//    expect(component.clientes.length).toBe(1);
//    expect(component.caso).toEqual(casoMock);
//  });

//  it('should create a new case', () => {
//    const casoMock: Caso = {
//      id: 0,
//      tipoCasoId: '1',
//      tipoCaso: { id: 1, nombre: 'Tipo Caso 1' } as TipoCaso,
//      juzgadoId: 1,
//      juzgado: { id: 1, nombre: 'Juzgado de prueba', numeroExpediente: 42143524 } as Juzgado,
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      descripcion: 'Descripción de prueba',
//      fechaInicio: '2024-07-01',
//      fechaTermino: '2024-07-31',
//      estadoId: '1',
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1' } as Cliente
//    };

//    ubicacionService.crearUbicacion.and.returnValue(of(casoMock.ubicacion));
//    juzgadoService.crearJuzgado.and.returnValue(of(casoMock.juzgado));
//    casoService.crearCaso.and.returnValue(of(casoMock));

//    component.caso = casoMock;
//    component.crearCaso();

//    expect(ubicacionService.crearUbicacion).toHaveBeenCalledWith(casoMock.ubicacion);
//    expect(juzgadoService.crearJuzgado).toHaveBeenCalledWith(casoMock.juzgado);
//    expect(casoService.crearCaso).toHaveBeenCalledWith(casoMock);
//    expect(component.creandoCaso).toBeFalse();
//  });

//  it('should update an existing case', () => {
//    const casoMock: Caso = {
//      id: 1,
//      tipoCasoId: '1',
//      tipoCaso: { id: 1, nombre: 'Tipo Caso 1' } as TipoCaso,
//      juzgadoId: 1,
//      juzgado: { id: 1, nombre: 'Juzgado de prueba', numeroExpediente: 12344352 } as Juzgado,
//      ubicacionId: 1,
//      ubicacion: { id: 1, direccion: 'Direccion de prueba', estado: 'Estado de prueba', ciudad: 'Ciudad de prueba', codigoPostal: '12345' } as Ubicacion,
//      descripcion: 'Descripción de prueba',
//      fechaInicio: '2024-07-01',
//      fechaTermino: '2024-07-31',
//      estadoId: '1',
//      estado: { id: 1, nombre: 'Activo' } as Estado,
//      clienteId: '1',
//      cliente: { id: 1, nombre: 'Cliente 1', apellido: 'Apellido 1' } as Cliente
//    };

//    casoService.actualizarCaso.and.returnValue(of(casoMock));
//    ubicacionService.actualizarUbicacion.and.returnValue(of({}));
//    juzgadoService.actualizarJuzgado.and.returnValue(of({}));

//    component.caso = casoMock;
//    component.casoId = 1;
//    component.actualizarCaso();

//    expect(ubicacionService.actualizarUbicacion).toHaveBeenCalledWith(casoMock.ubicacionId, casoMock.ubicacion);
//    expect(juzgadoService.actualizarJuzgado).toHaveBeenCalledWith(casoMock.juzgadoId, casoMock.juzgado);
//    expect(casoService.actualizarCaso).toHaveBeenCalledWith(1, casoMock);
//    expect(component.creandoCaso).toBeFalse();
//  });

//  it('should limit postal code to 5 characters', () => {
//    // Crear un elemento de entrada simulado
//    const input = document.createElement('input');
//    input.value = '123456';

//    // Crear un objeto de evento simulado
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

//    // Llamar al método del componente
//    component.limitarCodigoPostal(event);

//    // Verificar el resultado
//    expect(input.value).toBe('12345');
//  });


//  it('should limit expediente number to 8 digits', () => {
//    // Crear un elemento de entrada simulado
//    const input = document.createElement('input');
//    input.value = '12345678'; // Valor inicial que debería ser truncado

//    // Crear un objeto de evento simulado
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

//    // Llamar al método del componente
//    component.limitarNumeroExpediente(event);

//    // Verificar el resultado
//    expect(input.value).toBe('12345678');
//  });


//  it('should not prevent default input for valid characters', () => {
//    // Crear un evento de teclado simulando el entorno
//    const event = new KeyboardEvent('keydown', {
//      key: 'a'
//    }) as KeyboardEvent;

//    spyOn(event, 'preventDefault');

//    component.validarTexto(event);

//    expect(event.preventDefault).not.toHaveBeenCalled();
//  });

//  it('should prevent default input for invalid characters', () => {
//    // Crear un evento de teclado simulando el entorno
//    const event = new KeyboardEvent('keydown', {
//      key: '!'
//    }) as KeyboardEvent;

//    spyOn(event, 'preventDefault');

//    component.validarTexto(event);

//    expect(event.preventDefault).toHaveBeenCalled();
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
