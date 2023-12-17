import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VeiculoComponent } from './veiculo/veiculo.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'veiculos', component: VeiculoComponent }
  ];
