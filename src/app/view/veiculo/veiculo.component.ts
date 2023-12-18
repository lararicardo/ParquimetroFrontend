import { Component } from '@angular/core';
import { SharedComponents } from '../../shared';
import { VeiculoService } from '../../service/veiculo/veiculo.service';
import { Veiculo } from '../../model/veiculo';

@Component({
  selector: 'app-veiculo',
  standalone: true,
  imports: [SharedComponents],
  templateUrl: './veiculo.component.html',
  styleUrl: './veiculo.component.css'
})
export class VeiculoComponent {

  veiculo: Veiculo;

  constructor(private service: VeiculoService) {
    this.veiculo = new Veiculo;
  }

  cadastrar() {
    alert("teste");
  }

  salvar() {
    this.service
      .add(this.veiculo)
      .subscribe({
        complete: () => {
          console.log('complete');
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        },
        next: (response) => {
          console.log('next: ' + response);
        }
      });
  }

}
