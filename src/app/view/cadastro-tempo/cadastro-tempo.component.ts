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
//import { LuxonModule } from "@angular-luxon/angular";

import * as luxon from 'luxon';

@Component({
  selector: "app-cadastro-tempo",
  standalone: true,
  imports: [SharedComponents],
  //LuxonModule,
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

  tempoReal: Date = new Date();
  itemtempo: any;
  timer: any;

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
        this.listaDeTempos = response;
        this.listaFinal = response;
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

  AtualizarCondutor(condutor: Condutor, veiculo: Veiculo, tempo: Tempo) {
    this.closeModal();

    const controleTempo: ControleTempo = {
      name: tempo.tempoRegistrado,
      value: tempo.dateTimeRegistrado,
      valuetwo: tempo.dataHoraInserido,
      valuethree: tempo.dataHoraFinalizado,
      atualiza: tempo.atualizacoes,
    };

    this.salvar(condutor, veiculo, controleTempo);
  }

  salvar(
    condutor: Condutor,
    veiculo: Veiculo,
    controleTempo: ControleTempo
  ): void {
    console.log("Entrou no salvar");

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
      if (!controleTempo.valuetwo) {
        console.log("entrou no alterar data inicial");
        controleTempo.valuetwo = this.fromStringTwo();
      }
      controleTempo = this.fromStringThree(controleTempo, 1);

      const tempoSalvar: Tempo = {
        id: this.tempo.id,
        condutor: condutor.id,
        veiculo: veiculo.id,
        tempoRegistrado: controleTempo.name,
        dateTimeRegistrado: controleTempo.value,
        dataHoraInserido: controleTempo.valuetwo,
        dataHoraFinalizado: controleTempo.valuethree,
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
    tempo.atualizacoes = tempo.atualizacoes + 1;
    controleTempo = this.fromStringThree(controleTempo, tempo.atualizacoes);

    tempo.tempoRegistrado = controleTempo.name;
    tempo.dateTimeRegistrado = controleTempo.value;
    tempo.dataHoraInserido = controleTempo.valuetwo;
    tempo.dataHoraFinalizado = controleTempo.valuethree;

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
  }

  Jeff(tempo: Tempo): void {
    this.closeModal();
    console.log("Tempo: " + JSON.stringify(tempo));
    if (tempo.id === undefined || !Number.isInteger(tempo.id)) {
      this.exibeMensagem = true;
      this.textoMensagem = "ID do tempo não definido ou inválido.";
      return;
    }

    this.service.delete(tempo.id).subscribe({
      next: (response) => {
        this.exibeMensagem = true;
        this.textoMensagem = "Tempo Deletado com sucesso.";
        this.tempo = new Tempo();
        this.listaDeTempos.push(response);
        this.getAll();
        location.reload();
      },
      error: (responseError) => {
        this.exibeMensagem = true;
        this.textoMensagem = JSON.stringify(responseError.error);
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  fromStringTwo(): string {
    const dataAtual = luxon.DateTime.local();
    const dataAtualFormatada = this.formatarData(dataAtual.toJSDate());
    return dataAtualFormatada;
  }

  fromStringThree(
    controleTempo: ControleTempo,
    tentativas: number
  ): ControleTempo {
    let horasAdicionar: number;
    let dataHoraSemUnidades = controleTempo.valuetwo.replace(/[hms]/g, "");
    let dataHoraRegistrado = luxon.DateTime.fromFormat(
      dataHoraSemUnidades,
      "dd/mm/yyyy hh:mm:ss"
    );
    let dataFutura;

    console.log("controleTempo.valuetwo::::::" + controleTempo.valuetwo);
    console.log("dataHoraSemUnidades:::::::::" + dataHoraSemUnidades);
    console.log("dataHoraRegistrado::::::::::" + dataHoraRegistrado);
    console.log("tentativas::::::::::::::::::" + tentativas);

    if (tentativas > 1) {
      horasAdicionar = tentativas;
      console.log("Possui Atribuição");
      switch (controleTempo.name) {
        case "01:00 Hora":
          controleTempo.name = "02:00 Horas";
          break;
        case "02:00 Horas":
          controleTempo.name = "03:00 Horas";
          break;
        case "03:00 Horas":
          controleTempo.name = "04:00 Horas";
          break;
        case "04:00 Horas":
          controleTempo.name = "Automático";
          break;
        default:
          controleTempo.name = "Automático";
      }
      dataFutura = dataHoraRegistrado.plus({ hours: horasAdicionar });
      controleTempo.valuethree = this.formatarData(dataFutura.toJSDate());
    } else {
      console.log("Primeira Atribuição");

      switch (controleTempo.name) {
        case "01:00 Hora":
          horasAdicionar = 1;
          break;
        case "02:00 Horas":
          horasAdicionar = 2;
          break;
        case "03:00 Horas":
          horasAdicionar = 3;
          break;
        case "04:00 Horas":
          horasAdicionar = 4;
          break;
        default:
          horasAdicionar = 1;
      }
      dataFutura = dataHoraRegistrado.plus({ hours: horasAdicionar });
      controleTempo.valuethree = this.formatarData(dataFutura.toJSDate());
    }

    return controleTempo;
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

  formatarHora(dataString: string): string {
    const parts = dataString.split(/[\s/:\h:m:s]/);
    console.log(parts);
    const hora = parts[3];
    const minuto = parts[5];
    const segundo = parts[7];
    return `${hora}h:${minuto}m:${segundo}s`;
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
        let dataHoraRegistrado = luxon.DateTime.fromFormat(
          dataHoraSemUnidades,
          "dd/mm/yyyy hh:mm:ss"
        );
        let diferenca = dataAtual.diff(dataHoraRegistrado, "seconds").seconds;
        
        return {
          tempo: tempo,
          diferenca: diferenca
        };
      });

      temposComDiferenca.forEach((tempo) => {
        if (tempo.diferenca >= 3600) {
          this.openModal();
        }
      });
    }
  }
}