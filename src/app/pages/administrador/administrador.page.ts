import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {
  user =[];
  nombre_admin: string;
  apellido_admin: string;
  email_admin: string;
  tlfono_admin: number;


  constructor(
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)
      }      
    })
  }

  goToMenu(){
    this.navCtrl.navigateForward('/menu')
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
      console.log('email: '+this.email_admin)
      console.log('telefono: '+this.tlfono_admin)
    })
  }
}
