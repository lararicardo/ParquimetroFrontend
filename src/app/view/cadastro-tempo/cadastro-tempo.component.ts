import { Component, OnInit } from '@angular/core';
import { SharedComponents } from '../../shared';

import { Tempo } from '../../model/tempo/tempo';
import { ControleTempo } from '../../model/tempo/controle.tempo';
import { TempoService } from '../../service/tempo/tempo.service';

import { Condutor } from '../../model/condutor/condutor';
import { CondutorService } from '../../service/condutor/condutor.service';

import { Veiculo } from '../../model/veiculo/veiculo';
import { VeiculoService } from '../../service/veiculo/veiculo.service';

import moment from 'moment';

@Component({
  selector: 'app-cadastro-tempo',
  standalone: true,
  imports: [SharedComponents],
  templateUrl: './cadastro-tempo.component.html',
  styleUrl: './cadastro-tempo.component.css'
})

export class CadastroTempoComponent implements OnInit {

  exibeMensagem: boolean = false;
  textoMensagem: string = "";

  condutor: Condutor;
  veiculo: Veiculo;
  tempo: Tempo;

  condutorSelecionado: Condutor;
  veiculoSelecionado: Veiculo;
  tempoSelecionado: Tempo;

  controleDeTempos: ControleTempo[] = [];

  listaDeTempos: Tempo[] = [];
  listaDeCondutores: Condutor[] = [];
  listaDeVeiculos: Veiculo[] = [];

  constructor(private service: TempoService, private condutorService: CondutorService, private veiculoService: VeiculoService) {
    this.tempo = new Tempo;
    this.condutor = new Condutor;
    this.veiculo = new Veiculo;

    this.condutorSelecionado = new Condutor;
    this.veiculoSelecionado = new Veiculo;
    this.tempoSelecionado = new Tempo;

    this.inicializarListaDeCondutores();
    this.inicializarListaDeVeiculos();
  }

  ngOnInit(): void {

    this.service.getListaDeTempos().subscribe(
      tempos => {
        console.log(tempos);
        this.controleDeTempos = tempos.map(controleDeTempo => ({
          name: controleDeTempo.name,
          formatterPattern: controleDeTempo.formatterPattern,
          automaticoValue: controleDeTempo.automaticoValue,
          hora: controleDeTempo.hora ? controleDeTempo.hora.toString() : ''
        }));
      },
      error => {
        console.error('Erro ao obter a lista de tempos', error);
      }
    );

    this.condutorService.getAll().subscribe(
            condutores => {
                this.listaDeCondutores = condutores;
            },
            error => {
                console.error('Erro ao obter a lista de condutores', error);
            }
        );

    this.veiculoService.getAll().subscribe(
            veiculos => {
                this.listaDeVeiculos = veiculos;
            },
            error => {
                console.error('Erro ao obter a lista de veiculos', error);
            }
        );

  }

  getAll() {
    this.service
      .getAll()
      .subscribe({
        next: (response) => {
          this.listaDeTempos = response;
          console.log('next: ' + response);
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  alterar() {
    this.service
      .update(this.tempo)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Tempo alterado com sucesso.';
          this.tempo = new Tempo;
          this.getAll();
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  salvar() {

    if(this.tempo.id){
      this.alterar();
    }else{
      this.service
      .add(this.tempo)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Tempo cadastrado com sucesso.';
          this.tempo = new Tempo;
          this.listaDeTempos.push(response);
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
    }
  }

  inicializarListaDeVeiculos() {
    // Use o serviço de veículos para buscar a lista de veículos
    this.veiculoService.getAll().subscribe({
      next: (veiculos) => {
        this.listaDeVeiculos = veiculos;
      },
      error: (error) => {
        console.error('Erro ao obter lista de veículos:', error);
      }
    });
  }

  inicializarListaDeCondutores() {
    // Use o serviço de condutores para buscar a lista de condutores
    this.condutorService.getAll().subscribe({
      next: (condutores) => {
        this.listaDeCondutores = condutores;
      },
      error: (error) => {
        console.error('Erro ao obter lista de condutores:', error);
      }
    });
  }

}


