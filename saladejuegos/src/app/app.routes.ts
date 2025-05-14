import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuiensoyComponent } from './componentes/quiensoy/quiensoy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AhorcadoComponent } from './componentes/games/ahorcado/ahorcado.component';
import { MayormenorComponent } from './componentes/games/mayormenor/mayormenor.component';
import { ShooterComponent } from './componentes/games/shooter/shooter.component';
import { PreguntadosComponent } from './componentes/games/preguntados/preguntados.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: "full"}, 
    {path: 'home', component: HomeComponent}, 
    {path: 'login', component: LoginComponent}, 
    {path: 'quiensoy', component: QuiensoyComponent},
    {path: 'registro', component: RegistroComponent}, 
    {path: 'ahorcado', component: AhorcadoComponent},
    {path: 'mayormenor', component: MayormenorComponent}, 
    {path: 'shooter', component:ShooterComponent},
    {path: 'preguntados', component:PreguntadosComponent}

];
