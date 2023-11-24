export interface Record {
  id?:any;
  dia: string;
  estado: string;
  fecha: string;
  hora_apertura: string;
}
export interface DatosProcesados {
  dia: string;
  datos: Record[];
  contador: number;
}
