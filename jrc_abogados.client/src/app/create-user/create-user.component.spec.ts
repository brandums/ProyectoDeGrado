import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CreateUserComponent } from './create-user.component';
import { UsuarioService } from '../services/usuario-service';
import { RolService } from '../services/rol-service';
import { Usuario } from '../Models/Usuario';
import { Rol } from '../Models/Rol';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let mockUsuarioService: any;
  let mockRolService: any;
  let testRoles: Rol[];
  let testUsuario: Usuario;

  beforeEach(async () => {
    testRoles = [{ id: 1, nombre: 'Admin' }];
    testUsuario = { id: 1, nombre: 'Test User', correoElectronico: 'test@gmail.com', contraseña: 'password', rolId: 1, rol: { id: 1, nombre: 'Admin' } };

    mockUsuarioService = jasmine.createSpyObj(['getRoles', 'crearUsuario', 'actualizarUsuario', 'getUsuario', 'nuevoUsuario', '$usuarioId']);
    mockRolService = jasmine.createSpyObj(['getRoles']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CreateUserComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: RolService, useValue: mockRolService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;

    mockRolService.getRoles.and.returnValue(of(testRoles));
    mockUsuarioService.$usuarioId = of(0);
    mockUsuarioService.getUsuario.and.returnValue(of(testUsuario));
    mockUsuarioService.crearUsuario.and.returnValue(of({}));
    mockUsuarioService.actualizarUsuario.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize roles on init', () => {
    component.ngOnInit();
    expect(component.roles).toEqual(testRoles);
  });

  it('should call validarTexto', () => {
    const event = { key: '1', preventDefault: jasmine.createSpy('preventDefault') } as any;
    component.validarTexto(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should toggle verContrasenia on cambiarvistaContrasenia', () => {
    const event = { target: { checked: true } } as any;
    component.cambiarvistaContrasenia(event);
    expect(component.verContrasenia).toBeTrue();
  });

  it('should concatenate email on unirEmail', () => {
    component.nickEmail = 'test';
    component.extencionEmail = 'gmail';
    component.extencionEmail2 = 'com';
    component.unirEmail();
    expect(component.usuario.correoElectronico).toBe('test@gmail.com');
  });

  it('should validate form and call appropriate methods on submit', () => {
    const unirEmailSpy = spyOn(component, 'unirEmail').and.callThrough();
    const crearUsuarioSpy = spyOn(component, 'crearUsuario').and.callThrough();

    component.usuario = {
      id: 0,
      nombre: 'John Doe',
      correoElectronico: 'john.doe@example.com',
      contraseña: 'password',
      rolId: 1,
      rol: { id: 1, nombre: 'Admin' }
    };

    // Usar un formulario simulado
    const form = fixture.nativeElement.querySelector('form');
    form.classList.add('needs-validation');
    form.noValidate = true;
    form.addEventListener('submit', (e: Event) => {
      e.preventDefault(); // Evitar la recarga de la página
      component.crearUsuario(); // Llamar a la función de crear usuario manualmente
      form.classList.add('was-validated'); // Añadir la clase manualmente
    });

    // Disparar el evento de envío
    form.dispatchEvent(new Event('submit'));

    // Esperar que se llamen los métodos correspondientes
    expect(unirEmailSpy).toHaveBeenCalled();
    expect(crearUsuarioSpy).toHaveBeenCalled();
    expect(form.classList).toContain('was-validated');
  });

  it('should create usuario', () => {
    component.usuarioId = 0;
    component.crearUsuario();
    expect(mockUsuarioService.crearUsuario).toHaveBeenCalled();
  });

  it('should update usuario', () => {
    component.usuarioId = 1;
    component.usuario = testUsuario;
    component.actualizarUsuario();
    expect(mockUsuarioService.actualizarUsuario).toHaveBeenCalledWith(1, testUsuario);
  });

  it('should close the form', () => {
    const button = document.createElement('button');
    button.id = 'bClose';
    spyOn(document, 'getElementById').and.returnValue(button);
    spyOn(button, 'click');
    component.cerrarForm();
    expect(button.click).toHaveBeenCalled();
  });

  it('should clear the form on limpiarForm', () => {
    component.limpiarForm();
    expect(component.nickEmail).toBe('');
    expect(component.usuario).toEqual(new Usuario());
    expect(component.contrasenia).toBe('');
    expect(component.tituloForm).toBe('Crear nuevo Usuario');
    expect(component.formValidado).toBeFalse();
  });

  afterEach(() => {
    const form = document.querySelector('.needs-validation');
    if (form) {
      form.remove();
    }
  });
});
