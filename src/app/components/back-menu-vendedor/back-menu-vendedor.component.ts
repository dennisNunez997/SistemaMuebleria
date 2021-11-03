import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';

@Component({
  selector: 'app-back-menu-vendedor',
  templateUrl: './back-menu-vendedor.component.html',
  styleUrls: ['./back-menu-vendedor.component.scss'],
})
export class BackMenuVendedorComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFireDatabase,

  ) { }

  user =[];
  nombre_proveedor: string;
  apellido_proveedor: string;
  nombre_empresa: string;
  id_user: string

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){
        this.showProfile(user.uid)  
        
      }      
    })
  }

  showProfile(uid){
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_proveedor = this.user[6];
      this.apellido_proveedor = this.user[0];
      this.nombre_empresa = this.user[5];
    })
  }

  
  goToMenu(){
    this.navCtrl.navigateForward('/menu-vendedor')
  }

}
