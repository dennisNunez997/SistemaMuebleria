import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
//navegacion
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { FormControl, FormGroup, Validators } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class CrudProductosService {


  

  productList: AngularFireList<any>;
  
  constructor(private AFauth: AngularFireAuth,
    private afs: AngularFireDatabase,
    private navCtrl: NavController,
    private storage: AngularFireStorage) { }

  addProduct(id_user: string, image_producto: string,categoria_producto: string, nombre_producto: string, cantidad_producto: number, precio_producto: number,descripcion_producto: string, nombre_proveedor: string, apellido_proveedor: string, nombre_empresa: string){
    return new Promise((resolve, reject) => {
      const uid = id_user; 
      const prod = this.afs.database.ref('/producto/')
      const id_prod = prod.push().key
      this.storage.storage.ref('producto/'+id_prod).putString(image_producto, 'data_url').then(async(datos) => {
        await datos.ref.getDownloadURL().then((downloadURL) => {
          image_producto=downloadURL;
          this.afs.object('producto/'+id_prod).set({
            uid_user: uid,
            id_prod: id_prod,
            nombre_producto: nombre_producto,
            categoria_producto: categoria_producto,
            cantidad_producto: cantidad_producto,
            precio_producto: precio_producto,
            descripcion_producto: descripcion_producto,
            image_producto: image_producto,
            nombre_proveedor: nombre_proveedor,
            apellido_proveedor: apellido_proveedor,
            empresa_proveedor: nombre_empresa
          })
        })
      })
    })
  }

  public getProductos(){
    this.productList = this.afs.list('/producto');
    return this.productList.snapshotChanges();
  }


  

}
