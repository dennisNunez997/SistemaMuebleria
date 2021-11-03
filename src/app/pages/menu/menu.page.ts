import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';

import { NavController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  nombre_admin: string;
  apellido_admin: string;
  email: string;
  user = [];
  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtr: NavController,
    private authservice: AuthService) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)
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

  goToProfile(){
    this.navCtr.navigateForward('/administrador')
  }

  goToVendedor(){
    this.navCtr.navigateForward('/vendedor')
  }

  goToSolicitudes(){
    this.navCtr.navigateForward('/postulantes')
  }

  goToCategoria(){
    this.navCtr.navigateForward('/categorias')
  }

  logout(){
    this.authservice.logoutUser().then(res => {
      console.log(res);
      this.navCtr.navigateBack('/inicio');
    }).catch(error => {
      console.log(error);
    })
  }

  

}
