import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CrudProductosService } from 'src/app/services/crud-productos.service';

@Component({
  selector: 'app-edit-prod',
  templateUrl: './edit-prod.page.html',
  styleUrls: ['./edit-prod.page.scss'],
})
export class EditProdPage implements OnInit {

  productos = []

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private crudProd: CrudProductosService
    ) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if(user){   
        this.getProduct()     
      }      
    })
  }

  getProduct(){
    this.crudProd.getProductos().subscribe(producto => {
      this.productos = producto
      console.log("productos"+this.productos)
    })
  }

  
  goToMenu(){
    this.navCtrl.navigateForward('/menu-vendedor')
  }

}
