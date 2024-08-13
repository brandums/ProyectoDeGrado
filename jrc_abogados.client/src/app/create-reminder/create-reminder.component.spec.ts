import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateReminderComponent } from './create-reminder.component';
import { RecordatorioService } from '../services/recordatorio-service';
import { ClienteService } from '../services/cliente-service';
import { Recordatorio } from '../Models/Recordatorio';
import { Cliente } from '../Models/Cliente';

describe('CreateReminderComponent', () => {
  let component: CreateReminderComponent;
  let fixture: ComponentFixture<CreateReminderComponent>;
  let recordatorioService: jasmine.SpyObj<RecordatorioService>;
  let clienteService: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const recordatorioServiceSpy = jasmine.createSpyObj('RecordatorioService', [
      'crearRecordatorio',
      'actualizarRecordatorio',
      'getRecordatorio',
      'nuevoRecordatorio',
      '$recordatorioId'
    ]);

    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'getClientes'
    ]);

    // Simular el BehaviorSubject en lugar de Observable para $recordatorioId
    const recordatorioIdSubject = new BehaviorSubject<number>(0);
    recordatorioServiceSpy.$recordatorioId = recordatorioIdSubject.asObservable();

    // Mock responses
    clienteServiceSpy.getClientes.and.returnValue(of([
      { id: 1, nombre: 'Cliente Test' } as Cliente
    ]));

    recordatorioServiceSpy.getRecordatorio.and.returnValue(of({
      id: 1,
      titulo: 'Recordatorio Test',
      descripcion: 'Descripcion Test',
      fecha: '2024-07-21',
      hora: '10:00',
      clienteId: 1
    } as Recordatorio));

    recordatorioServiceSpy.crearRecordatorio.and.returnValue(of({}));
    recordatorioServiceSpy.actualizarRecordatorio.and.returnValue(of({}));
    recordatorioServiceSpy.nuevoRecordatorio.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CreateReminderComponent],
      providers: [
        { provide: RecordatorioService, useValue: recordatorioServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy }
      ]
    }).compileComponents();

    recordatorioService = TestBed.inject(RecordatorioService) as jasmine.SpyObj<RecordatorioService>;
    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

    fixture = TestBed.createComponent(CreateReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current date in obtenerFecha', () => {
    const fechaActual = component.obtenerFecha();
    const expectedFecha = new Date().toISOString().split('T')[0];
    expect(fechaActual).toBe(expectedFecha);
  });

  it('should prevent non-alphabetic input in validarTexto', () => {
    const event = { key: '1', preventDefault: jasmine.createSpy() } as any;
    component.validarTexto(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should initialize validators on iniciarValidadores', () => {
    const spy = spyOn(document, 'querySelectorAll').and.returnValue([{
      addEventListener: jasmine.createSpy('addEventListener')
    }] as any);
    component.iniciarValidadores();
    expect(spy).toHaveBeenCalledWith('.needs-validation');
  });

  it('should create a new reminder with crearRecordatorio', () => {
    component.recordatorio = {
      id: 0,
      titulo: 'Nuevo Recordatorio',
      descripcion: 'Descripcion',
      fecha: '2024-07-21',
      hora: '10:00',
      clienteId: 1
    } as Recordatorio;

    component.crearRecordatorio();

    expect(recordatorioService.crearRecordatorio).toHaveBeenCalledWith(jasmine.objectContaining({
      titulo: 'Nuevo Recordatorio',
      descripcion: 'Descripcion',
      fecha: '2024-07-21',
      hora: '10:00',
      clienteId: 1
    }));
  });

  it('should update an existing reminder with actualizarRecordatorio', () => {
    component.recordatorioId = 1;
    component.recordatorio = {
      id: 1,
      titulo: 'Recordatorio Actualizado',
      descripcion: 'Descripcion Actualizada',
      fecha: '2024-07-21',
      hora: '11:00',
      clienteId: 1
    } as Recordatorio;

    component.actualizarRecordatorio();

    expect(recordatorioService.actualizarRecordatorio).toHaveBeenCalledWith(1, jasmine.objectContaining({
      titulo: 'Recordatorio Actualizado',
      descripcion: 'Descripcion Actualizada',
      fecha: '2024-07-21',
      hora: '11:00',
      clienteId: 1
    }));
  });

  it('should close the form with cerrarForm', () => {
    const button = document.createElement('button');
    button.id = 'bClose';
    spyOn(document, 'getElementById').and.returnValue(button);
    spyOn(button, 'click');
    component.cerrarForm();
    expect(button.click).toHaveBeenCalled();
  });

  it('should reset the form with limpiarForm', () => {
    component.recordatorio = new Recordatorio();
    component.tituloForm = 'Actualizar Recordatorio';
    component.formValidado = true;
    const forms = document.querySelectorAll('.needs-validation');
    spyOn(document, 'querySelectorAll').and.returnValue([{
      classList: {
        remove: jasmine.createSpy('remove')
      }
    }] as any);
    component.limpiarForm();
    expect(component.recordatorio).toEqual(new Recordatorio());
    expect(component.tituloForm).toBe('Crear nuevo Recordatorio');
    expect(component.formValidado).toBe(false);
  });
});
