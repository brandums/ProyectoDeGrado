import { Ubicacion } from "./Ubicacion";

export class Cliente {
  id: number = 0;
  nombre: string = "";
  apellido: string = "";
  fechaNacimiento: any = "";
  telefono = "";
  correoElectronico: string = "";
  ubicacionId: number = 0;
  ubicacion: Ubicacion = new Ubicacion;
  [key: string]: any;
}
