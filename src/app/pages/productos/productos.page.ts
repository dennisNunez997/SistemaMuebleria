import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CrudProductosService } from 'src/app/services/crud-productos.service';
import { AlertController } from '@ionic/angular';
import { CrudCategoriaService } from 'src/app/services/crud-categoria.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {


  archivos: any = [];
  user = [];
  nombre_proveedor: string;
  apellido_proveedor: string;
  id_user: string


  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  //productos
  productos = [];
  producto: string;
  nombre_producto: string;
  categoria_producto: string;
  categorias = []
  cantidad_producto: number;
  precio_producto: number;
  descripcion_producto: number;
  nombre_vendedor: string;
  nombre_empresa: string;
  previsualizacion: string;

  ProductForm: FormGroup;

  error_messages = {
    'nombre_producto': [
      { type: 'required', message: 'Ingrese un nombre de producto' },
      { type: 'minlength', message: 'El nombre del producto debe tener 3 o mas caracteres' },
      { type: 'maxlength', message: 'El nombre del producto debe tener  10 o menos caracteres' },

    ],
    'descripcion_producto': [
      { type: 'required', message: 'Ingrese la descripcion del producto' },
      { type: 'minlength', message: 'La descripcion del producto debe ser mayor a 5 caracteres' },
      { type: 'maxlength', message: 'La descripcion del producto debe ser menor a 50 caracteres' },
    ],
    'cantidad_producto': [
      { type: 'required', message: 'Ingrese la cantidad del producto' },
      { type: 'minlength', message: 'La cantidad del producto debe ser mayor a 1 caracter' },
      { type: 'maxlength', message: 'La cantidad del producto debe ser menor a 4 caracteres' },
    ],

    'precio_producto': [
      { type: 'required', message: 'Ingrese el precio del producto' },
      { type: 'minlength', message: 'La cantidad del producto debe ser mayor a 1 caracter' },
      { type: 'maxlength', message: 'La cantidad del producto debe ser menor a 4 caracteres' },
    ],
    'categoria_producto': [
      { type: 'required', message: 'Seleccione la categoria del producto' },
    ]
  }

  constructor(
    private sanitizer: DomSanitizer,
    private afs: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private crudProd: CrudProductosService,
    private alertCtroller: AlertController,
    private categoria: CrudCategoriaService) {

    this.ProductForm = this.formBuilder.group({
      nombre_producto: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ])),
      descripcion_producto: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])),
      cantidad_producto: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4)
      ])),

      precio_producto: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4)
      ])),
      categoria_producto: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })


  }

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.getCategorias()
        this.showProfile(user.uid)
        this.getProductos(user.uid)

      }
    })
  }
  getCategorias() {
    this.categoria.getCategorias().subscribe(categoria => {
      this.categorias = categoria;
    })
  }
  showProfile(uid) {
    this.afs.list('vendedor/' + uid).valueChanges().subscribe(_data => {
      this.user = _data
      this.nombre_proveedor = this.user[6];
      this.apellido_proveedor = this.user[0];
      this.nombre_empresa = this.user[5];
    })
  }

  capturarFile(event): any {
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base
      console.log(imagen)
    })
    //this.archivos.push(archivoCapturado)
    //console.log(event.target.files)
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
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
    } catch (e) {
      return null;
    }
  })

  addProducto(validations_form) {
    if (!this.previsualizacion) {
      this.imageController()
    } else {
      this.afAuth.onAuthStateChanged(user => {
        if (user) {
          //this.crudProd.addProduct()
        }
      })
    }
  }

  async imageController() {
    const alert = await this.alertCtroller.create({
      animated: true,
      cssClass: 'error',
      header: 'Error al registrar',
      message: 'ingrese una fotografía',
      buttons: ['OK']

    })
    await alert.present();
  }


  goToMenu() {
    this.navCtrl.navigateForward('/menu-vendedor')
  }

  getProductos(uid) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.crudProd.getProductos().subscribe(
          list => {
            console.log(list);
            this.productos = list.map(item => {
              return {
                $key: item.key,
                ...item.payload.val()
              }
            })
            console.log(this.productos)
            this.productos.map(item => {
              this.id_user = item.uid_user;
              item.old_nombre_producto = item.nombre_producto;
              item.old_descripcion_producto = item.descripcion_producto;
              item.old_cantidad_producto = item.cantidad_producto;
              item.old_precio_producto = item.precio_producto;
              item.old_categoria_producto = item.categoria_producto;
            })

          }
        )
      }
    })


  }

  edit(item) {
    item.nombre_producto = item.old_nombre_producto;
    item.descripcion_producto = item.old_descripcion_producto;
    item.cantidad_producto = item.old_cantidad_producto;
    item.precio_producto = item.old_precio_producto;
    item.categoria_producto = item.old_categoria_producto;
  }

  editProd(id) {
    console.log("producto" + this.nombre_producto)
  }

  saveProduct() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.crudProd.addProduct(user.uid, this.previsualizacion, this.ProductForm.value.categoria_producto, this.ProductForm.value.nombre_producto, this.ProductForm.value.cantidad_producto, this.ProductForm.value.precio_producto, this.ProductForm.value.descripcion_producto, this.nombre_proveedor, this.apellido_proveedor, this.nombre_empresa)
      }
    })

  }


}
