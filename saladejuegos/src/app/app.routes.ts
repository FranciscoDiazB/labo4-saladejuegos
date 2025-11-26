import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuiensoyComponent } from './componentes/quiensoy/quiensoy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AhorcadoComponent } from './componentes/games/ahorcado/ahorcado.component';
import { MayormenorComponent } from './componentes/games/mayormenor/mayormenor.component';
import { ShooterComponent } from './componentes/games/shooter/shooter.component';
import { PreguntadosComponent } from './componentes/games/preguntados/preguntados.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { ResultsComponent } from './componentes/results/results.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: "full"}, 
    {path: 'home', loadComponent: () => import('./componentes/home/home.component').then(m => m.HomeComponent)},
    {path: 'login', loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent)},
    {path: 'quiensoy', loadComponent: () => import('./componentes/quiensoy/quiensoy.component').then(m => m.QuiensoyComponent)},
    {path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(m => m.RegistroComponent)},
    {path: 'resultados', loadComponent: () => import('./componentes/results/results.component').then(m => m.ResultsComponent)},
    {path: 'resultados-encuesta', loadComponent: () => import('./componentes/resultados-encuesta/resultados-encuesta.component').then(m => m.ResultadosEncuestaComponent)},
    {path: 'encuesta', loadComponent: () => import('./componentes/encuesta/encuesta.component').then(m => m.EncuestaComponent)},
    {
        path: 'games',
        loadChildren: () => import('./modules/games/games-routing.module').then( m => m.GamesRoutingModule)
    },
    {path: '**', loadComponent: ()=> import('./componentes/error/error.component').then(m => m.ErrorComponent)}

];

