import { Routes } from '@angular/router';
export const routes: Routes = [
  // 1. Si entran vacíos, los mandamos a /estructura
  { path: '', redirectTo: '/estructura', pathMatch: 'full' },

  // 2. Aquí es donde asocias la URL con tu componente de inicio
  {
    path: 'estructura',
    loadComponent: () =>
      import('./paginas/inicio/inicio.component').then(
        (m) => m.InicioComponent,
      ),
  },
  {
    path: 'temas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./temas/components/tema-list/tema-list.component').then(
            (m) => m.TemaListComponent,
          ),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./temas/components/tema-form/tema-form.component').then(
            (m) => m.TemaFormComponent,
          ),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./temas/components/tema-form/tema-form.component').then(
            (m) => m.TemaFormComponent,
          ),
      },
    ],
  },

  {
    path: 'conexion-backend',
    loadComponent: () =>
      import('./paginas/conexion/conexion.component').then(
        (m) => m.ConexionComponent,
      ),
  },
  {
    path: 'frontend',
    loadComponent: () =>
      import('./paginas/frontend/frontend.component').then(
        (m) => m.FrontendComponent,
      ),
  },
  {
    path: 'basededatos',
    loadComponent: () =>
      import('./paginas/basededatos/basededatos.component').then(
        (m) => m.BasededatosComponent,
      ),
  },
];
