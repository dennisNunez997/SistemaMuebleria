import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CrudPostulantesService } from 'src/app/services/crud-postulantes.service';
@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.page.html',
  styleUrls: ['./postulantes.page.scss'],
})
export class PostulantesPage implements OnInit {
  user =[];
  nombre_admin: string;
  apellido_admin: string;
  email_admin: string;
  tlfono_admin: number;

  idSelected: any;
  show: boolean;

  Collection: AngularFireList<any>;
  solicitudes= [];

  postulante = {uid: null, nombre: null, apellido:null, direccion: null, email: null, fecha_nacimiento: null, telefono: null, imagen: null, nombre_empresa: null}

  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private crudPostulantes: CrudPostulantesService
  ) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.show=false;
        this.showProfile(user.uid)
        this.getPostulantes()
      }      
    })
  }
  showProfile(uid){
    this.afs.list('admin/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_admin = this.user[3];
      this.apellido_admin = this.user[0];
      this.email_admin = this.user[1];
      this.tlfono_admin = this.user[4];
      console.log('nombre: '+this.nombre_admin)
      console.log('apellido: '+this.apellido_admin)
    })
  }
  getPostulantes(){
    this.crudPostulantes.getPostulantes().subscribe(postulante =>{
      this.solicitudes = postulante;
      console.log("postulantes: "+this.solicitudes)
    })
  }
  /*
  selecFruit(id){
    this.show=true;
    this.idSelected = id;

    let receivedPostulantes: any;

    this.crudPostulantes.getPostulante(id).subscribe(postulante=>{
      receivedPostulantes = postulante;
      this.postulante = receivedPostulantes;
      
    })
    
  }
  */
  pushPostulante(id, nombre, apellido,telefono, direccion, nombre_empresa, fecha_nacimiento, image, email){
    this.crudPostulantes.setPostulante(id, nombre, apellido,telefono, direccion, nombre_empresa, fecha_nacimiento, image, email)
  }

  removePostulantes(id){
    this.crudPostulantes.removePostulantes(id);
    console.log(id)
    
  }

  goToMenu(){
    this.navCtrl.navigateForward('/menu')
  }

  
}
