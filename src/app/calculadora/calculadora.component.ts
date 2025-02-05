// Definición de la interfaz para las ecuaciones
interface Equation {
  formula: string;
  variables: string[]; // Ejemplo: ["V", "R"] o ["V", "cosφ", "I"] o ["f", "L"], etc.
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
    Para grupos personalizados usaremos objetos de ecuaciones.
    Para otros grupos se usan arreglos de strings en 'subsubopciones'.
  */
  // Para Análisis AC trifásico y AC velocidad angular, definiremos los objetos correspondientes.
  subsubopciones: { [main: string]: { [sub: string]: string[] } } = {
    // Dejamos, por ejemplo, "Análisis AC General" como arreglo genérico
    'Análisis AC General': {
      'KVAR': ['Opción 1', 'Opción 2', 'Opción 3'],
      'KW': ['Opción 1', 'Opción 2', 'Opción 3'],
      'KVA': ['Opción 1', 'Opción 2', 'Opción 3'],
      'X': ['Opción 1', 'Opción 2', 'Opción 3'],
      'Z': ['Opción 1', 'Opción 2', 'Opción 3'],
      'I': ['Opción 1', 'Opción 2', 'Opción 3'],
      'V': ['Opción 1', 'Opción 2', 'Opción 3'],
      'R': ['Opción 1', 'Opción 2', 'Opción 3'],
      'W': ['Opción 1', 'Opción 2', 'Opción 3'],
      'tag PHI': ['Opción 1', 'Opción 2', 'Opción 3'],
      'cos PHI': ['Opción 1', 'Opción 2', 'Opción 3'],
      'sen PHI': ['Opción 1', 'Opción 2', 'Opción 3']
    }
  };

  // Subsubopción seleccionada (para grupos que usan arreglos genéricos)
  subsubopcionSeleccionada: string | null = null;

  /*
    Definición del formulario:
    - Para grupos personalizados (Sistemas monofásicos, Sistemas trifásicos, Análisis AC trifásico, Análisis AC velocidad angular)
      se usarán inputs dinámicos; las claves serán las variables de la ecuación seleccionada.
    - Para otros grupos se usan 3 inputs genéricos.
  */
  formulario: { [key: string]: number | null } = {
    input1: null,
    input2: null,
    input3: null
  };

  // Resultado del cálculo
  resultado: number | null = null;

  // Propiedad para almacenar la ecuación seleccionada (para los grupos personalizados)
  selectedEquation: Equation | null = null;

  // ----------------------------
  // Estructuras de ecuaciones personalizadas
  // ----------------------------

  // Sistemas monofásicos
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

  // Sistemas trifásicos
  trifasicoEquations: { [sub: string]: Equation[] } = {
    'Vatios': [
      {
        formula: "W = V * I * sqrt(3)",
        variables: ["V", "I"],
        compute: (inp: { [key: string]: number }) => +inp["V"] * +inp["I"] * Math.sqrt(3)
      },
      {
        formula: "W = V² / (R * sqrt(3))",
        variables: ["V", "R"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["V"], 2) / (+inp["R"] * Math.sqrt(3))
      },
      {
        formula: "W = I² * R * sqrt(3)",
        variables: ["I", "R"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["I"], 2) * +inp["R"] * Math.sqrt(3)
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
        formula: "I = V / (R * sqrt(3))",
        variables: ["V", "R"],
        compute: (inp: { [key: string]: number }) => +inp["V"] / (+inp["R"] * Math.sqrt(3))
      },
      {
        formula: "I = W / (V * sqrt(3))",
        variables: ["W", "V"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / (+inp["V"] * Math.sqrt(3))
      },
      {
        formula: "I = sqrt(W / (R * sqrt(3)))",
        variables: ["W", "R"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] / (+inp["R"] * Math.sqrt(3)))
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R * sqrt(3)",
        variables: ["I", "R"],
        compute: (inp: { [key: string]: number }) => +inp["I"] * +inp["R"] * Math.sqrt(3)
      },
      {
        formula: "V = W / (I * sqrt(3))",
        variables: ["W", "I"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / (+inp["I"] * Math.sqrt(3))
      },
      {
        formula: "V = sqrt(W * R * sqrt(3))",
        variables: ["W", "R"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] * +inp["R"] * Math.sqrt(3))
      }
    ]
  };

