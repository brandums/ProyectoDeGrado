import { Estado } from "./Estado";
import { Ubicacion } from "./Ubicacion";

export class Cita {
  id: number = 0;
  tipoCita: string = "";
  fechaInicio: any = "";
  hora = "";
  ubicacionId: number = 0;
  ubicacion: Ubicacion = new Ubicacion;
  estadoId: any = "";
  estado: Estado = new Estado;
  notas: string = "";
  clienteId = "";
  cliente: any;
  [key: string]: any;
}
