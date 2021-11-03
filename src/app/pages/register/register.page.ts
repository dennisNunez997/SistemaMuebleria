import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  customPickerOptions: any;
  CurrentDate: Date = new Date();
  fechaNacimiento: Date;
  archivos: any=[]

  
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  previsualizacion: string;
  email: string;
  password: string
  nombre: string;
  apellido: string;
  telefono: number;
  direccion: string;
  nombre_empresa: string;
  fecha_nacimiento: Date;

  validation_messages = {   
    
    'name': [
      { type: 'required', message: 'Se requiere nombre de usuario'},
    ],
    'apellido': [
      { type: 'required', message: 'Se requiere apellido de usuario'},
    ],
    'telefono': [
      { type: 'required', message: 'Se requiere telefono de usuario'},
    ],
    'direccion': [
      { type: 'required', message: 'Se requiere direccion de usuario'},
    ],
    'nombre_empresa': [
      { type: 'required', message: 'Se requiere nombre de empresa de usuario'},
    ],
    'fecha_nacimiento': [
      { type: 'required', message: 'Se requiere fecha de nacimiento de usuario'},
    ],
    'email': [
      { type: 'required', message: 'Se requiere email.' },
      { type: 'pattern', message: 'Ingrese un email valido.' }
    ],
    'password': [
      { type: 'required', message: 'Se requiere contraseña.' },
      { type: 'minlength', message: 'La contraseña debe ser mayor a 5 digitos.' }
    ]
  }


  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private alertCtroller: AlertController,    
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private afs: AngularFireDatabase
    ) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }
   }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      apellido: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      telefono: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      direccion: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      nombre_empresa: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      fecha_nacimiento: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }           

  capturarFile(event):any{
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen:any) => {
      this.previsualizacion = imagen.base
      console.log(imagen)
    })
    //this.archivos.push(archivoCapturado)
    //console.log(event.target.files)
  }

  extraerBase64 = async($event: any) => new Promise((resolve, reject) => {
    try{
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        })
      }
    }catch(e){
      return null;
    }
  }) 
  
  tryRegister(validations_form){
    let dateTimestamp = this.fecha_nacimiento.toString()
    //console.log("fecha: "+this.fecha_nacimiento)
    //console.log("fecha string: "+dateTimestamp)
    if(!this.previsualizacion){
      this.imageController()
    }else{
      this.authService.register(this.email,this.password, this.nombre, this.apellido, this.telefono, this.direccion, this.nombre_empresa, dateTimestamp, this.previsualizacion)
     .then(res => {       
       this.errorMessage = "";
       this.successMessage = "Su cuenta ha sido creada.";
       this.validations_form.reset()
       //console.log("image: "+this.previsualizacion)
       //console.log("fecha_nacimiento"+this.fechaNacimiento)       
       this.userRegistered()
       this.navCtrl.navigateForward("/inicio")
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
    }
    
  }
 


  async imageController(){
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'error',
      header: 'Error al registrar',
      message: 'ingrese una fotografía',
      buttons: ['OK']

    })
    await alert.present();
  }
  
  async userRegistered(){
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'exit',
      header: 'Solicitud de registro en revisión',
      message: 'El administrador revisará su información para que pueda entrar a su cuenta',
      buttons: ['OK']

    })
    await alert.present();
  }

  

}
