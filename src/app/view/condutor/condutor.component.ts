import { Component, OnInit } from '@angular/core';
import { SharedComponents } from '../../shared';
import { Condutor } from '../../model/condutor/condutor';
import { CondutorService } from '../../service/condutor/condutor.service';

@Component({
  selector: 'app-condutor',
  standalone: true,
  imports: [SharedComponents],
  templateUrl: './condutor.component.html',
  styleUrl: './condutor.component.css'
})
export class CondutorComponent implements OnInit  {

  exibeMensagem: boolean = false;
  textoMensagem: string = "";

  condutor: Condutor;
  condutorSelecionado: Condutor;
  listaDeCondutores: Condutor[] = [];

  constructor(private service: CondutorService) {
    this.condutor = new Condutor;
    this.condutorSelecionado = new Condutor;
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.service
      .getAll()
      .subscribe({
        next: (response) => {
          this.listaDeCondutores = response;
          console.log('next: ' + response);
        },
        error: (responseError) => {
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  excluir() {
    this.service
      .deletar(this.condutor.id)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Veículo excluído com sucesso.';
          this.listaDeCondutores.splice(this.listaDeCondutores.indexOf(this.condutor), 1);
          this.condutor = new Condutor;
        },
        error: (responseError) => {
          this.exibeMensagem = false;
          console.log('error: ' + JSON.stringify(responseError));
        }
      });

  }

  alterar() {
    this.service
      .update(this.condutor)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Veículo alterado com sucesso.';
          this.condutor = new Condutor;
          this.getAll();
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
  }

  pesquisar(nome: string) {
    
  }

  salvar() {
    //console.log(JSON.stringify(this.condutor));

    if(this.condutor.id){
      this.alterar();
    }else{
      this.service
      .add(this.condutor)
      .subscribe({
        next: (response) => {
          this.exibeMensagem = true;
          this.textoMensagem = 'Veículo cadastrado com sucesso.';
          this.condutor = new Condutor;
          this.listaDeCondutores.push(response);
        },
        error: (responseError) => {
          this.exibeMensagem = true;
          this.textoMensagem = JSON.stringify(responseError.error);
          console.log('error: ' + JSON.stringify(responseError));
        }
      });
    }
  }

  selecionarCondutor(id: number) {
    this.condutorSelecionado = {...this.listaDeCondutores.find(v => v.id == id)!};
    this.condutor = this.condutorSelecionado;
  }


  novo(){
    this.condutorSelecionado = new Condutor;
    this.condutor = new Condutor;
  }

}
