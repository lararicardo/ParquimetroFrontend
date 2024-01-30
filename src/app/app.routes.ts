import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './view/home/home.component';
import { VeiculoComponent } from './view/veiculo/veiculo.component';
import { CondutorComponent } from './view/condutor/condutor.component';
import { CadastroTempoComponent } from './view/cadastro-tempo/cadastro-tempo.component';
import { PagamentoComponent } from './view/pagamento/pagamento.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'veiculos', component: VeiculoComponent },
    { path: 'condutores', component: CondutorComponent },
    { path: 'tempos', component: CadastroTempoComponent },
    { path: 'pagamentos', component: PagamentoComponent },
    { path: 'pagamentos/:id', component: PagamentoComponent },
    //{ path: 'recibos/:id', component: ReciboComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
