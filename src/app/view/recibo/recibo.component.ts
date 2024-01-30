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
            },
            error: (responseError) => {
                console.log("error: " + JSON.stringify(responseError));
            },
        });
    }

    buscarCondutor(idC:number, idV:number):void{
        this.condutorSelecionado = this.listaDeCondutores.find((v) => v.id == idC)!;
        this.veiculoSelecionado = this.listaDeVeiculos.find((v) => v.id == idV)!;
    }

    getListaDeCondutores(): void {
        this..getAll().subscribe({
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



}

