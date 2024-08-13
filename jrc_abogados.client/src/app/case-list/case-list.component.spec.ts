import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { CaseListComponent } from './case-list.component';
import { CasoService } from '../services/caso-service';
import { Caso } from '../Models/Caso';

describe('CaseListComponent', () => {
  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;
  let casoService: jasmine.SpyObj<CasoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CasoService', ['getCasos', 'eliminarCaso', '$listaCasos', 'seleccionarCaso']);
    await TestBed.configureTestingModule({
      declarations: [CaseListComponent],
      providers: [
        { provide: CasoService, useValue: spy }
      ]
    })
      .compileComponents();

    casoService = TestBed.inject(CasoService) as jasmine.SpyObj<CasoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseListComponent);
    component = fixture.componentInstance;

    const casosMock: Caso[] = [
      {
        id: 1,
        tipoCasoId: "1",
        tipoCaso: { id: 1, nombre: "Tipo 1" },
        juzgadoId: 1,
        juzgado: { id: 1, nombre: "Juzgado 1", numeroExpediente: 75462354 },
        ubicacionId: 1,
        ubicacion: { id: 1, direccion: 'Calle 2', estado: 'estado 2', ciudad: 'Ciudad 2', codigoPostal: '22345' },
        descripcion: "Caso 1",
        fechaInicio: "2024-01-01",
        fechaTermino: "2024-02-01",
        estadoId: "1",
        estado: { id: 1, nombre: "Estado 1" },
        clienteId: "1",
        cliente: { nombre: "Cliente 1", apellido: "Apellido 1" }
      },
      {
        id: 2,
        tipoCasoId: "2",
        tipoCaso: { id: 2, nombre: "Tipo 2" },
        juzgadoId: 2,
        juzgado: { id: 2, nombre: "Juzgado 2", numeroExpediente: 14236354 },
        ubicacionId: 2,
        ubicacion: { id: 1, direccion: 'Calle 1', estado: 'estado 1', ciudad: 'Ciudad 1', codigoPostal: '12345' },
        descripcion: "Caso 2",
        fechaInicio: "2024-03-01",
        fechaTermino: "2024-04-01",
        estadoId: "2",
        estado: { id: 2, nombre: "Estado 2" },
        clienteId: "2",
        cliente: { nombre: "Cliente 2", apellido: "Apellido 2" }
      }
    ];

    const listaCasosSubject = new BehaviorSubject<Caso[]>(casosMock);
    casoService.getCasos.and.returnValue(of(casosMock));
    casoService.$listaCasos = listaCasosSubject;
    casoService.eliminarCaso.and.returnValue(of({}));
    casoService.seleccionarCaso.and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cases on init', () => {
    component.ngOnInit();
    expect(casoService.getCasos).toHaveBeenCalled();
    expect(component.casos.length).toBe(2);
  });

  it('should filter cases by client name and surname', () => {
    component.buscarPalabra = 'Cliente 1';
    fixture.detectChanges();
    const filteredCases = component.filtroCasos;
    expect(filteredCases.length).toBe(1);
    expect(filteredCases[0].cliente.nombre).toBe('Cliente 1');
  });

  it('should call eliminarCaso and remove case from list', () => {
    spyOn(component, 'getCasos').and.callThrough(); // Ensure `getCasos` is still called in `eliminarCaso`
    component.eliminarCaso(1);
    expect(casoService.eliminarCaso).toHaveBeenCalledWith(1);
    expect(component.casos.length).toBe(1); // After deletion, there should be 1 case left
    expect(component.casos[0].id).toBe(2); // The remaining case should be the one with id 2
  });
});
