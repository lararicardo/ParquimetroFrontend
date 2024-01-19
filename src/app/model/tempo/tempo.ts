import { Condutor } from "../condutor/condutor";
import { Veiculo } from "../veiculo/veiculo";
import { ControleTempo } from "../tempo/controle.tempo";

export class Tempo {
  id!: number;
  listaDeCondutores!: Condutor[];
  listaDeVeiculos!: Veiculo[];
  tempoRegistrado!: String;
}