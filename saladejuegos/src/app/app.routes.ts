import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuiensoyComponent } from './componentes/quiensoy/quiensoy.component';

export const routes: Routes = [

    {path: '', redirectTo: '/login', pathMatch: "full"}, 
    {path: 'home', component: HomeComponent}, 
    {path: 'login', component: LoginComponent}, 
    {path: 'quiensoy', component: QuiensoyComponent}
];
