import { Component, OnInit}  from '@angular/core';
import { SharedComponents } from '../../shared';
import { DatePipe } from '@angular/common';

import { Tempo } from '../../model/tempo/tempo';
import { ControleTempo } from '../../model/controle.tempo/controle.tempo';
import { TempoService } from '../../service/tempo/tempo.service';

import { Condutor } from '../../model/condutor/condutor';
import { CondutorService } from '../../service/condutor/condutor.service';

import { Veiculo } from '../../model/veiculo/veiculo';
import { VeiculoService } from '../../service/veiculo/veiculo.service';

import * as luxon from 'luxon';

@Component({
  selector: "app-cadastro-tempo",
  standalone: true,
  imports: [SharedComponents],
  templateUrl: "./cadastro-tempo.component.html",
  styleUrl: "./cadastro-tempo.component.css",
})
export class CadastroTempoComponent implements OnInit {
  exibeMensagem: boolean = false;
  exibeMensagem2: boolean = false;
  exampleModal: boolean = false;
  textoMensagem: string = "";
  datePipe!: DatePipe;
  condutor!: Condutor;
  veiculo!: Veiculo;
  tempo!: Tempo;
  controleTempo!: ControleTempo;

  condutorSelecionado!: Condutor;
  veiculoSelecionado!: Veiculo;
  controleSelecionado!: ControleTempo;
  tempoSelecionado!: Tempo;

  controleDeTempos: ControleTempo[] = [];

  listaDeCondutores: Condutor[] = [];
  listaDeVeiculos: Veiculo[] = [];
  listaDeTempos: Tempo[] = [];
  listaFinal: Tempo[] = [];

  constructor(
    private service: TempoService,
    private condutorService: CondutorService,
    private veiculoService: VeiculoService
  ) {
    this.tempo = new Tempo();
    this.controleSelecionado;
    this.tempoSelecionado = new Tempo();
  }

  ngOnInit(): void {
    this.getAllCondutores();
    this.getAllVeiculos();
    this.getAllTempos();
    this.getAll(); 
    setTimeout(() => {
      this.iniciarContadores();
    }, 3000);
    
  }

  openModal(): void {
    const modalElement: HTMLElement | null = document.getElementById("myModal");
    const bodyElement: HTMLElement | null =
      document.getElementById("efeito_modal");
    if (modalElement && bodyElement) {
      modalElement.className = "modal fade show";
      modalElement.style.display = "block";
      bodyElement.className = "modal-backdrop fade show";
    } else {
      console.error('Modal element with ID "myModal" not found.');
    }
  }

  closeModal(): void {
    const modalElement: HTMLElement | null = document.getElementById("myModal");
    const bodyElement: HTMLElement | null =
      document.getElementById("efeito_modal");
    if (modalElement && bodyElement) {
      modalElement.className = "modal fade";
      modalElement.style.display = "none";
      bodyElement.className = "";
    } else {
      console.error('Modal element with ID "myModal" not found.');
    }
  }

