import { Veiculo } from "../veiculo/veiculo";

export class Condutor {
    id!: number;
    nomeCompleto!: string;
    email!: string;
    cpf!: string;
    celular!: string;
    listaVeiculos!: Veiculo[];
    dataCadastro!: Date;
}
