import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemasService } from '../../services/temas.service';
import { Tema } from '../../models/tema.model';
import { Observable } from 'rxjs'; // asegúrate de que está importado

@Component({
  selector: 'app-tema-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tema-form.component.html',
  styleUrl: './tema-form.component.scss',
})
export class TemaFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  idTema?: number;
  guardando = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private temasService: TemasService,
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      bloque: ['', Validators.required],
      completado: [false],
    });

    this.idTema = this.route.snapshot.params['id'];
    this.esEdicion = !!this.idTema;

    if (this.esEdicion) {
      this.temasService.getTema(this.idTema!).subscribe({
        next: (tema) => this.form.patchValue(tema),
        error: () => (this.error = 'No se pudo cargar el tema.'),
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.guardando = true;

    const tema: Tema = { id: this.idTema ?? 0, ...this.form.value };

    const operacion: Observable<any> = this.esEdicion
      ? this.temasService.updateTema(this.idTema!, tema)
      : this.temasService.createTema(tema);

    operacion.subscribe({
      next: () => this.router.navigate(['/temas']),
      error: () => {
        this.error = 'Error al guardar. Inténtalo de nuevo.';
        this.guardando = false;
      },
    });
  }
}