  getAllCondutores(): void {
    this.condutorService.getAll().subscribe({
      next: (response) => {
        this.listaDeCondutores = response;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  getAllVeiculos(): void {
    this.veiculoService.getAll().subscribe({
      next: (response) => {
        this.listaDeVeiculos = response;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  getAllTempos(): void {
    this.service.getListaDeTempos().subscribe({
      next: (response) => {
        this.controleDeTempos = response;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  getAll(): void {
    console.log("Peguei a Lista");
    const start = Date.now();
    this.service.getAll().subscribe({
      next: async (response) => {
        const end = Date.now();
        console.log("Tempo de execução: " + (end - start) + "ms");
        this.listaDeTempos = response;
        this.listaFinal = response;
        console.log("response: " + JSON.stringify(response));
        console.log(
          "listaDeTempos = response: " + JSON.stringify(this.listaDeTempos)
        );
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  selecionar(idC: number, idV: number): void {
    this.condutorSelecionado = this.listaDeCondutores.find((v) => v.id == idC)!;
    this.veiculoSelecionado = this.listaDeVeiculos.find((v) => v.id == idV)!;
    this.tempoSelecionado = this.listaDeTempos.find(
      (v) => v.condutor == idC && v.veiculo == idV
    )!;
  }

  verificaCondutor(): void {
    if (this.condutorSelecionado) {
      if (this.condutorSelecionado.veiculos) {
        this.listaDeVeiculos = this.condutorSelecionado.veiculos;
        this.veiculoSelecionado = this.listaDeVeiculos[0];
        this.tempoSelecionado = this.listaDeTempos.find(
          (v) =>
            v.condutor == this.condutorSelecionado.id &&
            v.veiculo == this.listaDeVeiculos[0].id
        )!;
      } else {
        console.log("A lista de veículos do condutor não está carregada.");
      }
    } else {
      console.log("Nenhum condutor selecionado.");
    }
  }

  verificaVeiculo(): void {
    if (this.condutorSelecionado) {
      if (this.veiculoSelecionado) {
        this.tempoSelecionado = this.listaDeTempos.find(
          (v) =>
            v.condutor == this.condutorSelecionado.id &&
            v.veiculo == this.veiculoSelecionado.id
        )!;
      } else {
        console.log("A lista de veículos do condutor não está carregada.");
      }
    } else {
      this.condutorSelecionado = this.listaDeCondutores.find((v) =>
        v.veiculos.some((v2) => v2.id == this.veiculoSelecionado.id)
      )!;
      this.tempoSelecionado = this.listaDeTempos.find(
        (v) =>
          v.condutor == this.condutorSelecionado.id &&
          v.veiculo == this.veiculoSelecionado.id
      )!;
    }
  }

  salvar(condutor: Condutor, veiculo: Veiculo, controleTempo: ControleTempo): void {
    this.closeModal();
    if (!condutor || !veiculo || !controleTempo) {
      this.exibeMensagem2 = true;
      if (!condutor) {
        this.textoMensagem = "Condutor não informado";
      } else if (!veiculo) {
        this.textoMensagem = "Veiculo não informado";
      } else if (!controleTempo) {
        this.textoMensagem = "Tempo não informado";
      }
    } else {
      const tempoSalvar: Tempo = {
        id: this.tempo.id,
        condutor: condutor.id,
        veiculo: veiculo.id,
        tempoRegistrado: controleTempo.name,
        dateTimeRegistrado: controleTempo.value,
        dataHoraInserido: this.fromStringTwo(controleTempo.name),
        dataHoraFinalizado: this.fromStringThree(controleTempo.name, 1),
        atualizacoes: (controleTempo.atualiza = 1),
      };

      console.log("TEMPO COMPLETO:" + JSON.stringify(tempoSalvar));

      this.exibeMensagem2 = false;
      const tempoExistente = this.listaDeTempos.find(
        (t) => t.condutor === condutor.id && t.veiculo === veiculo.id
      );

      if (tempoExistente) {
        this.alterarTempo(tempoExistente, controleTempo);
      } else {
        this.service.add(tempoSalvar).subscribe({
          next: (response) => {
            this.exibeMensagem = true;
            this.textoMensagem = "Tempo cadastrado com sucesso.";
            this.tempo = new Tempo();
            this.listaDeTempos.push(response);
            this.getAll();
            setTimeout(() => {
              this.iniciarContadores();
            }, 3000);
          },
          error: (responseError) => {
            this.exibeMensagem = true;
            this.textoMensagem = JSON.stringify(responseError.error);
            console.log("error: " + JSON.stringify(responseError));
          },
        });
      }
    }
  }

  alterarTempo(tempo: Tempo, controleTempo: ControleTempo): void {
    if (tempo.atualizacoes !== 5) {
      tempo.tempoRegistrado = controleTempo.name;
      tempo.dateTimeRegistrado = controleTempo.value;
      tempo.dataHoraInserido = this.fromStringTwo(controleTempo.name);
      tempo.atualizacoes = tempo.atualizacoes + 1;
      tempo.dataHoraFinalizado = this.fromStringThree(
        controleTempo.name,
        tempo.atualizacoes
      );

      if (!tempo) {
        this.exibeMensagem = true;
        this.textoMensagem = "Problema ao alterar o tempo, tente novamente.";
      }
      this.service.update(tempo).subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = "Tempo alterado com sucesso.";
          this.tempo = new Tempo();
          this.listaDeTempos.push(response);
          this.getAll();
          setTimeout(() => {
            this.iniciarContadores();
          }, 3000);
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log("error: " + JSON.stringify(responseError));
        },
      });
    } else {
      this.exibeMensagem = true;
      this.textoMensagem = "Não pode mais adicionar tempo.";
    }
  }

  acabaTempo(tempo: Tempo): void {
    this.closeModal();
    if (tempo.id === undefined || !Number.isInteger(tempo.id)) {
      this.exibeMensagem = true;
      this.textoMensagem = "ID do tempo não definido ou inválido.";
      return;
    }

    this.service.delete(tempo.id).subscribe({
      next: (response) => {
        this.exibeMensagem = true;
        //this.textoMensagem = "Tempo Deletado com sucesso.";
        //this.tempo = new Tempo();
        this.listaDeTempos.push(response);
        this.getAll();
      },
      error: (responseError) => {
        this.exibeMensagem = true;
        this.textoMensagem = JSON.stringify(responseError.error);
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  fromStringTwo(name: string): string {
    const dataAtual = luxon.DateTime.local();
    const dataAtualFormatada = this.formatarData(dataAtual.toJSDate());
    return dataAtualFormatada;
  }

  fromStringThree(name: string, t: number): string {
    let horasAdicionar: number;
    let dataAtual = luxon.DateTime.local();
    let dataFutura = luxon.DateTime.local();

    if ((name === "Automático" && t === 1) || name === "01:00 Horas") {
      horasAdicionar = 1;
    } else if ((name === "Automático" && t === 2) || name === "02:00 Horas") {
      horasAdicionar = 2;
    } else if ((name === "Automático" && t === 3) || name === "03:00 Horas") {
      horasAdicionar = 3;
    } else if ((name === "Automático" && t === 4) || name === "04:00 Horas") {
      horasAdicionar = 4;
    } else {
      horasAdicionar = 0;
    }

    dataFutura = dataAtual.plus({ hours: horasAdicionar });
    const dataFuturaFormatada = this.formatarData(dataFutura.toJSDate());
    return dataFuturaFormatada;
  }

  formatarData(data: Date): string {
    const dia = ("0" + data.getDate()).slice(-2);
    const mes = ("0" + (data.getMonth() + 1)).slice(-2);
    const ano = data.getFullYear();
    const hora = ("0" + data.getHours()).slice(-2);
    const minuto = ("0" + data.getMinutes()).slice(-2);
    const segundo = ("0" + data.getSeconds()).slice(-2);
    return `${dia}/${mes}/${ano} ${hora}h:${minuto}m:${segundo}s`;
  }

  verificarTempo(condutorId: number, veiculoId: number): boolean {
    console.log(condutorId, veiculoId);
    if (this.listaDeTempos && this.listaDeTempos.length > 0) {
      return this.listaDeTempos.some(
        (itemtempo) =>
          itemtempo.condutor === condutorId && itemtempo.veiculo === veiculoId
      );
    }
    return false;
  }

  iniciarContadores(): void {
  
    if (this.listaFinal && this.listaFinal.length > 0) {
      const temposComDiferenca = this.listaFinal.map((tempo) => {
        let dataAtual = luxon.DateTime.local();
        let dataHoraSemUnidades = tempo.dataHoraInserido.replace(/[hms]/g, "");
        let dataHoraRegistrado = luxon.DateTime.fromFormat(dataHoraSemUnidades, "dd/mm/yyyy hh:mm:ss");
        let diferenca = dataAtual.diff(dataHoraRegistrado, "seconds").seconds;
        return {
          tempo: tempo,
          diferenca: diferenca,
        };
      });

      temposComDiferenca.forEach((tempo) => {
        if (tempo.diferenca >= 1) {
          this.openModal();
        }
      });
    }
  }
}