  // Análisis AC trifásico
  acTrifasicoEquations: { [sub: string]: Equation[] } = {
    'Resistencia': [
      {
        formula: "R = V * cosφ / I",
        variables: ["V", "cosφ", "I"],
        compute: (inp: { [key: string]: number }) => (+inp["V"] * +inp["cosφ"]) / +inp["I"]
      },
      {
        formula: "R = (V * cosφ)² / W",
        variables: ["V", "cosφ", "W"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["V"] * +inp["cosφ"], 2) / +inp["W"]
      },
      {
        formula: "R = W / (I² * cosφ)",
        variables: ["W", "I", "cosφ"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / (Math.pow(+inp["I"], 2) * +inp["cosφ"])
      }
    ],
    'Corriente': [
      {
        formula: "I = V * cosφ / R",
        variables: ["V", "cosφ", "R"],
        compute: (inp: { [key: string]: number }) => (+inp["V"] * +inp["cosφ"]) / +inp["R"]
      },
      {
        formula: "I = W / (V * cosφ)",
        variables: ["W", "V", "cosφ"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / (+inp["V"] * +inp["cosφ"])
      },
      {
        formula: "I = sqrt(W / (R * cosφ))",
        variables: ["W", "R", "cosφ"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] / (+inp["R"] * +inp["cosφ"]))
      }
    ],
    'Potencia': [
      {
        formula: "W = V * I * cosφ",
        variables: ["V", "I", "cosφ"],
        compute: (inp: { [key: string]: number }) => +inp["V"] * +inp["I"] * +inp["cosφ"]
      },
      {
        formula: "W = (V * cosφ)² / R",
        variables: ["V", "cosφ", "R"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["V"] * +inp["cosφ"], 2) / +inp["R"]
      },
      {
        formula: "W = I² * R * cosφ",
        variables: ["I", "R", "cosφ"],
        compute: (inp: { [key: string]: number }) => Math.pow(+inp["I"], 2) * +inp["R"] * +inp["cosφ"]
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R / cosφ",
        variables: ["I", "R", "cosφ"],
        compute: (inp: { [key: string]: number }) => (+inp["I"] * +inp["R"]) / +inp["cosφ"]
      },
      {
        formula: "V = W / (I * cosφ)",
        variables: ["W", "I", "cosφ"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / (+inp["I"] * +inp["cosφ"])
      },
      {
        formula: "V = sqrt(W * R) / cosφ",
        variables: ["W", "R", "cosφ"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] * +inp["R"]) / +inp["cosφ"]
      }
    ],
    'Factor de Potencia': [
      {
        formula: "cosφ = W / VA",
        variables: ["W", "VA"],
        compute: (inp: { [key: string]: number }) => +inp["W"] / +inp["VA"]
      },
      {
        formula: "cosφ = V * I / VA",
        variables: ["V", "I", "VA"],
        compute: (inp: { [key: string]: number }) => (+inp["V"] * +inp["I"]) / +inp["VA"]
      },
      {
        formula: "cosφ = sqrt(W / VA)",
        variables: ["W", "VA"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(+inp["W"] / +inp["VA"])
      }
    ]
  };

  // Análisis AC velocidad angular
  acVelocidadEquations: { [sub: string]: Equation[] } = {
    'Frecuencia Angular (ω)': [
      {
        formula: "ω = 2 * π * f",
        variables: ["f"],
        compute: (inp: { [key: string]: number }) => 2 * Math.PI * (+inp["f"])
      },
      {
        formula: "ω = 2 * 3.1416 * f",
        variables: ["f"],
        compute: (inp: { [key: string]: number }) => 2 * 3.1416 * (+inp["f"])
      }
    ],
    'Reactancia Inductiva (XL)': [
      {
        formula: "XL = 2 * π * f * L",
        variables: ["f", "L"],
        compute: (inp: { [key: string]: number }) => 2 * Math.PI * (+inp["f"]) * (+inp["L"])
      },
      {
        formula: "XL = ω * L",
        variables: ["ω", "L"],
        compute: (inp: { [key: string]: number }) => (+inp["ω"]) * (+inp["L"])
      }
    ],
    'Reactancia Capacitiva (XC)': [
      {
        formula: "XC = 1 / (2 * π * f * C)",
        variables: ["f", "C"],
        compute: (inp: { [key: string]: number }) => 1 / (2 * Math.PI * (+inp["f"]) * (+inp["C"]))
      },
      {
        formula: "XC = 1 / (ω * C)",
        variables: ["ω", "C"],
        compute: (inp: { [key: string]: number }) => 1 / ((+inp["ω"]) * (+inp["C"]))
      }
    ],
    'Impedancia (Z)': [
      {
        formula: "Z = R + j(XL - XC)",
        variables: ["R", "XL", "XC"],
        compute: (inp: { [key: string]: number }) => {
          // Usamos la magnitud: sqrt(R² + (XL - XC)²)
          return Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2));
        }
      },
      {
        formula: "Z = sqrt(R² + (XL - XC)²)",
        variables: ["R", "XL", "XC"],
        compute: (inp: { [key: string]: number }) => Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2))
      }
    ]
  };

  // ----------------------------
  // Fin de las estructuras personalizadas
  // ----------------------------

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
  // Para grupos personalizados (Sistemas monofásicos, Sistemas trifásicos, Análisis AC trifásico, Análisis AC velocidad angular) se espera un índice (number)
  // Para otros casos se espera una cadena (string)
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
    } else if (this.opcionSeleccionada === 'Análisis AC trifásico' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.acTrifasicoEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else if (this.opcionSeleccionada === 'Análisis AC velocidad angular' && this.subopcionSeleccionada) {
      if (typeof param === 'number') {
        this.selectedEquation = this.acVelocidadEquations[this.subopcionSeleccionada][param];
        this.resetearFormulario(true);
      }
    } else {
      if (typeof param === 'string') {
        this.subsubopcionSeleccionada = param;
      }
      this.resetearFormulario();
    }
  }

  // Getter para obtener la lista de subsubopciones (fórmulas) según el grupo seleccionado
  get subsubopcionesList(): string[] {
    if (this.opcionSeleccionada && this.subopcionSeleccionada) {
      if (this.opcionSeleccionada === 'Sistemas monofásicos') {
        return this.monofasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else if (this.opcionSeleccionada === 'Sistemas trifásicos') {
        return this.trifasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else if (this.opcionSeleccionada === 'Análisis AC trifásico') {
        return this.acTrifasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else if (this.opcionSeleccionada === 'Análisis AC velocidad angular') {
        return this.acVelocidadEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else {
        return this.subsubopciones[this.opcionSeleccionada][this.subopcionSeleccionada];
      }
    }
    return [];
  }

  // Getter para obtener las etiquetas de las variables de la ecuación seleccionada (para grupos personalizados)
  get equationVariableLabels(): string[] {
    return this.selectedEquation ? this.selectedEquation.variables : [];
  }

  // Método para resetear el formulario
  // Si resetInputs es true y se está en un grupo personalizado, se reinicializa 'formulario' usando las variables de la ecuación seleccionada.
  resetearFormulario(resetInputs: boolean = true): void {
    if (resetInputs) {
      if (
        (this.opcionSeleccionada === 'Sistemas monofásicos' ||
          this.opcionSeleccionada === 'Sistemas trifásicos' ||
          this.opcionSeleccionada === 'Análisis AC trifásico' ||
          this.opcionSeleccionada === 'Análisis AC velocidad angular') &&
        this.selectedEquation
      ) {
        this.formulario = {};
        for (const variable of this.selectedEquation.variables) {
          // Para Análisis AC trifásico, si la variable es "cosφ", se asigna un valor predeterminado de 0.9000
          if (this.opcionSeleccionada === 'Análisis AC trifásico' && variable === 'cosφ') {
            this.formulario[variable] = 0.9000;
          } else {
            this.formulario[variable] = null;
          }
        }
      } else {
        this.formulario = { input1: null, input2: null, input3: null };
      }
    }
    this.resultado = null;
  }

  // Método para calcular el resultado
  calcular(): void {
    if (
      this.opcionSeleccionada === 'Sistemas monofásicos' ||
      this.opcionSeleccionada === 'Sistemas trifásicos' ||
      this.opcionSeleccionada === 'Análisis AC trifásico' ||
      this.opcionSeleccionada === 'Análisis AC velocidad angular'
    ) {
      if (this.selectedEquation) {
        // Verificar que se hayan ingresado todos los valores para cada variable
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
}
