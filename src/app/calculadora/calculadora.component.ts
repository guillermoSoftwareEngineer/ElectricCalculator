// Definición de la interfaz para las ecuaciones
interface Equation {
  formula: string;
  variables: string[]; // Por ejemplo, ["V", "R"]
  compute: (inputs: { [key: string]: number }) => number;
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {
  // Opciones principales
  opcionesPrincipales: string[] = [
    'Sistemas monofásicos',
    'Sistemas trifásicos',
    'Análisis AC trifásico',
    'Análisis AC velocidad angular',
    'Análisis AC General'
  ];

  // Opción principal seleccionada
  opcionSeleccionada: string | null = null;

  // Subopciones para cada opción principal
  subopciones: { [key: string]: string[] } = {
    'Sistemas monofásicos': ['Vatios', 'Resistencia', 'Corriente', 'Voltaje'],
    'Sistemas trifásicos': ['Vatios', 'Resistencia', 'Corriente', 'Voltaje'],
    'Análisis AC trifásico': ['Resistencia', 'Corriente', 'Potencia', 'Voltaje', 'Factor de Potencia'],
    'Análisis AC velocidad angular': ['Frecuencia Angular (ω)', 'Reactancia Inductiva (XL)', 'Reactancia Capacitiva (XC)', 'Impedancia (Z)'],
    'Análisis AC General': [
      'KVAR', 'KW', 'KVA', 'X', 'Z', 'I', 'V', 'R', 'W', 'tag PHI', 'cos PHI', 'sen PHI', 'tan(φ)'
    ]
  };

  // Subopción seleccionada
  subopcionSeleccionada: string | null = null;

  /*
    Para la mayoría de los grupos se utiliza un objeto indexado de subsubopciones (arreglo de strings).
    Para Sistemas monofásicos se utilizará la estructura "monofasicoEquations".
  */
  subsubopciones: { [main: string]: { [sub: string]: string[] } } = {
    'Sistemas trifásicos': {
      'Vatios': ['W = V * I * sqrt(3)', 'W = V² / (R * sqrt(3))', 'W = I² * R * sqrt(3)'],
      'Resistencia': ['R = V / I', 'R = V² / W', 'R = W / I²'],
      'Corriente': ['I = V / (R * sqrt(3))', 'I = W / (V * sqrt(3))', 'I = sqrt(W / (R * sqrt(3)))'],
      'Voltaje': ['V = I * R * sqrt(3)', 'V = W / (I * sqrt(3))', 'V = sqrt(W * R * sqrt(3))']
    },
    'Análisis AC trifásico': {
      'Resistencia': ['R = V * cosφ / I', 'R = (V * cosφ)² / W', 'R = W / (I² * cosφ)'],
      'Corriente': ['I = V * cosφ / R', 'I = W / (V * cosφ)', 'I = sqrt(W / (R * cosφ))'],
      'Potencia': ['W = V * I * cosφ', 'W = (V * cosφ)² / R', 'W = I² * R * cosφ'],
      'Voltaje': ['V = I * R / cosφ', 'V = W / (I * cosφ)', 'V = sqrt(W * R) / cosφ'],
      'Factor de Potencia': ['cosφ = W / VA', 'cosφ = V * I / VA', 'cosφ = sqrt(W / VA)']
    },
    'Análisis AC velocidad angular': {
      'Frecuencia Angular (ω)': ['ω = 2 * π * f', 'ω = 2.3.1416 * f'],
      'Reactancia Inductiva (XL)': ['XL = 2 * π * f * L', 'XL = ω * L'],
      'Reactancia Capacitiva (XC)': ['XC = 1 / (2 * π * f * C)', 'XC = 1 / (ω * C)'],
      'Impedancia (Z)': ['Z = R + j(XL - XC)', 'Z = sqrt(R² + (XL - XC)²)']
    },
    'Análisis AC General': {
      'KVAR': [
        "kVAR = kVA * sen(φ)",
        "kVAR = kW * tan(φ)",
        "kVAR = (kW * X) / R",
        "kVAR = (kVA * X) / Z",
        "kVAR = (kW * X) / (Z * cos(φ))",
        "kVAR = (kVA * X) / sqrt(R² + X²)",
        "kVAR = 1.73 * V * I * sen(φ) / 1000",
        "kVAR = (kVA * cos(φ) * X) / R",
        "kVAR = 3 * I² * Z * sen(φ) / 1000",
        "kVAR = (V² * sen(φ)) / Z",
        "kVAR = kW * X / sqrt(R² + X²)",
        "kVAR = kVA * X / sqrt(R² + X²)",
        "kVAR = kW * X / (R * Z)"
      ],
      'KW': [
        "kW = kVA * cos(φ)",
        "kW = kVAR / tan(φ)",
        "kW = (kVA * R) / Z",
        "kW = (V² * kVA - kVA² * Z) / (V² * Z)",
        "kW = (kVA * R) / sqrt(R² + X²)",
        "kW = (kVA * cos(φ) * R) / Z",
        "kW = (kVA * cos(φ) * X) / Z",
        "kW = (3 * I² * Z * cos(φ)) / 1000",
        "kW = (V * I * 1.73 * cos(φ)) / 1000",
        "kW = (kVA * R) / sqrt(Z² + X²)",
        "kW = kVAR / tan(φ)",
        "kW = kVA * R / sqrt(Z² + X²)",
        "kW = kVA * R / Z"
      ],
      'KVA': [
        "kVA = kW / cos(φ)",
        "kVA = sqrt(kW² + kVAR²)",
        "kVA = (3 * I² * Z) / 1000",
        "kVA = (1.73 * V * I) / 1000",
        "kVA = sqrt(3 * I² * (R² + X²)) / 1000",
        "kVA = (V * kW² + kVAR²) / (V² * Z)",
        "kVA = kVAR / sen(φ)",
        "kVA = (kVA * Z) / sqrt(Z² - R²)",
        "kVA = (kVAR * Z) / X",
        "kVA = (kVAR * Z) / sqrt(Z² + X²)",
        "kVA = (kVAR * Z) / (R * tan(φ))",
        "kVA = kW * Z / R",
        "kVA = (kVAR * Z) / sqrt(Z² - R²)"
      ],
      'X': [
        "X = sqrt(Z² - R²)",
        "X = (kVAR * Z) / VA",
        "X = (VAR * Z) / W",
        "X = R * tan(φ)",
        "X = Z * sen(φ)",
        "X = (V² / VA) * tan(φ)",
        "X = (V * sen(φ)) / (1.73 * I)",
        "X = (cos(φ) * V) / (1.73 * I)",
        "X = (W * tan(φ)) / VA",
        "X = (cos(φ) * tan(φ) * Z)",
        "X = (W * tan(φ)) / (3 * I²)",
        "X = (VAR * VA) / (VA + W)",
        "X = (R * sen(φ)) / cos(φ)"
      ],
      'Z': [
        "Z = sqrt(R² + X²)",
        "Z = V / (1.73 * I)",
        "Z = R / cos(φ)",
        "Z = X / (tan(φ) * cos(φ))",
        "Z = (V² * cos(φ)) / W",
        "Z = (VA * X) / VAR",
        "Z = (VAR * X) / W",
        "Z = sqrt(Z² - X²) / cos(φ)",
        "Z = (VR + X²) / (R² + X²)",
        "Z = W / (3 * I * cos(φ))",
        "Z = (VA * X) / (W * tan(φ))",
        "Z = VA / (3 * I)",
        "Z = VAR / (3 * I * sen(φ))"
      ],
      'I': [
        "I = V / (1.73 * Z)",
        "I = V / (1.73 * R)",
        "I = W / (1.73 * V * cos(φ))",
        "I = kVA / (1.73 * V)",
        "I = V * sen(φ) / (1.73 * Z)",
        "I = VAR / (1.73 * V * sen(φ))",
        "I = sqrt(W / R)",
        "I = sqrt(W / (Z * cos(φ)))",
        "I = sqrt(VAR / X)",
        "I = sqrt(VAR / (Z * sen(φ)))",
        "I = sqrt(kVA² / X)",
        "I = sqrt(kVA² / (Z * sen(φ)))",
        "I = V * cos(φ) / (1.73 * sqrt(Z² - R²))"
      ],
      'V': [
        "V = I * Z * 1.73",
        "V = kVA / (1.73 * I)",
        "V = I * R * 1.73 / cos(φ)",
        "V = sqrt(W * R) / cos(φ)",
        "V = I * 1.73 * sqrt(Z² - R²)",
        "V = (kVA - V²) * R / W",
        "V = (W * R) / (I * cos(φ) * 1.73)",
        "V = (V * W * R) / cos(φ)",
        "V = (X * I * 1.73) / (cos(φ) * tan(φ))",
        "V = (Z * W) / cos(φ)",
        "V = (I * 1.73 * V² - X²) / sen(φ)",
        "V = (I * 1.73 * sqrt(Z² - R²)) / sen(φ)",
        "V = kVA / (1.73 * I * sen(φ))"
      ],
      'R': [
        "R = Z * cos(φ)",
        "R = sqrt(Z² - X²)",
        "R = (V * cos(φ)) / I",
        "R = (V * cos(φ))² / W",
        "R = (VA * cos(φ)) / (3 * I²)",
        "R = (X * cos(φ)) / sen(φ)",
        "R = (W * X) / (VA * sen(φ))",
        "R = W / VA",
        "R = (W * Z) / (VA * sen(φ))",
        "R = (W * Z) / (3 * I²)",
        "R = (Z * sen(φ)) / tan(φ)",
        "R = (N² * W) / (VAR * W)"
      ],
      'W': [
        "W = V * I * 1.73 * cos(φ)",
        "W = 2 * 3.1416 * f * cos(φ) * I²",
        "W = (V² * cos²(φ)) / Z",
        "W = (VA * cos(φ) * tan(φ)) / X",
        "W = (VA² * cos²(φ)) / Z",
        "W = (V² * cos²(φ)) / R",
        "W = (X * tan(φ)) / Z",
        "W = (VA * sen(φ)) / X",
        "W = VA * cos(φ)",
        "W = (VA * X) / tan(φ)",
        "W = (V² * X) / Z",
        "W = (V² * X) / (2 * X² + Z²)",
        "W = (VA² * X) / (2 * X² + Z²)"
      ],
      'tag PHI': [
        "tan(φ) = VAR / W",
        "tan(φ) = X / R",
        "tan(φ) = (Z * sen(φ)) / R",
        "tan(φ) = sen(φ) / cos(φ)",
        "tan(φ) = (V * I * 1.73 * cos(φ)) / W",
        "tan(φ) = (VA * sen(φ)) / W",
        "tan(φ) = (VAR * VA) / (VA² - VAR²)",
        "tan(φ) = (VAR) / (VA * cos(φ))",
        "tan(φ) = (X * V²) / (Z² - X²)",
        "tan(φ) = (sen(φ) * V * I) / cos(φ)",
        "tan(φ) = X / (Z * cos(φ))",
        "tan(φ) = VAR / (1.73 * V * I * cos(φ))",
        "tan(φ) = (V * IA * Z - W) / W"
      ],
      'cos PHI': [
        "cos(φ) = W / sqrt(W² + VAR²)",
        "cos(φ) = W / (1.73 * V * I)",
        "cos(φ) = sqrt(VA² - VAR²) / VA",
        "cos(φ) = R / sqrt(R² + X²)",
        "cos(φ) = 1 / sqrt(1 + tan²(φ))",
        "cos(φ) = R / Z",
        "cos(φ) = W / VA",
        "cos(φ) = VAR / (VA * tan(φ))",
        "cos(φ) = (W * sen(φ)) / VAR",
        "cos(φ) = sen(φ) / tan(φ)",
        "cos(φ) = X / (Z * tan(φ))",
        "cos(φ) = (Z * W) / V²",
        "cos(φ) = (V * I * sen²(φ))"
      ],
      'sen PHI': [
        "sen(φ) = VAR / sqrt(W² + VAR²)",
        "sen(φ) = W * tan(φ) / sqrt(W² + VAR²)",
        "sen(φ) = sqrt(1 - cos²(φ))",
        "sen(φ) = (X * tan(φ)) / Z",
        "sen(φ) = (V * I * tan(φ)) / (1.73 * W)",
        "sen(φ) = (VAR) / (W * cos(φ))",
        "sen(φ) = sqrt(1 - (W/VA)²)",
        "sen(φ) = (X / Z) * cos(φ)",
        "sen(φ) = (V * I * sen(φ)) / W",
        "sen(φ) = (W * tan(φ)) / (VA)",
        "sen(φ) = (VAR * tan(φ)) / (VA)",
        "sen(φ) = (V * I * tan(φ)) / (1.73 * VA)",
        "sen(φ) = (W * tan(φ)) / (VAR)"
      ]
    }
  };

  // Subsubopción seleccionada
  subsubopcionSeleccionada: string | null = null;

  /*
    Definición del formulario:
    - Para Sistemas monofásicos se utilizarán inputs personalizados (las claves serán los nombres de las variables de la ecuación seleccionada).
    - Para los demás se usarán 3 inputs genéricos: "input1", "input2" y "input3".
  */
  formulario: { [key: string]: number | null } = {
    input1: null,
    input2: null,
    input3: null
  };

  // Resultado del cálculo
  resultado: number | null = null;

  // Método para generar un arreglo de subsubopciones genéricas (para otros grupos)
  generarSubsubopciones(cantidad: number): string[] {
    return Array.from({ length: cantidad }, (_, i) => `Opción ${i + 1}`);
  }

  // Método para seleccionar una opción principal
  seleccionarOpcion(opcion: string): void {
    this.opcionSeleccionada = opcion;
    this.subopcionSeleccionada = null;
    this.subsubopcionSeleccionada = null;
    this.resetearFormulario();
    this.selectedEquation = null;
  }

  // Método para seleccionar una subopción
  seleccionarSubopcion(subopcion: string): void {
    this.subopcionSeleccionada = subopcion;
    this.subsubopcionSeleccionada = null;
    this.resetearFormulario();
    this.selectedEquation = null;
  }

  // Método para seleccionar una subsubopción
  // Para Sistemas monofásicos, se espera un índice (number); para los demás, una cadena (string)
  seleccionarSubsubopcion(param: number | string): void {
    if (this.opcionSeleccionada === 'Sistemas monofásicos' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.monofasicoEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else {
      if (typeof param === 'string') {
        this.subsubopcionSeleccionada = param;
      }
      this.resetearFormulario();
    }
  }

  // Propiedad para almacenar la ecuación seleccionada en Sistemas monofásicos
  selectedEquation: Equation | null = null;

  // resetearFormulario: Si resetInputs es true, reinicia el objeto 'formulario'
  resetearFormulario(resetInputs: boolean = true): void {
    if (resetInputs) {
      if (this.opcionSeleccionada === 'Sistemas monofásicos' && this.selectedEquation) {
        this.formulario = {};
        for (const variable of this.selectedEquation.variables) {
          this.formulario[variable] = null;
        }
      } else {
        this.formulario = { input1: null, input2: null, input3: null };
      }
    }
    this.resultado = null;
  }

  // Getter para obtener las etiquetas de las variables de la ecuación seleccionada en Sistemas monofásicos
  get monofasicoVariableLabels(): string[] {
    return this.selectedEquation ? this.selectedEquation.variables : [];
  }

  // Método para calcular el resultado
  calcular(): void {
    if (this.opcionSeleccionada === 'Sistemas monofásicos') {
      if (this.selectedEquation) {
        // Verificamos que se hayan ingresado todos los valores para cada variable
        for (const variable of this.selectedEquation.variables) {
          if (this.formulario[variable] == null) {
            alert(`Por favor, ingrese el valor de ${variable}.`);
            return;
          }
        }
        // Se fuerza la conversión a número usando el operador +
        const inputs: { [key: string]: number } = {};
        for (const variable of this.selectedEquation.variables) {
          inputs[variable] = +this.formulario[variable]!;
        }
        this.resultado = this.selectedEquation.compute(inputs);
      }
    } else {
      // Lógica para otros grupos (valor temporal)
      this.resultado = Math.random() * 100;
    }
  }

  // Método para obtener la ruta de la imagen
  getImagePath(opcion: string): string {
    const fileName = opcion.replace(/\s/g, '').toLowerCase() + '.png';
    return `assets/images/${fileName}`;
  }

  // Getter para obtener la lista de subsubopciones
  get subsubopcionesList(): string[] {
    if (this.opcionSeleccionada && this.subopcionSeleccionada) {
      if (this.opcionSeleccionada === 'Sistemas monofásicos') {
        return this.monofasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else {
        return this.subsubopciones[this.opcionSeleccionada][this.subopcionSeleccionada];
      }
    }
    return [];
  }

  // Estructura específica para Sistemas monofásicos
  monofasicoEquations: { [sub: string]: Equation[] } = {
    'Vatios': [
      {
        formula: "W = V² / R",
        variables: ["V", "R"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["V"], 2) / +inp["R"]
      },
      {
        formula: "W = I² * R",
        variables: ["I", "R"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["I"], 2) * +inp["R"]
      },
      {
        formula: "W = V * I",
        variables: ["V", "I"],
        compute: (inp: { [key: string]: number }) => +inp["V"] * +inp["I"]
      }
    ],
    'Resistencia': [
      {
        formula: "R = V / I",
        variables: ["V", "I"],
        compute: (inp: { [key: string]: number }) => +inp["V"] / +inp["I"]
      },
      {
        formula: "R = V² / W",
        variables: ["V", "W"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["V"], 2) / +inp["W"]
      },
      {
        formula: "R = W / I²",
        variables: ["W", "I"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / Math.pow(+inp["I"], 2)
      }
    ],
    'Corriente': [
      {
        formula: "I = V / R",
        variables: ["V", "R"],
        compute: (inp: { [key: string]: number }) => +inp["V"] / +inp["R"]
      },
      {
        formula: "I = W / V",
        variables: ["W", "V"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / +inp["V"]
      },
      {
        formula: "I = sqrt(W / R)",
        variables: ["W", "R"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] / +inp["R"])
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R",
        variables: ["I", "R"],
        compute: (inp: { [key: string]: number }) => +inp["I"] * +inp["R"]
      },
      {
        formula: "V = W / I",
        variables: ["W", "I"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / +inp["I"]
      },
      {
        formula: "V = sqrt(W * R)",
        variables: ["W", "R"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] * +inp["R"])
      }
    ]
  };
}
