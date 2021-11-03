import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CrudCategoriaService } from 'src/app/services/crud-categoria.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  //user
  user =[];
  nombre_admin: string;
  apellido_admin: string;

   
  //categoria
  nombre_categoria: string;
  categoria_ed: string;
  categorias=[];
  incremental: number;
  isDisabled: boolean = true;
  save: boolean = false;

  //validation_form 
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {   
    
    'nombre_categoria': [
      { type: 'required', message: 'Se requiere categoria del producto'},
    ]
  }



  constructor(private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private crudCategoria: CrudCategoriaService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      
      nombre_categoria: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]))
    });
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)
        this.getCategorias()
        
      }      
    })
  }
  showProfile(uid){
    this.afs.list('admin/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_admin = this.user[3];
      this.apellido_admin = this.user[0];
      console.log('nombre: '+this.nombre_admin)
      console.log('apellido: '+this.apellido_admin)
    })
  }

  pushCategoria(validations_form){
    this.crudCategoria.setCategorias(this.nombre_categoria)
    console.log(this.nombre_categoria)
  }

  getCategorias(){
    this.crudCategoria.getCategorias().subscribe(categoria => {
      this.categorias = categoria;
      console.log("categorias nombre:")
    })
  }

  removeCategorias(id){
    this.crudCategoria.removeCategorias(id);
  }

  
  saveChanges(id){
    this.save = false;
    this.isDisabled = true;
    this.afs.database.ref('categoria/'+id).update({
      nombre_categoria: this.categoria_ed
    })
    console.log("categoria.guardada")
  }
  
  editCategoria(){
    this.isDisabled = false;
    this.save = true;
  } 
  
  
  goToMenu(){
    this.navCtrl.navigateForward('/menu-vendedor')
  }


}
