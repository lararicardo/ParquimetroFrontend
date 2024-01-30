import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-recibo',
  standalone: true,
  imports: [],
  templateUrl: './recibo.component.html',
  styleUrl: './recibo.component.css'
})
export class ReciboComponent implements OnInit {

  pagamentoId!: number;

  constructor( 
   private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pagamentoId= +(this.route.snapshot.paramMap.get("id") || 0)   
    }
  
}