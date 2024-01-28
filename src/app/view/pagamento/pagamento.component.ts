import { Component, OnInit } from '@angular/core';
import { SharedComponents } from '../../shared';
import { Pagamento } from '../../model/pagamento/pagamento';
import { Tempo } from '../../model/tempo/tempo';
import { TempoService } from '../../service/tempo/tempo.service';
import { ControleTempo } from '../../model/controle.tempo/controle.tempo';
import { PagamentoService } from '../../service/pagamento/pagamento.service';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [SharedComponents],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.css'
})
export class PagamentoComponent implements OnInit {

  exibeMensagem: boolean = false;
  textoMensagem: string = "";

  pagamento!: Pagamento;
  listaDePagamentos: Pagamento[] = [];
  tempo!: Tempo;
  controleDeTempos: Tempo[] = [];

  formadePagamento: string[] = [];

  tempoSelecionado!: Tempo;
  listaDeTempos!: Tempo[];
  listaFinal!: Tempo[];

  constructor(
    private service: PagamentoService,
    private tempoService: TempoService
  ) {
    this.pagamento = new Pagamento();
  }

  getAllTempos() {
    this.tempoService.getAll().subscribe({
      next: (response) => {
        this.controleDeTempos = response;
        console.log("responseTempo: " + JSON.stringify(response));
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  getAllFormaDePagamento() {
    this.service
    .getAllFormaDePagamento()
    .subscribe({
      next: (response) => {
        this.formadePagamento = response;
      },
      error: (responseError) => {
        console.log('error: ' + JSON.stringify(responseError));
      }
    });
  }

  ngOnInit(): void {
      this.getAllTempos();
      this.getAllFormaDePagamento();
  }

   realizacaoPagamento(tempoIni: Tempo, tempoFim: Tempo) {
    
    var inicio = tempoIni.dataHoraInserido
    var inicioInt = Number(inicio)
    var fim = tempoFim.dataHoraFinalizado
    var fimInt = Number(fim)

    var pagamentoFinal = (fimInt - inicioInt) * 15;

    return pagamentoFinal;
   }

  salvar( tempo: Tempo) {

   // constpagamentoSalvar: Pagamento = {
   //   id: this.pagamento.id,
   //   tempo: this.tempo.id,
   //   pagamento: this.realizacaoPagamento(tempo.dataHoraInserido, tempo.dataHoraFinalizado),
   // };

    this.service
    .add(this.pagamento)
    .subscribe({
      next: (response) => {
        this.exibeMensagem = true;
        this.textoMensagem = 'Pagamento realizado com sucesso.';
        this.pagamento = new Pagamento;
        this.listaDePagamentos.push(response);
      },
      error: (responseError) => {
        this.exibeMensagem = true;
        this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
      }
    });
  }

}
