import { Injectable } from '@angular/core';
//firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
//navegacion
import { NavController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private AFauth: AngularFireAuth,
              private afs: AngularFireDatabase,
              private navCtrl: NavController,
              private storage: AngularFireStorage) { }

  loginUser(value){
    return new Promise<any>((resolve, reject) => {
    this.AFauth.signInWithEmailAndPassword(value.email, value.password).then(
    res => resolve(res),
    err => reject(err)
    )
    })
  }


  logoutUser(){
    return new Promise((resolve, reject) => {
      if(this.AFauth.currentUser){
          this.AFauth.signOut().then(()=>{
          this.navCtrl.navigateBack('/inicio')
          resolve;
        }).catch((error) => {
          reject();
        })
      }
    })
  }

  register(email: string, password: string, nombre: string, apellido: string, telefono: number,direccion: string, nombre_empresa: string, fecha_nacimiento: string ,image: string){
    return new Promise((resolve, reject) => {
      this.AFauth.createUserWithEmailAndPassword(email, password).then(res => {
        const uid = res.user.uid;
        this.storage.storage.ref('proveedor/'+res.user.uid).putString(image, 'data_url').then(async(datos) => {
          await datos.ref.getDownloadURL().then((downloadURL) => {
            image=downloadURL;
            this.afs.object('postulante_proveedor/'+res.user.uid).set({
              uid: uid,
              nombre: nombre,
              apellido: apellido,
              fecha_nacimiento: fecha_nacimiento,
              telefono: telefono,
              direccion: direccion,
              nombre_empresa: nombre_empresa,
              email: email,
              imagen: image,

            })
          })
        })
    
      })
    })
  }

  resetPassword(email: string){
    return this.AFauth.sendPasswordResetEmail(email);
  }

  


}
