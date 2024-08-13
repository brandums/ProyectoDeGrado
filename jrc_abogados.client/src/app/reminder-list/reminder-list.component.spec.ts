//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { ReminderListComponent } from './reminder-list.component';
//import { RecordatorioService } from '../services/recordatorio-service';
//import { of } from 'rxjs';
//import { Recordatorio } from '../Models/Recordatorio';

//describe('ReminderListComponent', () => {
//  let component: ReminderListComponent;
//  let fixture: ComponentFixture<ReminderListComponent>;
//  let recordatorioService: RecordatorioService;
//  let mockRecordatorios: Recordatorio[];

//  beforeEach(async () => {
//    mockRecordatorios = [
//      { id: 1, titulo: 'Recordatorio 1', descripcion: 'Descripción 1', fecha: '2023-07-22', hora: '10:00', clienteId: 1, cliente: {} },
//      { id: 2, titulo: 'Recordatorio 2', descripcion: 'Descripción 2', fecha: '2023-07-23', hora: '11:00', clienteId: 2, cliente: {} },
//      { id: 3, titulo: 'Recordatorio 3', descripcion: 'Descripción 3', fecha: '2023-07-24', hora: '12:00', clienteId: 3, cliente: {} },
//    ];

//    const recordatorioServiceMock = {
//      getRecordatorios: jasmine.createSpy('getRecordatorios').and.returnValue(of(mockRecordatorios)),
//      eliminarRecordatorio: jasmine.createSpy('eliminarRecordatorio').and.returnValue(of({})),
//      seleccionarRecordatorio: jasmine.createSpy('seleccionarRecordatorio'),
//      $listaRecordatorios: of(mockRecordatorios)
//    };

//    await TestBed.configureTestingModule({
//      declarations: [ReminderListComponent],
//      providers: [
//        { provide: RecordatorioService, useValue: recordatorioServiceMock }
//      ]
//    }).compileComponents();

//    fixture = TestBed.createComponent(ReminderListComponent);
//    component = fixture.componentInstance;
//    recordatorioService = TestBed.inject(RecordatorioService);
//    fixture.detectChanges();
//  });

//  it('should create', () => {
//    expect(component).toBeTruthy();
//  });

//  it('should initialize with recordatorios from the service', () => {
//    expect(component.recordatorios.length).toBe(3);
//    expect(component.recordatorios).toEqual(mockRecordatorios);
//  });

//  it('should filter recordatorios based on search term', () => {
//    component.buscarPalabra = '1';
//    const filtered = component.filtroRecordatorios;
//    expect(filtered.length).toBe(1);
//    expect(filtered[0].titulo).toContain('1');
//  });

//  it('should call seleccionarRecordatorio on the service when seleccionarRecordatorio is called', () => {
//    const id = 1;
//    component.seleccionarRecordatorio(id);
//    expect(recordatorioService.seleccionarRecordatorio).toHaveBeenCalledWith(id);
//  });

//  it('should get recordatorios on init', () => {
//    expect(recordatorioService.getRecordatorios).toHaveBeenCalled();
//    expect(component.recordatorios).toEqual(mockRecordatorios);
//  });

//  it('should remove recordatorio from list on eliminarRecordatorio', () => {
//    const id = 1;
//    component.eliminarRecordatorio(id);
//    expect(recordatorioService.eliminarRecordatorio).toHaveBeenCalledWith(id);
//    expect(component.recordatorios.length).toBe(2);
//    expect(component.recordatorios.find(recordatorio => recordatorio.id === id)).toBeUndefined();
//  });
//});
