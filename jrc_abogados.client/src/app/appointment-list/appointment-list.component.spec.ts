import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentListComponent } from './appointment-list.component';
import { CitaService } from '../services/cita-service';
import { of, BehaviorSubject } from 'rxjs';
import { Cita } from '../Models/Cita';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let citaService: jasmine.SpyObj<CitaService>;
  let listaCitasSubject: BehaviorSubject<Cita[]>;

  beforeEach(async () => {
    listaCitasSubject = new BehaviorSubject<Cita[]>([]);

    const spy = jasmine.createSpyObj('CitaService', ['getCitas', 'eliminarCita', 'seleccionarCita']);
    spy.$listaCitas = listaCitasSubject.asObservable();

    await TestBed.configureTestingModule({
      declarations: [AppointmentListComponent],
      imports: [FormsModule],
      providers: [
        { provide: CitaService, useValue: spy }
      ]
    })
      .compileComponents();

    citaService = TestBed.inject(CitaService) as jasmine.SpyObj<CitaService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;

    // Simulación de datos de prueba
    const mockCitas: Cita[] = [
      { id: 1, tipoCita: 'Consulta', fechaInicio: '2023-07-17', hora: '10:00', ubicacionId: 1, ubicacion: { id: 1, direccion: 'Calle 1', estado: 'estado 1', ciudad: 'Ciudad 1', codigoPostal: '12345' }, estadoId: 1, estado: { id: 1, nombre: 'Pendiente' }, notas: 'Nota 1', clienteId: '1', cliente: { id: 1, nombre: 'Juan', apellido: 'Perez' } },
      { id: 2, tipoCita: 'Revisión', fechaInicio: '2023-07-18', hora: '11:00', ubicacionId: 2, ubicacion: { id: 2, direccion: 'Calle 2', estado: 'estado 2', ciudad: 'Ciudad 2', codigoPostal: '67890' }, estadoId: 2, estado: { id: 2, nombre: 'Realizada' }, notas: 'Nota 2', clienteId: '2', cliente: { id: 2, nombre: 'Ana', apellido: 'Garcia' } }
    ];
    
    listaCitasSubject.next(mockCitas);

    citaService.getCitas.and.returnValue(of(mockCitas));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load citas on initialization', () => {
    expect(component.citas.length).toBe(2);
  });

  it('should filter citas based on buscarPalabra', () => {
    component.buscarPalabra = 'Juan';
    fixture.detectChanges();
    const filteredCitas = component.filtroCitas;
    expect(filteredCitas.length).toBe(1);
    expect(filteredCitas[0].cliente.nombre).toBe('Juan');
  });

  it('should call seleccionarCita when Nueva Cita button is clicked', () => {
    spyOn(component, 'seleccionarCita');
    const button = fixture.debugElement.query(By.css('.btn-crear'));
    button.triggerEventHandler('click', null);
    expect(component.seleccionarCita).toHaveBeenCalledWith(0);
  });

  it('should call eliminarCita when Eliminar button is clicked', () => {
    spyOn(component, 'eliminarCita').and.callThrough();
    const button = fixture.debugElement.query(By.css('.btn-eliminar'));
    button.triggerEventHandler('click', null);
    expect(component.eliminarCita).toHaveBeenCalledWith(1);
  });

  it('should call citaService.eliminarCita when eliminarCita is called', () => {
    citaService.eliminarCita.and.returnValue(of(null));
    component.eliminarCita(1);
    expect(citaService.eliminarCita).toHaveBeenCalledWith(1);
    expect(component.citas.length).toBe(1);
  });
});
