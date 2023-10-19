export interface Horario {
  id?:        string;
  schedules: Schedule[];
  activo:    boolean;
  tocar:     boolean;
}

export interface Schedule {
  start_time: string;
  tipo:       string;
  sonara:     number;
}
