import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../../componentes/games/ahorcado/ahorcado.component';
import { MayormenorComponent } from '../../componentes/games/mayormenor/mayormenor.component';
import { PreguntadosComponent } from '../../componentes/games/preguntados/preguntados.component';
import { ShooterComponent } from '../../componentes/games/shooter/shooter.component';

const routes: Routes = [
  {path: 'ahorcado', component: AhorcadoComponent}, 
  {path: 'mayormenor', component: MayormenorComponent}, 
  {path: 'preguntados', component: PreguntadosComponent},
  {path: 'shooter', component: ShooterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
