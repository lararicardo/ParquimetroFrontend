import { Component, OnInit } from '@angular/core';
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
export class VeiculoComponent implements OnInit {

  messageAlert: boolean = false;
  veiculo: Veiculo;
  listaDeVeiculos: Veiculo[] = [];

  constructor(private service: VeiculoService) {
    this.veiculo = new Veiculo;
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.service
      .getAll()
      .subscribe({
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        },
        next: (response) => {
          this.listaDeVeiculos = response;
          console.log('next: ' + response);
        }
      });
  }

  excluir() {

  }

  alterar() {

  }

  salvar() {
    console.log(JSON.stringify(this.veiculo));

    this.service
      .add(this.veiculo)
      .subscribe({
        complete: () => {
          console.log('complete');
        },
        error: (responseError) => {
          this.messageAlert = false;
          console.log('error: ' + JSON.stringify(responseError));
        },
        next: (response) => {
          this.messageAlert = true;
          console.log('next: ' + response);
        }
      });
  }

}
