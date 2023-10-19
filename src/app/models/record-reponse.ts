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
