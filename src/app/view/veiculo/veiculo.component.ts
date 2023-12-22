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

  inputDisabled: boolean = true;
  exibeMensagem: boolean = false;
  textoMensagem: string = "";

  veiculo: Veiculo;
  veiculoSelecionado: Veiculo;
  listaDeVeiculos: Veiculo[] = [];

  cores: string[] = [];

  constructor(private service: VeiculoService) {
    this.veiculo = new Veiculo;
    this.veiculoSelecionado = new Veiculo;
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.service
      .getAll()
      .subscribe({
        next: (response) => {
          this.listaDeVeiculos = response;
          console.log('next: ' + response);
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });

    this.service
      .getAllCores()
      .subscribe({
        next: (response) => {
          this.cores = response;
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  excluir() {
    this.service
      .deletar(this.veiculoSelecionado.placa)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Veículo excluído com sucesso.';
          this.veiculo = new Veiculo;
          this.listaDeVeiculos.splice(this.listaDeVeiculos.indexOf(this.veiculoSelecionado), 1);
        },
        error: (responseError) => {
          this.exibeMensagem = false;
          console.log('error: ' + JSON.stringify(responseError));
        }
      });

  }

  alterar() {

  }

  novo() {
    this.veiculo = new Veiculo;
    this.veiculoSelecionado = new Veiculo;
    this.inputDisabled = false;
  }

  salvar() {
    //console.log(JSON.stringify(this.veiculo));

    this.service
      .add(this.veiculo)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Veículo cadastrado com sucesso.';
          this.veiculo = new Veiculo;
          this.listaDeVeiculos.push(response);
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  selecionarVeiculo(veiculo: Veiculo) {
    this.veiculoSelecionado = veiculo;
    this.veiculo = veiculo;
  }

}
