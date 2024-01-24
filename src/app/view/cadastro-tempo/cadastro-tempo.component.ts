import { Component, OnInit} from '@angular/core';
import { SharedComponents } from '../../shared';
import { DatePipe } from '@angular/common';

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
styleUrl: './cadastro-tempo.component.css',
})

export class CadastroTempoComponent implements OnInit  {

exibeMensagem: boolean = false;
exampleModal: boolean = false;
textoMensagem: string = "";
datePipe!: DatePipe;
condutor!: Condutor;
veiculo!: Veiculo;
tempo!: Tempo;
controleTempo!: ControleTempo;

condutorSelecionado!: Condutor;
veiculoSelecionado!: Veiculo;
tempoSelecionado!: ControleTempo;

controleDeTempos: ControleTempo[] = [];

listaDeCondutores: Condutor[] = [];
listaDeVeiculos: Veiculo[] = [];
listaDeTempos: Tempo[] = [];

  constructor(private service: TempoService, private condutorService: CondutorService, private veiculoService: VeiculoService) {
    this.tempo = new Tempo;
    this.tempoSelecionado = new ControleTempo;
  }

  ngOnInit(): void {
    this.getAllCondutores();
    this.getAllTempos();
    this.getAll();
  }

  getAllCondutores() {
    this.condutorService
      .getAll()
      .subscribe({
        next: (response) => {
          this.listaDeCondutores = response;
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  getAllTempos() {
    this.service
      .getListaDeTempos()
      .subscribe({
        next: (response) => {
          this.controleDeTempos = response;
          console.log('controleDeTempos' + JSON.stringify(response));
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }
  getAll() {
    this.service
      .getAll()
      .subscribe({
        next: (response) => {
          this.listaDeTempos = response;
          if (this.listaDeTempos && this.listaDeTempos.length > 0) {
            this.iniciarContadores();
          }
          console.log('response lista de tempos cadastrados: ' + JSON.stringify(this.listaDeTempos));
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  selecionarCondutor(id: number) {
    this.condutorSelecionado = this.listaDeCondutores.find(v => v.id == id)!;

    if (this.condutorSelecionado) {
      if (this.condutorSelecionado.veiculos && this.condutorSelecionado.veiculos.length > 0) {
        this.listaDeVeiculos = this.condutorSelecionado.veiculos;
        this.veiculoSelecionado = this.listaDeVeiculos[0];
      } else {
        this.veiculoSelecionado = new Veiculo();
      }
    } else {
      this.condutorSelecionado = new Condutor();
      this.veiculoSelecionado = new Veiculo();
    }
  }

  carregarVeiculosPorCondutor() {
    if (this.condutorSelecionado) {
        if (this.condutorSelecionado.veiculos) {
            this.listaDeVeiculos = this.condutorSelecionado.veiculos;
            this.veiculoSelecionado = this.listaDeVeiculos[0];
        } else {
            console.log('A lista de veículos do condutor não está carregada.');
        }
    } else {
        console.log('Nenhum condutor selecionado.');
    }
  }

  alterarTempo(tempo: Tempo, controleTempo: ControleTempo) {

    tempo.tempoRegistrado = controleTempo.name;
    tempo.dateTimeRegistrado = controleTempo.value;
    tempo.dataHoraInserido = this.fromStringTwo(controleTempo.name);
    tempo.dataHoraFinalizado = this.fromStringThree(controleTempo.name, controleTempo.atualiza);

    if (controleTempo.atualiza !== 4 && controleTempo.name === "Automático") {
      tempo.atualizacoes = tempo.atualizacoes + 1;
    }

    this.service
      .update(tempo)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Tempo alterado com sucesso.';
          this.tempo = new Tempo();
          this.getAll();
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  salvar(condutor: Condutor, veiculo: Veiculo, controleTempo: ControleTempo) {

    console.log('Entrou no Salvar');
    console.log('hora: ' + this.fromStringTwo(controleTempo.name));

    const tempoSalvar: Tempo = {
      id: this.tempo.id,
      condutor: condutor.id,
      veiculo: veiculo.id,
      tempoRegistrado: controleTempo.name,
      dateTimeRegistrado: controleTempo.value,
      dataHoraInserido: this.fromStringTwo(controleTempo.name),
      dataHoraFinalizado: this.fromStringThree(controleTempo.name, 1),
      atualizacoes: controleTempo.atualiza = 1
    };

    const tempoExistente = this.listaDeTempos.find(t => t.condutor === condutor.id && t.veiculo === veiculo.id);

    if (tempoExistente) {
      this.alterarTempo(tempoExistente, controleTempo);
    } else {
      console.log("ENTROU EM SALVAR: tempo -->" + JSON.stringify(tempoSalvar));
      this.service
        .add(tempoSalvar)
        .subscribe({
          next: (response) => {
            this.exibeMensagem = true;
            this.textoMensagem = 'Tempo cadastrado com sucesso.';
            this.tempo = new Tempo();
            this.listaDeTempos.push(response);
            this.getAll();
          },
          error: (responseError) => {
            this.exibeMensagem = true;
            this.textoMensagem = JSON.stringify(responseError.error);
            console.log('error: ' + JSON.stringify(responseError));
          }
        });
    }
  }

  fromStringTwo(name: String): String {
    const dataAtual: Date = new Date();
    const dataAtualFormatada: String = this.formatarData(dataAtual);
    return dataAtualFormatada;
  }

  fromStringThree(name: String, t: number): String {

      let horasAdicionar: number;
      const dataAtual: Date = new Date();
      const dataFutura: Date = new Date();

      if (name === "Automático" || name === "01:00 Horas") {
        horasAdicionar = 1;
      } else if (name === "Automático" && t === 2 || name === "02:00 Horas") {
        horasAdicionar = 2;
      } else if (name === "Automático" && t === 3 || name === "03:00 Horas") {
        horasAdicionar = 3;
      } else if (name === "Automático" && t === 4 || name === "04:00 Horas") {
        horasAdicionar = 4;
      } else  {
        horasAdicionar = 0;
      }

      dataFutura.setHours(dataAtual.getHours() + horasAdicionar);
      const dataFuturaFormatada: String = this.formatarData(dataFutura);
      return dataFuturaFormatada;
  }

  formatarData(data: Date): String {
      const dia = ('0' + data.getDate()).slice(-2);
      const mes = ('0' + (data.getMonth() + 1)).slice(-2);
      const ano = data.getFullYear();
      const hora = ('0' + data.getHours()).slice(-2);
      const minuto = ('0' + data.getMinutes()).slice(-2);
      const segundo = ('0' + data.getSeconds()).slice(-2);
      return `${dia}/${mes}/${ano} ${hora}h:${minuto}m:${segundo}s`;
  }

  iniciarContadores() {
  this.listaDeTempos.forEach(item => {
    const dataHoraRegistrado = moment(item.dataHoraInserido as moment.MomentInput, 'DD/MM/YYYY HH[h]:mm[m]:ss[s]');

    if (dataHoraRegistrado.isValid()) {
      const intervalo = setInterval(() => {
        const diferencaSegundos = moment().diff(dataHoraRegistrado, 'seconds');

        if (diferencaSegundos >= 1) {
          clearInterval(intervalo);
          this.exampleModal = true;
        }
      }, 1000);
    } else {
      console.error('A data e hora registradas não são válidas:', item.dataHoraInserido);
    }
  });
}

}
