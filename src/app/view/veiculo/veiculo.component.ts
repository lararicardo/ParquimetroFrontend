import { Component } from '@angular/core';
import { SharedComponents } from '../../shared';

@Component({
  selector: 'app-veiculo',
  standalone: true,
  imports: [SharedComponents],
  templateUrl: './veiculo.component.html',
  styleUrl: './veiculo.component.css'
})
export class VeiculoComponent {

  cadastrar(){
    alert("teste");
  }

  salvar(){

  }

}
