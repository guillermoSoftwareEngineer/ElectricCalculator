import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de la interfaz para las ecuaciones
interface Equation {
  formula: string;
  variables: string[]; // Ejemplo: ["V", "R"], ["V", "cos(φ)", "I"], etc.
  compute: (inputs: { [key: string]: number }) => number;
}

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements AfterViewInit {
  // Opciones principales
  opcionesPrincipales: string[] = [
    'Sistemas monofásicos',
    'Sistemas trifásicos',
    'Análisis AC coseno de φ', // Cambiado de "cos φ (phi)" a "Análisis AC coseno de φ"
    'Análisis AC velocidad angular',
    'Análisis AC General'
  ];

  // Subopciones para cada opción principal
  subopciones: { [key: string]: string[] } = {
    'Sistemas monofásicos': ['Vatios', 'Resistencia', 'Corriente', 'Voltaje'],
    'Sistemas trifásicos': ['Vatios', 'Resistencia', 'Corriente', 'Voltaje'],
    'Análisis AC coseno de φ': ['Potencia', 'VA', 'Corriente', 'Resistencia', 'Voltaje', 'coseno de φ'], // Cambiado de "Factor de Potencia" a "coseno de φ"
    'Análisis AC velocidad angular': ['Frecuencia Angular (ω)', 'Reactancia Inductiva (XL)', 'Reactancia Capacitiva (XC)', 'Impedancia (Z)'],
    'Análisis AC General': ['KVAR', 'KW', 'KVA', 'X', 'I', 'V', 'R', 'W', 'tan(φ)', 'cos(φ)', 'sen(φ)']
  };

  // Variables de selección
  opcionSeleccionada: string | null = null;
  subopcionSeleccionada: string | null = null;
  subsubopcionSeleccionada: string | null = null;

  // Variables del formulario
  formulario: { [key: string]: number | null } = { input1: null, input2: null, input3: null };

  // Resultado del cálculo
  resultado: number | null = null;

  // Unidad del resultado
  unidad: string = '';

  // Ecuación seleccionada
  selectedEquation: Equation | null = null;

  // Definición de las ecuaciones
  monofasicoEquations: { [sub: string]: Equation[] } = {
    'Vatios': [
      { formula: "W = V² / R", variables: ["V", "R"], compute: (inp) => Math.pow(+inp["V"], 2) / +inp["R"] },
      { formula: "W = I² * R", variables: ["I", "R"], compute: (inp) => Math.pow(+inp["I"], 2) * +inp["R"] },
      { formula: "W = V * I", variables: ["V", "I"], compute: (inp) => +inp["V"] * +inp["I"] }
    ],
    'Resistencia': [
      { formula: "R = V / I", variables: ["V", "I"], compute: (inp) => +inp["V"] / +inp["I"] },
      { formula: "R = V² / W", variables: ["V", "W"], compute: (inp) => Math.pow(+inp["V"], 2) / +inp["W"] },
      { formula: "R = W / I²", variables: ["W", "I"], compute: (inp) => +inp["W"] / Math.pow(+inp["I"], 2) }
    ],
    'Corriente': [
      { formula: "I = V / R", variables: ["V", "R"], compute: (inp) => +inp["V"] / +inp["R"] },
      { formula: "I = W / V", variables: ["W", "V"], compute: (inp) => +inp["W"] / +inp["V"] },
      { formula: "I = sqrt(W / R)", variables: ["W", "R"], compute: (inp) => Math.sqrt(+inp["W"] / +inp["R"]) }
    ],
    'Voltaje': [
      { formula: "V = I * R", variables: ["I", "R"], compute: (inp) => +inp["I"] * +inp["R"] },
      { formula: "V = W / I", variables: ["W", "I"], compute: (inp) => +inp["W"] / +inp["I"] },
      { formula: "V = sqrt(W * R)", variables: ["W", "R"], compute: (inp) => Math.sqrt(+inp["W"] * +inp["R"]) }
    ]
  };

  trifasicoEquations: { [sub: string]: Equation[] } = {
    'Vatios': [
      { formula: "W = V * I * sqrt(3)", variables: ["V", "I"], compute: (inp) => +inp["V"] * +inp["I"] * Math.sqrt(3) },
      { formula: "W = V² / (R * sqrt(3))", variables: ["V", "R"], compute: (inp) => Math.pow(+inp["V"], 2) / (+inp["R"] * Math.sqrt(3)) },
      { formula: "W = I² * R * sqrt(3)", variables: ["I", "R"], compute: (inp) => Math.pow(+inp["I"], 2) * +inp["R"] * Math.sqrt(3) }
    ],
    'Resistencia': [
      { formula: "R = V / I", variables: ["V", "I"], compute: (inp) => +inp["V"] / +inp["I"] },
      { formula: "R = V² / W", variables: ["V", "W"], compute: (inp) => Math.pow(+inp["V"], 2) / +inp["W"] },
      { formula: "R = W / I²", variables: ["W", "I"], compute: (inp) => +inp["W"] / Math.pow(+inp["I"], 2) }
    ],
    'Corriente': [
      { formula: "I = V / (R * sqrt(3))", variables: ["V", "R"], compute: (inp) => +inp["V"] / (+inp["R"] * Math.sqrt(3)) },
      { formula: "I = W / (V * sqrt(3))", variables: ["W", "V"], compute: (inp) => +inp["W"] / (+inp["V"] * Math.sqrt(3)) },
      { formula: "I = sqrt(W / (R * sqrt(3)))", variables: ["W", "R"], compute: (inp) => Math.sqrt(+inp["W"] / (+inp["R"] * Math.sqrt(3))) }
    ],
    'Voltaje': [
      { formula: "V = I * R * sqrt(3)", variables: ["I", "R"], compute: (inp) => +inp["I"] * +inp["R"] * Math.sqrt(3) },
      { formula: "V = W / (I * sqrt(3))", variables: ["W", "I"], compute: (inp) => +inp["W"] / (+inp["I"] * Math.sqrt(3)) },
      { formula: "V = sqrt(W * R * sqrt(3))", variables: ["W", "R"], compute: (inp) => Math.sqrt(+inp["W"] * +inp["R"] * Math.sqrt(3)) }
    ]
  };

  acTrifasicoEquations: { [sub: string]: Equation[] } = {
    'Potencia': [
      { formula: "W = V * I * cos(φ)", variables: ["V", "I", "cos(φ)"], compute: (inp) => +inp["V"] * +inp["I"] * +inp["cos(φ)"] },
      { formula: "W = VA * cos(φ)", variables: ["VA", "cos(φ)"], compute: (inp) => +inp["VA"] * +inp["cos(φ)"] },
      { formula: "W = (V * cos(φ))² / R", variables: ["V", "cos(φ)", "R"], compute: (inp) => Math.pow(+inp["V"] * +inp["cos(φ)"], 2) / +inp["R"] }
    ],
    'VA': [
      { formula: "VA = V * I", variables: ["V", "I"], compute: (inp) => +inp["V"] * +inp["I"] },
      { formula: "VA = W / cos(φ)", variables: ["W", "cos(φ)"], compute: (inp) => +inp["W"] / +inp["cos(φ)"] },
      { formula: "VA = I² * R / cos(φ)", variables: ["I", "R", "cos(φ)"], compute: (inp) => (Math.pow(+inp["I"], 2) * +inp["R"]) / +inp["cos(φ)"] }
    ],
    'Corriente': [
      { formula: "I = V * cos(φ) / R", variables: ["V", "cos(φ)", "R"], compute: (inp) => (+inp["V"] * +inp["cos(φ)"]) / +inp["R"] },
      { formula: "I = W / (V * cos(φ))", variables: ["W", "V", "cos(φ)"], compute: (inp) => +inp["W"] / (+inp["V"] * +inp["cos(φ)"]) },
      { formula: "I = VA / V", variables: ["VA", "V"], compute: (inp) => +inp["VA"] / +inp["V"] }
    ],
    'Resistencia': [
      { formula: "R = (V * cos(φ)) / I", variables: ["V", "cos(φ)", "I"], compute: (inp) => (+inp["V"] * +inp["cos(φ)"]) / +inp["I"] },
      { formula: "R = (VA * cos(φ)) / I²", variables: ["VA", "cos(φ)", "I"], compute: (inp) => (+inp["VA"] * +inp["cos(φ)"]) / Math.pow(+inp["I"], 2) },
      { formula: "R = (V * cos(φ))² / W", variables: ["V", "cos(φ)", "W"], compute: (inp) => Math.pow(+inp["V"] * +inp["cos(φ)"], 2) / +inp["W"] }
    ],
    'Voltaje': [
      { formula: "V = VA / I", variables: ["VA", "I"], compute: (inp) => +inp["VA"] / +inp["I"] },
      { formula: "V = (I * R) / cos(φ)", variables: ["I", "R", "cos(φ)"], compute: (inp) => (+inp["I"] * +inp["R"]) / +inp["cos(φ)"] },
      { formula: "V = W / (I * cos(φ))", variables: ["W", "I", "cos(φ)"], compute: (inp) => +inp["W"] / (+inp["I"] * +inp["cos(φ)"]) }
    ],
    'coseno de φ': [
      { formula: "cos(φ) = W / (V * I)", variables: ["W", "V", "I"], compute: (inp) => +inp["W"] / (+inp["V"] * +inp["I"]) },
      { formula: "cos(φ) = W / VA", variables: ["W", "VA"], compute: (inp) => +inp["W"] / +inp["VA"] },
      { formula: "cos(φ) = (I² * R) / VA", variables: ["I", "R", "VA"], compute: (inp) => (Math.pow(+inp["I"], 2) * +inp["R"]) / +inp["VA"] }
    ]
  };

  acVelocidadEquations: { [sub: string]: Equation[] } = {
    'Frecuencia Angular (ω)': [
      { formula: "ω = 2 * π * f", variables: ["f"], compute: (inp) => 2 * Math.PI * (+inp["f"]) },
      { formula: "ω = 2 * 3.1416 * f", variables: ["f"], compute: (inp) => 2 * 3.1416 * (+inp["f"]) }
    ],
    'Reactancia Inductiva (XL)': [
      { formula: "XL = 2 * π * f * L", variables: ["f", "L"], compute: (inp) => 2 * Math.PI * (+inp["f"]) * (+inp["L"]) },
      { formula: "XL = ω * L", variables: ["ω", "L"], compute: (inp) => (+inp["ω"]) * (+inp["L"]) }
    ],
    'Reactancia Capacitiva (XC)': [
      { formula: "XC = 1 / (2 * π * f * C)", variables: ["f", "C"], compute: (inp) => 1 / (2 * Math.PI * (+inp["f"]) * (+inp["C"])) },
      { formula: "XC = 1 / (ω * C)", variables: ["ω", "C"], compute: (inp) => 1 / ((+inp["ω"]) * (+inp["C"])) }
    ],
    'Impedancia (Z)': [
      { formula: "Z = R + j(XL - XC)", variables: ["R", "XL", "XC"], compute: (inp) => Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2)) },
      { formula: "Z = sqrt(R² + (XL - XC)²)", variables: ["R", "XL", "XC"], compute: (inp) => Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2)) }
    ]
  };

  acGeneralEquations: { [sub: string]: Equation[] } = {
    'KVAR': [],
    'KW': [],
    'KVA': [],
    'X': [],
    'I': [],
    'V': [],
    'R': [],
    'W': [],
    'tan(φ)': [],
    'cos(φ)': [],
    'sen(φ)': []
  };

  // Getter para las etiquetas de las variables de la ecuación
  get equationVariableLabels(): string[] {
    return this.selectedEquation ? this.selectedEquation.variables : [];
  }

  // Métodos de selección
  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
    this.subopcionSeleccionada = null;
    this.subsubopcionSeleccionada = null;
    this.resetearFormulario();
    this.selectedEquation = null;
  }

  seleccionarSubopcion(subopcion: string): void {
    this.subopcionSeleccionada = subopcion;
    this.subsubopcionSeleccionada = null;
    this.resetearFormulario();
    this.selectedEquation = null;
  }

  seleccionarSubsubopcion(param: number | string): void {
    if (this.opcionSeleccionada === 'Sistemas monofásicos' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.monofasicoEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else if (this.opcionSeleccionada === 'Sistemas trifásicos' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.trifasicoEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else if (this.opcionSeleccionada === 'Análisis AC coseno de φ' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.acTrifasicoEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else if (this.opcionSeleccionada === 'Análisis AC velocidad angular' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.acVelocidadEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else if (this.opcionSeleccionada === 'Análisis AC General' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.acGeneralEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else {
      if (typeof param === 'string') {
        this.subsubopcionSeleccionada = param;
      }
      this.resetearFormulario();
    }
  }

  // Métodos auxiliares
  resetearFormulario(resetInputs: boolean = true): void {
    if (resetInputs) {
      if (this.selectedEquation) {
        this.formulario = {};
        for (const variable of this.selectedEquation.variables) {
          this.formulario[variable] = null;
        }
      } else {
        this.formulario = { input1: null, input2: null, input3: null };
      }
    }
    this.resultado = null;
    this.unidad = ''; // Resetear la unidad al resetear el formulario
  }

  calcular(): void {
    if (this.selectedEquation) {
      for (const variable of this.selectedEquation.variables) {
        if (this.formulario[variable] == null) {
          alert(`Por favor, ingrese el valor de ${variable}.`);
          return;
        }
      }
      const inputs: { [key: string]: number } = {};
      for (const variable of this.selectedEquation.variables) {
        inputs[variable] = +this.formulario[variable]!;
      }
      this.resultado = this.selectedEquation.compute(inputs);
      this.asignarUnidad(); // Asignar la unidad correcta
    } else {
      this.resultado = Math.random() * 100;
      this.unidad = ''; // Si no hay ecuación seleccionada, no hay unidad
    }
  }

  // Método para asignar la unidad correcta
  asignarUnidad(): void {
    if (this.subopcionSeleccionada) {
      switch (this.subopcionSeleccionada) {
        case 'Vatios':
        case 'W':
          this.unidad = 'Watts';
          break;
        case 'Resistencia':
        case 'R':
          this.unidad = 'Ohmios';
          break;
        case 'Corriente':
        case 'I':
          this.unidad = 'Amperios';
          break;
        case 'Voltaje':
        case 'V':
          this.unidad = 'Voltios';
          break;
        case 'Potencia':
          this.unidad = 'Watts';
          break;
        case 'VA':
          this.unidad = 'Voltios-Amperios';
          break;
        case 'coseno de φ':
          this.unidad = '';
          break;
        case 'Frecuencia Angular (ω)':
          this.unidad = 'rad/s';
          break;
        case 'Reactancia Inductiva (XL)':
        case 'Reactancia Capacitiva (XC)':
        case 'Impedancia (Z)':
          this.unidad = 'Ohmios';
          break;
        case 'KVAR':
          this.unidad = 'kVAR';
          break;
        case 'KW':
          this.unidad = 'kW';
          break;
        case 'KVA':
          this.unidad = 'kVA';
          break;
        case 'X':
          this.unidad = 'Ohmios';
          break;
        case 'tan(φ)':
        case 'cos(φ)':
        case 'sen(φ)':
          this.unidad = '';
          break;
        default:
          this.unidad = '';
          break;
      }
    }
  }

  ngAfterViewInit(): void {
    const menuToggle = document.querySelector(".menu-header .menu-toggle-modern") as HTMLElement | null;
    const nav = document.querySelector(".menu-header .nav-modern") as HTMLElement | null;
    const closeButton = document.querySelector(".menu-header .close-menu") as HTMLElement | null;

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        nav.classList.toggle("active");
      });
    }

    if (closeButton && nav && menuToggle) {
      closeButton.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    }
  }
}
