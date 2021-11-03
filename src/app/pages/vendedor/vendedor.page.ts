import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.page.html',
  styleUrls: ['./vendedor.page.scss'],
})
export class VendedorPage implements OnInit {

  user =[];
  nombre_vendedor: string;
  apellido_vendedor: string;
  email_vendedor: string;
  tlfono_vendedor: number;

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

  showProfile(uid){
    this.afs.list('vendedor/'+uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_vendedor = this.user[6];
      this.apellido_vendedor = this.user[0];
      this.email_vendedor = this.user[2];
      this.tlfono_vendedor = this.user[7];
      console.log('nombre: '+this.nombre_vendedor)
      console.log('apellido: '+this.apellido_vendedor)      
      console.log('email: '+this.email_vendedor)
      console.log('telefono: '+this.tlfono_vendedor)
    })
  }

  goToMenu(){
    this.navCtrl.navigateForward('/menu-vendedor')
  }


}
