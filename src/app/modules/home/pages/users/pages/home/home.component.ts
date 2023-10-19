import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router} from '@angular/router';
import { ControllerService } from 'src/app/services/controllers/controller.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit  {

  public displayedColumns:string[]=[
    'name',
    'lastName',
    'email',
    'rol',
    'password',
    'Opciones'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _sUsers:UsersService,
    private router: Router,
    public _sctr: ControllerService,
    ){
      this._sctr.leerRole()
  }
  ngAfterViewInit(): void {
    this._sctr.dataSource.paginator = this.paginator;
    this._sctr.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._sctr.createForm();
    this._sctr.loadForm(this._sctr.usuario);
    this._sctr.leerToken();
    this.getUsers();
  }

  getUsers(){
    this._sUsers.getUsers()
    .pipe()
    .subscribe({
      next: (data)=>{
        console.log(data);
        this._sctr.dataSource.data= data
      },
      error: (eer:any)=>{

      },
      complete: ()=>{

      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);

    this._sctr.dataSource.filter = filterValue.trim().toLowerCase();

    if (this._sctr.dataSource.paginator) {
      this._sctr.dataSource.paginator.firstPage();
    }
  }


}
