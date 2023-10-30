export interface Record {
  id?:         string;
  email:       string;
  lastname:    string;
  name:        string;
  schedules:   Schedule[];
  update_date: string;
}

export interface Schedule {
  sonara:     number;
  start_time: string;
  tipo:       string;
}
export interface Activation {
  dia:   string;
  fecha: string;
  hora:  string;
  id:    string;
}
