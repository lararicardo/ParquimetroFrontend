import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VeiculoComponent } from './veiculo/veiculo.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'veiculos', component: VeiculoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
