<<<<<<< Updated upstream
import {Component, numberAttribute, OnInit} from '@angular/core';
import {TempoService} from "../../service/tempo/tempo.service";
import {Tempo} from "../../model/tempo/tempo";
import {Condutor} from "../../model/condutor/condutor";
import {Veiculo} from "../../model/veiculo/veiculo";
import {CondutorService} from "../../service/condutor/condutor.service";
import {VeiculoService} from "../../service/veiculo/veiculo.service";


@Component({
    selector: 'app-recibo',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {

    id!: number;
    nomeCondutor: string;
    placaVeiculo: string;
    valorPagamento: number;
    tipoPagamento: string;
    formaPagamento: string;
    tipoEstacionamento: string;
    horaInicial: string;
    horaFinal: string;

    condutorSelecionado!: Condutor;
    veiculoSelecionado!: Veiculo;
    listaDeCondutores: Condutor[] = [];
    listaDeVeiculos: Veiculo[] = [];

    tempo!: Tempo;

    constructor(private temposService: TempoService, private condutorService: CondutorService, private veiculoService: VeiculoService) { }

    ngOnInit() {
       this.carregarDados(this.id);
    }

    carregarDados(id:number): void {
        this.temposService.getTempoById(id).subscribe({
            next: (response) => {
                this.tempo = response;
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {PagamentoService} from "../../service/pagamento/pagamento.service";
import {TempoService} from "../../service/tempo/tempo.service";
import {CondutorService} from "../../service/condutor/condutor.service";
import {VeiculoService} from "../../service/veiculo/veiculo.service";
import {Pagamento} from "../../model/pagamento/pagamento";
import {Tempo} from "../../model/tempo/tempo";
import {Condutor} from "../../model/condutor/condutor";
import {Veiculo} from "../../model/veiculo/veiculo";


@Component({
  selector: 'app-recibo',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.css'
})
export class ReciboComponent implements OnInit {

  pagamentoId!: number;
  pagamento: Pagamento = new Pagamento();
  tempo: Tempo = new Tempo();
  condutor: Condutor = new Condutor();
  veiculo: Veiculo = new Veiculo();

  constructor(
      private route: ActivatedRoute,
      private service: PagamentoService,
      private tempoService: TempoService,
      private condutorService: CondutorService,
      private pagamentoService: PagamentoService,
      private veiculoService: VeiculoService,

  ) {

  }
   ngOnInit(): void {
    this.pagamentoId= +(this.route.snapshot.paramMap.get("id") || 0);
       this.getPagamento();
       this.getTempo();
       this.getVeiculo();
       this.getCondutor();
    }

    getPagamento() {
        this.pagamentoService.getAll().subscribe({
            next: (response) => {
                this.pagamento = response.find((c) => c.id == this.pagamentoId)!;
>>>>>>> Stashed changes
            },
            error: (responseError) => {
                console.log("error: " + JSON.stringify(responseError));
            },
        });
    }

<<<<<<< Updated upstream
    buscarCondutor(idC:number, idV:number):void{
        this.condutorSelecionado = this.listaDeCondutores.find((v) => v.id == idC)!;
        this.veiculoSelecionado = this.listaDeVeiculos.find((v) => v.id == idV)!;
    }

    getListaDeCondutores(): void {
        this..getAll().subscribe({
            next: (response) => {
                this.listaDeCondutores = response;
=======
    getTempo() {
        this.tempoService.getAll().subscribe({
            next: (response) => {
                this.tempo = response.find((c) => c.id == this.pagamento.tempoId)!;
>>>>>>> Stashed changes
            },
            error: (responseError) => {
                console.log("error: " + JSON.stringify(responseError));
            },
        });
    }

<<<<<<< Updated upstream
    getAllVeiculos(): void {
        this.veiculoService.getAll().subscribe({
            next: (response) => {
                this.listaDeVeiculos = response;
=======
    getCondutor() {
        this.condutorService.getAll().subscribe({
            next: (response) => {
                this.condutor = response.find((c) => c.id == this.tempo.condutor)!;
            },
            error: (responseError) => {
                console.log("error: " + JSON.stringify(responseError));
            },
        });
    }

    getVeiculo() {
        this.veiculoService.getAll().subscribe({
            next: (response) => {
                this.veiculo = response.find((c) => c.id == this.tempo.veiculo)!;
>>>>>>> Stashed changes
            },
            error: (responseError) => {
                console.log("error: " + JSON.stringify(responseError));
            },
        });
    }

<<<<<<< Updated upstream


}

=======
}
>>>>>>> Stashed changes
