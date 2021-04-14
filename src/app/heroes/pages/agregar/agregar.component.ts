import {Component, OnInit} from '@angular/core';
import {Heroe, Publisher} from '../../interfaces/heroes.interface';
import {HeroesService} from '../../services/heroes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmarComponent} from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      height: 80vh;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    publisher: Publisher.DCComics,
    alt_img: '',
    first_appearance: '',
  };

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroeById(id))
      )
      .subscribe(heroe => this.heroe = heroe);

  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }
    if (this.heroe.id) {
      // Actualizar heroe si tiene ID
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroeResponse => {
          this.mostrarSnackBar(`Se actualizo heroe ${this.heroe.superhero} correctamente`);
          console.log(this.heroe);
        });

    } else {
      // Agregar nuevo registro cuanoo no hay id
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnackBar(`Se agrego  ${this.heroe.superhero} correctamente`);
        });
    }
  }

  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: {...this.heroe}
    });

    dialog.afterClosed()
      .subscribe(result => {
        if (result) {
          this.heroesService.borrarHeroe(this.heroe)
            .subscribe(resp => {
              this.router.navigate(['/heroes']);
            });
        }
      });


  }

  mostrarSnackBar(mensaje: string): void {
    this.snackBar.open(mensaje, 'ok!', {
      duration: 2500
    });
  }
}
