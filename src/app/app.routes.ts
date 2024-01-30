import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { VeiculoComponent } from './view/veiculo/veiculo.component';
import { NgModule } from '@angular/core';
import { CondutorComponent } from './view/condutor/condutor.component';
<<<<<<< Updated upstream
=======
import { CadastroTempoComponent } from './view/cadastro-tempo/cadastro-tempo.component';
import { PagamentoComponent } from './view/pagamento/pagamento.component';
import { ReciboComponent} from "./view/recibo/recibo.component";
>>>>>>> Stashed changes

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'veiculos', component: VeiculoComponent },
<<<<<<< Updated upstream
    { path: 'condutores', component: CondutorComponent }
=======
    { path: 'condutores', component: CondutorComponent },
    { path: 'tempos', component: CadastroTempoComponent },
    { path: 'pagamentos', component: PagamentoComponent },
    { path: 'recibos/:id', component: ReciboComponent }
>>>>>>> Stashed changes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
