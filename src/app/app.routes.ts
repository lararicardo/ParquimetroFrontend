import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { VeiculoComponent } from './view/veiculo/veiculo.component';
import { NgModule } from '@angular/core';
import { CondutorComponent } from './view/condutor/condutor.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'veiculos', component: VeiculoComponent },
    { path: 'condutores', component: CondutorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
