import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
 
@Injectable({
  providedIn: 'root'
})
export class CrudPostulantesService {

  constructor(public afs: AngularFireDatabase) { }

  public getPostulantes(){
    return this.afs.list('/postulante_proveedor').valueChanges();
    
  }

  public getPostulante(id){
    return this.afs.object('postulante_proveedor/'+id).valueChanges();
    
  }

  setPostulante(id: string, nombre: string, apellido: string,telefono: number, direccion: string, nombre_empresa: string, fecha_nacimiento: string, image: string, email: string){
    this.afs.object('vendedor/'+id).set({
      uid_vendedor: id,
      nombre_vendedor: nombre,
      apellido_vendedor: apellido,
      fecha_nacimiento_vendedor: fecha_nacimiento,
      telefono_vendedor: telefono,
      direccion_vendedor: direccion,
      nombre_empresa: nombre_empresa,
      email_vendedor: email,
      image_vendedor: image
    })

    this.afs.database.ref('postulante_proveedor/'+id).remove();
  }

  removePostulantes(id:string){
    this.afs.database.ref('postulante_proveedor/'+id).remove()
  }

  


}
