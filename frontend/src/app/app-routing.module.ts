import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { EquiposComponent } from './pages/equipos/equipos.component';
import { JugadoresComponent } from './pages/jugadores/jugadores.component';
import { ClasificacionesComponent } from './pages/clasificaciones/clasificaciones.component';
import { ResultadosComponent } from './pages/resultados/resultados.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { CapitanComponent } from './pages/capitan/capitan.component';
import { ArbitroComponent } from './pages/arbitro/arbitro.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent },
  { path: 'equipos', component: EquiposComponent },
  { path: 'jugadores', component: JugadoresComponent },
  { path: 'clasificaciones', component: ClasificacionesComponent },
  { path: 'arbitro', component: ArbitroComponent },
  { path: 'resultados', component: ResultadosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas privadas protegidas por rol
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard],
    data: { rol: 'usuario' }
  },
  {
    path: 'capitan',
    component: CapitanComponent,
    canActivate: [AuthGuard],
    data: { rol: 'capitan' }
  },
  {
    path: 'arbitro',
    component: ArbitroComponent,
    canActivate: [AuthGuard],
    data: { rol: 'arbitro' }
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}