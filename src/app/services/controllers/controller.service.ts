import { AfterViewInit, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router, Event } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Users } from 'src/app/models/user-response';
import Swal from 'sweetalert2';
import { UsersService } from '../users.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class ControllerService implements AfterViewInit  {

  public token:any;
// ------------------------------------
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;


dataSource= new MatTableDataSource<Users>();

// ------------------------------------

currentRoute?:string;
// ------------------------------------

nameform:string='';
formu!:FormGroup;
hide = true;
editarC:boolean=true;
public changeC: boolean    = false;

user:any;
usuario:Users={
  id:'',
  email:    "",
  lastname: "",
  name:     "",
  password: "",
  role:     ""
}
public rol:any[]=[
  {role:'USER'},
  {role:'ADMIN'},
];


  constructor(
    public router: Router,
    private _sUser: UsersService,
    private toastr: ToastrService,
    private form: FormBuilder,
    private permissionsService: NgxPermissionsService,
    ) {
      this.verificarRuta()
    }
    ngAfterViewInit(): void {
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.token= localStorage.getItem('token');
    }else{
      this.token='';
    }
    return this.token;
  }
  leerRole(){
    // console.log('dsd');

    let role:any;
    if(localStorage.getItem('role')){
       role= localStorage.getItem('role');
      //  console.log(role);
       if(role=="USER"){
        this.router.navigate(['/home']);
       }
    }else{
      role='';
    }
    return role;
  }
  // ----------------------------------------------------------------------
  public get emailNoValid(){   return this.formu.get('email')?.invalid    && this.formu.get('email')?.touched;};
  public get roleNoValid(){   return this.formu.get('role')?.invalid    && this.formu.get('role')?.touched;};
  public get passwordNoValid(){return this.formu.get('password')?.invalid && this.formu.get('password')?.touched;};
  public get nameNoValid(){return this.formu.get('name')?.invalid && this.formu.get('name')?.touched;};
  public get lastNameNoValid(){return this.formu.get('lastname')?.invalid && this.formu.get('lastname')?.touched;};

  createForm(){
    this.formu= this.form.group({
      name:     ["", [Validators.required, Validators.minLength(3)], []],
      lastname: ["", [Validators.required, Validators.minLength(3)], []],
      email:    ["", [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")], []],
      password: ["", [Validators.required, Validators.minLength(3)], []],
      role: ["", [Validators.required, ], []],
    })
  }
  loadForm(user:Users){
    this.formu.reset({
      id: user?.id,
      name: user?.name,
      lastname: user?.lastname,
      email:   user?.email,
      password:user?.password,
      role: user?.role,
    })
  }

  // ----------------------------------------------------------------------
  enviar(){
    if(this.formu.invalid){

      return Object.values(this.formu.controls).forEach(controls=>{
        controls.markAllAsTouched()
      })
    }else{

      if(this.nameform==='Agregar'){
        this.postUser();
      }else if(this.nameform==='Editar'){
        this.putUser()
      }
    }
  }

  agregar(){
    this.nameform="Agregar"
    this.editarC=true;
    this.loadForm(this.usuario)
    this.formu=this.form.group({
      ...this.formu.controls,
      password: ["", [Validators.required, Validators.minLength(3)], []],
    });
  }
  editar(user:Users){

    this.nameform="Editar";
    this.user=user
    this.loadForm(this.user)
  }
  eliminar(user:any){
    this.user=user;
    Swal.fire({
      title: 'Estas seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
          this.delUser(user?.id)
      }
    })

  }

  postUser(){
    this._sUser.postUser(this.formu.value)
    .pipe( finalize(()=>{
      this.loadForm(this.usuario);
      this.getUsers();
    }))
    .subscribe({
      next:(data:any)=>{

        this.showToastr_success(`Usuario ${data?.user?.name} creado`)
      },
      error: (error:any)=>{
        if(error?.error?.msg){
          this.showToastr_error((error?.error?.msg).toString())
        }else{
          this.showToastr_error(error?.message)
        }
      }
    })
  }

  getUserId(){
    if(localStorage.getItem('id')){
      const id =localStorage.getItem('id');

      this._sUser.getUserId(id)
      .pipe( finalize(()=>{
      }))
      .subscribe({
        next:(data)=>{
          this.user={
            ...data,
            id:id
          };
          localStorage.setItem('role', this.user?.role);
          if(this.user?.role==='ADMIN'){
            this.permissionsService.loadPermissions([`${this.user?.role}`]);
          }else{
            this.permissionsService.loadPermissions([`${this.user?.role}`]);
            // this.router.navigate(['/home'])
          }
        },
        error: (error:any)=>{
          if(error?.error?.msg){
            this.showToastr_error((error?.error?.msg).toString())
          }else{
            this.showToastr_error(error?.message)
          }
        }
      })
    }else{
this.router.navigate(['/login'])
    }

  }
  getUsers(){
    this._sUser.getUsers()
    .pipe( finalize(()=>{
      this.leerRole();
    }))
    .subscribe({
      next:(data)=>{

        this.dataSource.data=data;
      },
      error: (error:any)=>{
        if(error?.error?.msg){
          this.showToastr_error((error?.error?.msg).toString())
        }else{
          this.showToastr_error(error?.message)
        }
      }
    })
  }

  delUser(id:any){
    this._sUser.deleteUserId(id)
    .pipe( finalize(()=>{
      if(this.currentRoute==='/profile'){
        localStorage.clear()
        location.reload()
      }else{
        this.dataSource.data = this.dataSource.data.filter((ele:any)=>ele.id!==this.user?.id)
      }
    }))
    .subscribe({
      next:(data:any)=>{
        this.showToastr_success('Usuario eliminado')
      },
      error: (error:any)=>{
        if(error?.error?.msg){
          this.showToastr_error((error?.error?.msg).toString())
        }else{
          this.showToastr_error(error?.message)
        }
      }
    })
  }
  putUser(){
    let idTemp:any= this.user.id;
    this._sUser.putUsers(this.user.id, this.formu.value)
    .pipe( finalize(()=>{
      this.loadForm(this.user)
      this.editarC=false;
      this.changeC=false;

      if(this.currentRoute==='/users'){

      this.getUsers()
      }
    }))
    .subscribe({
      next:(data)=>{

        this.user={
          id:idTemp,
          ...data
        }
        this.showToastr_success(`Usuario ${data?.name} editado`)
      },
      error: (error:any)=>{
        if(error?.error?.msg){
          this.showToastr_error((error?.error?.msg).toString())
        }else{
          this.showToastr_error(error?.message)
        }
      }
    })
  }
  // ----------------------------------------------------------------------
  verificarRuta(){
    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
    }
    });

  }
  // ----------------------------------------------------------------------
  showToastr_success(title: string) {
    this.toastr.success(`${title}`);
  }
  showToastr_error(title: string) {
    this.toastr.error(`${title}`);
  }
}
