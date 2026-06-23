import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemasService } from '../../services/temas.service';
import { Tema } from '../../models/tema.model';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tema-list',
  imports: [CommonModule],
  templateUrl: './tema-list.component.html',
  styleUrl: './tema-list.component.scss',
})
export class TemaListComponent implements OnInit {
  temas: Tema[] = [];
  cargando = true;
  error = '';

  constructor(private temasService: TemasService) {}

  ngOnInit(): void {
    this.temasService.getTemas().subscribe({
      next: (datos) => {
        this.temas = datos;
        this.cargando = false;
      },
      error: () => {
        this.error =
          'No se pudieron cargar los temas. Comprueba la conexión con el backend.';
        this.cargando = false;
      },
    });
  }
}
