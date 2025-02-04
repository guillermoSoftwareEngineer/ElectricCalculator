import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculadoraComponent } from './calculadora/calculadora.component';

@Component({
  selector: 'app-root',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, CalculadoraComponent], // Importa CalculadoraComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calculadora-reactiva';
}
