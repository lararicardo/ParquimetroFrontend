import { Component, OnInit } from '@angular/core';
import { SharedComponents } from '../../shared';
import { Pagamento } from '../../model/pagamento/pagamento';
import { Tempo } from '../../model/tempo/tempo';
import { TempoService } from '../../service/tempo/tempo.service';
import { ControleTempo } from '../../model/controle.tempo/controle.tempo';
import { PagamentoService } from '../../service/pagamento/pagamento.service';
import { CondutorService } from '../../service/condutor/condutor.service';
import { Condutor } from '../../model/condutor/condutor';
import { VeiculoService } from '../../service/veiculo/veiculo.service';
import { Veiculo } from '../../model/veiculo/veiculo';
import { ActivatedRoute, Router } from '@angular/router';
import * as luxon from 'luxon';

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

  pagamento: Pagamento = new Pagamento();
  condutor!: Condutor;
  veiculo!: Veiculo;
  tempo!: Tempo;

  formasPagamento: string[] = [];

  listaDePagamentos: Pagamento[] = [];
  
  controleSelecionado!: ControleTempo;


  idTempo: Number = 0;

  valorPagoFormatado!: string;

  constructor(
    private service: PagamentoService,
    private tempoService: TempoService,
    private condutorService: CondutorService,
    private veiculoService: VeiculoService,
    private route: ActivatedRoute

  ) {}

  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    this.idTempo = params['id'];
    console.log('Valor do parâmetro "id" da URL:', this.idTempo); });
    this.getAllTempos();
}

  getAllTempos() {
     this.tempoService.getAll().subscribe({
      next: (response) => {
        this.tempo = response.find((t) => t.id == this.idTempo)!;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },complete: () => {
          this.getAllCondutores();
          this.getAllVeiculos();
          this.calcularTempoUtilizado();
          this.getAllFormasPagamento();
      }
    });
  }
  getAllCondutores() {
    this.condutorService.getAll().subscribe({
      next: (response) => {
        this.condutor = response.find((c) => c.id == this.tempo.condutor)!;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  getAllVeiculos() {
    this.veiculoService.getAll().subscribe({
      next: (response) => {
        this.veiculo = response.find((v) => v.id == this.tempo.veiculo)!;
      },
      error: (responseError) => {
        console.log("error: " + JSON.stringify(responseError));
      },
    });
  }

  calcularTempoUtilizado() {
    const { dataHoraInserido, dataHoraFinalizado } = this.tempo;
    this.pagamento.tempoUtilizado = luxon.DateTime.fromFormat(dataHoraFinalizado.replace(/[hms]/g, ""), "dd/mm/yyyy hh:mm:ss").hour - 
      luxon.DateTime.fromFormat(dataHoraInserido.replace(/[hms]/g, ""), "dd/mm/yyyy hh:mm:ss").hour;

    this.pagamento.valorPago = this.pagamento.tempoUtilizado * 15.0;
    this.valorPagoFormatado = this.pagamento.valorPago.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"});
  }

  getAllFormasPagamento() {
    this.service
    .getAllFormaDePagamento()
    .subscribe({
      next: (response) => {
        this.formasPagamento = response;
      },
      error: (responseError) => {
        console.log('error: ' + JSON.stringify(responseError));
      }, complete: () => {
        if(this.tempo.tempoRegistrado == "Automático") {
          this.formasPagamento.shift();
        }
      }
    });
  }

  salvar() {
    console.log(this.pagamento);
    this.service
    .add(this.pagamento)
    .subscribe({
      next: (response) => {
        this.exibeMensagem = true;
        this.textoMensagem = 'Pagamento realizado com sucesso.';
      },
      error: (responseError) => {
        this.exibeMensagem = true;
        this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
      }
    });
  }

  abrirRecibo() {
    //this.idPagamento = this.idPagamentoSelecionado;
    // Abre a tela de recibos
    // ...
  }

}