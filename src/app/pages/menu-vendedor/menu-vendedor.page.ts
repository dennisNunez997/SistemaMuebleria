import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-vendedor',
  templateUrl: './menu-vendedor.page.html',
  styleUrls: ['./menu-vendedor.page.scss'],
})
export class MenuVendedorPage implements OnInit {

  user=[];
  
  nombre_vendedor: string;
  apellido_vendedor: string;
  email_vendedor: string;
  tlfono_vendedor: number;

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
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_vendedor = this.user[6];
      this.apellido_vendedor = this.user[0];
      console.log('nombre: '+this.nombre_vendedor)
      console.log('apellido: '+this.apellido_vendedor)
    })
  }

  goToProfile(){
    this.navCtr.navigateForward('/vendedor');
  }

  goToPromocion(){
    this.navCtr.navigateForward('/promociones')
  }
  
  goToProductos(){
    this.navCtr.navigateForward('/productos')
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
