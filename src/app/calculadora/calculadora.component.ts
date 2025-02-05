// Definición de la interfaz para las ecuaciones
interface Equation {
  formula: string;
  variables: string[]; // Ejemplo: ["V", "R"] o ["V", "cosφ", "I"]
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
    'Análisis AC trifásico': ['Resistencia', 'Corriente', 'Potencia', 'Voltaje', 'cos φ (phi) '],
    'Análisis AC velocidad angular': ['Frecuencia Angular (ω)', 'Reactancia Inductiva (XL)', 'Reactancia Capacitiva (XC)', 'Impedancia (Z)'],
    'Análisis AC General': [
      'KVAR', 'KW', 'KVA', 'X', 'Z', 'I', 'V', 'R', 'W', 'tag PHI', 'cos PHI', 'sen PHI', 'tan(φ)'
    ]
  };

  // Subopción seleccionada
  subopcionSeleccionada: string | null = null;

  /*
    Para la mayoría de los grupos se utilizará un arreglo de strings (subsubopciones).
    Sin embargo, para los grupos personalizados (Sistemas monofásicos, Sistemas trifásicos y Análisis AC trifásico)
    se utilizarán las siguientes propiedades de ecuaciones.
    Por ello, en 'subsubopciones' definimos solo los grupos que usan arreglos de strings.
  */
  subsubopciones: { [main: string]: { [sub: string]: string[] } } = {
    // Ejemplo: para Análisis AC velocidad angular y AC General se mantienen los arreglos de strings (si es necesario)
    'Análisis AC velocidad angular': {
      'Frecuencia Angular (ω)': ['Opción 1', 'Opción 2'],
      'Reactancia Inductiva (XL)': ['Opción 1', 'Opción 2'],
      'Reactancia Capacitiva (XC)': ['Opción 1', 'Opción 2'],
      'Impedancia (Z)': ['Opción 1', 'Opción 2']
    },
    'Análisis AC General': {
      'KVAR': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'KW': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'KVA': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'X': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'Z': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'I': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'V': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'R': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12'],
      'W': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'tag PHI': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'cos PHI': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13'],
      'sen PHI': ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10', 'Opción 11', 'Opción 12', 'Opción 13']
    }
  };

  // Subsubopción seleccionada (para grupos que usan arreglos genéricos)
  subsubopcionSeleccionada: string | null = null;

  /*
    Definición del formulario:
    - Para los grupos personalizados (Sistemas monofásicos, Sistemas trifásicos, Análisis AC trifásico) se usarán inputs dinámicos,
      donde las claves serán los nombres de las variables de la ecuación seleccionada.
    - Para los demás se usarán 3 inputs genéricos.
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
    'cos φ (phi) ': [
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
  // Para los grupos personalizados (Sistemas monofásicos, trifásicos y AC trifásico) se espera un índice (number)
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
    } else {
      if (typeof param === 'string') {
        this.subsubopcionSeleccionada = param;
      }
      this.resetearFormulario();
    }
  }

  // Getter para obtener la lista de subsubopciones (fórmulas) según el grupo
  get subsubopcionesList(): string[] {
    if (this.opcionSeleccionada && this.subopcionSeleccionada) {
      if (this.opcionSeleccionada === 'Sistemas monofásicos') {
        return this.monofasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else if (this.opcionSeleccionada === 'Sistemas trifásicos') {
        return this.trifasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else if (this.opcionSeleccionada === 'Análisis AC trifásico') {
        return this.acTrifasicoEquations[this.subopcionSeleccionada].map(eq => eq.formula);
      } else {
        return this.subsubopciones[this.opcionSeleccionada][this.subopcionSeleccionada];
      }
    }
    return [];
  }

  // Getter para obtener las etiquetas de las variables de la ecuación seleccionada
  get equationVariableLabels(): string[] {
    return this.selectedEquation ? this.selectedEquation.variables : [];
  }

  // Método para resetear el formulario
  // Si resetInputs es true y se está en un grupo personalizado, se reinicializa 'formulario' usando las variables de la ecuación
  resetearFormulario(resetInputs: boolean = true): void {
    if (resetInputs) {
      if ((this.opcionSeleccionada === 'Sistemas monofásicos' ||
           this.opcionSeleccionada === 'Sistemas trifásicos' ||
           this.opcionSeleccionada === 'Análisis AC trifásico')
          && this.selectedEquation) {
        this.formulario = {};
        for (const variable of this.selectedEquation.variables) {
          // Para Análisis AC trifásico, si la variable es "cosφ", se asigna un valor por defecto de 0.9000
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
      this.opcionSeleccionada === 'Análisis AC trifásico'
    ) {
      if (this.selectedEquation) {
        // Verificar que se hayan ingresado todos los valores
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
