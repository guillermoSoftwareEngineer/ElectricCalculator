// Definición de la interfaz para las ecuaciones
interface Equation {
  formula: string;
  variables: string[]; // Ejemplo: ["V", "R"] o ["V", "cos(φ)", "I"] o ["f", "L"], etc.
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
    'Análisis AC General': ['KVAR', 'KW', 'KVA', 'X', 'Z', 'I', 'V', 'R', 'W', 'tag PHI', 'cos PHI', 'sen PHI', 'tan(φ)']
  };

  // Subopción seleccionada
  subopcionSeleccionada: string | null = null;

  /*
    Para los grupos personalizados se utilizarán objetos de ecuaciones;
    para otros se usarán arreglos de strings en 'subsubopciones'.
  */
  subsubopciones: { [main: string]: { [sub: string]: string[] } } = {
    // Ejemplo: para Análisis AC General, en caso de no usar la versión personalizada.
    'Análisis AC General': {
      'KW': ['Opción 1', 'Opción 2', 'Opción 3']
    }
  };

  // Subsubopción seleccionada (para grupos que usan arreglos genéricos)
  subsubopcionSeleccionada: string | null = null;

  /*
    Definición del formulario:
    - Para los grupos personalizados (Sistemas monofásicos, Sistemas trifásicos, Análisis AC trifásico,
      Análisis AC velocidad angular y Análisis AC General) se usarán inputs dinámicos donde las claves
      serán las variables de la ecuación seleccionada.
    - Para otros grupos se usarán 3 inputs genéricos.
  */
  formulario: { [key: string]: number | null } = { input1: null, input2: null, input3: null };

  // Resultado del cálculo
  resultado: number | null = null;

  // Propiedad para almacenar la ecuación seleccionada (para grupos personalizados)
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
        compute: (inp) => Math.pow(+inp["I"], 2) * +inp["R"]
      },
      {
        formula: "W = V * I",
        variables: ["V", "I"],
        compute: (inp) => +inp["V"] * +inp["I"]
      }
    ],
    'Resistencia': [
      {
        formula: "R = V / I",
        variables: ["V", "I"],
        compute: (inp) => +inp["V"] / +inp["I"]
      },
      {
        formula: "R = V² / W",
        variables: ["V", "W"],
        compute: (inp) => Math.pow(+inp["V"], 2) / +inp["W"]
      },
      {
        formula: "R = W / I²",
        variables: ["W", "I"],
        compute: (inp) => +inp["W"] / Math.pow(+inp["I"], 2)
      }
    ],
    'Corriente': [
      {
        formula: "I = V / R",
        variables: ["V", "R"],
        compute: (inp) => +inp["V"] / +inp["R"]
      },
      {
        formula: "I = W / V",
        variables: ["W", "V"],
        compute: (inp) => +inp["W"] / +inp["V"]
      },
      {
        formula: "I = sqrt(W / R)",
        variables: ["W", "R"],
        compute: (inp) => Math.sqrt(+inp["W"] / +inp["R"])
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R",
        variables: ["I", "R"],
        compute: (inp) => +inp["I"] * +inp["R"]
      },
      {
        formula: "V = W / I",
        variables: ["W", "I"],
        compute: (inp) => +inp["W"] / +inp["I"]
      },
      {
        formula: "V = sqrt(W * R)",
        variables: ["W", "R"],
        compute: (inp) => Math.sqrt(+inp["W"] * +inp["R"])
      }
    ]
  };

  // Sistemas trifásicos
  trifasicoEquations: { [sub: string]: Equation[] } = {
    'Vatios': [
      {
        formula: "W = V * I * sqrt(3)",
        variables: ["V", "I"],
        compute: (inp) => +inp["V"] * +inp["I"] * Math.sqrt(3)
      },
      {
        formula: "W = V² / (R * sqrt(3))",
        variables: ["V", "R"],
        compute: (inp) => Math.pow(+inp["V"], 2) / (+inp["R"] * Math.sqrt(3))
      },
      {
        formula: "W = I² * R * sqrt(3)",
        variables: ["I", "R"],
        compute: (inp) => Math.pow(+inp["I"], 2) * +inp["R"] * Math.sqrt(3)
      }
    ],
    'Resistencia': [
      {
        formula: "R = V / I",
        variables: ["V", "I"],
        compute: (inp) => +inp["V"] / +inp["I"]
      },
      {
        formula: "R = V² / W",
        variables: ["V", "W"],
        compute: (inp) => Math.pow(+inp["V"], 2) / +inp["W"]
      },
      {
        formula: "R = W / I²",
        variables: ["W", "I"],
        compute: (inp) => +inp["W"] / Math.pow(+inp["I"], 2)
      }
    ],
    'Corriente': [
      {
        formula: "I = V / (R * sqrt(3))",
        variables: ["V", "R"],
        compute: (inp) => +inp["V"] / (+inp["R"] * Math.sqrt(3))
      },
      {
        formula: "I = W / (V * sqrt(3))",
        variables: ["W", "V"],
        compute: (inp) => +inp["W"] / (+inp["V"] * Math.sqrt(3))
      },
      {
        formula: "I = sqrt(W / (R * sqrt(3)))",
        variables: ["W", "R"],
        compute: (inp) => Math.sqrt(+inp["W"] / (+inp["R"] * Math.sqrt(3)))
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R * sqrt(3)",
        variables: ["I", "R"],
        compute: (inp) => +inp["I"] * +inp["R"] * Math.sqrt(3)
      },
      {
        formula: "V = W / (I * sqrt(3))",
        variables: ["W", "I"],
        compute: (inp) => +inp["W"] / (+inp["I"] * Math.sqrt(3))
      },
      {
        formula: "V = sqrt(W * R * sqrt(3))",
        variables: ["W", "R"],
        compute: (inp) => Math.sqrt(+inp["W"] * +inp["R"] * Math.sqrt(3))
      }
    ]
  };

  // Análisis AC trifásico
  acTrifasicoEquations: { [sub: string]: Equation[] } = {
    'Resistencia': [
      {
        formula: "R = V * cos(φ) / I",
        variables: ["V", "cos(φ)", "I"],
        compute: (inp) => (+inp["V"] * +inp["cos(φ)"]) / +inp["I"]
      },
      {
        formula: "R = (V * cos(φ))² / W",
        variables: ["V", "cos(φ)", "W"],
        compute: (inp) => Math.pow(+inp["V"] * +inp["cos(φ)"], 2) / +inp["W"]
      },
      {
        formula: "R = W / (I² * cos(φ))",
        variables: ["W", "I", "cos(φ)"],
        compute: (inp) => +inp["W"] / (Math.pow(+inp["I"], 2) * +inp["cos(φ)"])
      }
    ],
    'Corriente': [
      {
        formula: "I = V * cos(φ) / R",
        variables: ["V", "cos(φ)", "R"],
        compute: (inp) => (+inp["V"] * +inp["cos(φ)"]) / +inp["R"]
      },
      {
        formula: "I = W / (V * cos(φ))",
        variables: ["W", "V", "cos(φ)"],
        compute: (inp) => +inp["W"] / (+inp["V"] * +inp["cos(φ)"])
      },
      {
        formula: "I = sqrt(W / (R * cos(φ)))",
        variables: ["W", "R", "cos(φ)"],
        compute: (inp) => Math.sqrt(+inp["W"] / (+inp["R"] * +inp["cos(φ)"]))
      }
    ],
    'Potencia': [
      {
        formula: "W = V * I * cos(φ)",
        variables: ["V", "I", "cos(φ)"],
        compute: (inp) => +inp["V"] * +inp["I"] * +inp["cos(φ)"]
      },
      {
        formula: "W = (V * cos(φ))² / R",
        variables: ["V", "cos(φ)", "R"],
        compute: (inp) => Math.pow(+inp["V"] * +inp["cos(φ)"], 2) / +inp["R"]
      },
      {
        formula: "W = I² * R * cos(φ)",
        variables: ["I", "R", "cos(φ)"],
        compute: (inp) => Math.pow(+inp["I"], 2) * +inp["R"] * +inp["cos(φ)"]
      }
    ],
    'Voltaje': [
      {
        formula: "V = I * R / cos(φ)",
        variables: ["I", "R", "cos(φ)"],
        compute: (inp) => (+inp["I"] * +inp["R"]) / +inp["cos(φ)"]
      },
      {
        formula: "V = W / (I * cos(φ))",
        variables: ["W", "I", "cos(φ)"],
        compute: (inp) => +inp["W"] / (+inp["I"] * +inp["cos(φ)"])
      },
      {
        formula: "V = sqrt(W * R) / cos(φ)",
        variables: ["W", "R", "cos(φ)"],
        compute: (inp) => Math.sqrt(+inp["W"] * +inp["R"]) / +inp["cos(φ)"]
      }
    ],
    'Factor de Potencia': [
      {
        formula: "cos(φ) = W / VA",
        variables: ["W", "VA"],
        compute: (inp) => +inp["W"] / +inp["VA"]
      },
      {
        formula: "cos(φ) = V * I / VA",
        variables: ["V", "I", "VA"],
        compute: (inp) => (+inp["V"] * +inp["I"]) / +inp["VA"]
      },
      {
        formula: "cos(φ) = sqrt(W / VA)",
        variables: ["W", "VA"],
        compute: (inp) => Math.sqrt(+inp["W"] / +inp["VA"])
      }
    ]
  };

  // Análisis AC velocidad angular
  acVelocidadEquations: { [sub: string]: Equation[] } = {
    'Frecuencia Angular (ω)': [
      {
        formula: "ω = 2 * π * f",
        variables: ["f"],
        compute: (inp) => 2 * Math.PI * (+inp["f"])
      },
      {
        formula: "ω = 2 * 3.1416 * f",
        variables: ["f"],
        compute: (inp) => 2 * 3.1416 * (+inp["f"])
      }
    ],
    'Reactancia Inductiva (XL)': [
      {
        formula: "XL = 2 * π * f * L",
        variables: ["f", "L"],
        compute: (inp) => 2 * Math.PI * (+inp["f"]) * (+inp["L"])
      },
      {
        formula: "XL = ω * L",
        variables: ["ω", "L"],
        compute: (inp) => (+inp["ω"]) * (+inp["L"])
      }
    ],
    'Reactancia Capacitiva (XC)': [
      {
        formula: "XC = 1 / (2 * π * f * C)",
        variables: ["f", "C"],
        compute: (inp) => 1 / (2 * Math.PI * (+inp["f"]) * (+inp["C"]))
      },
      {
        formula: "XC = 1 / (ω * C)",
        variables: ["ω", "C"],
        compute: (inp) => 1 / ((+inp["ω"]) * (+inp["C"]))
      }
    ],
    'Impedancia (Z)': [
      {
        formula: "Z = R + j(XL - XC)",
        variables: ["R", "XL", "XC"],
        compute: (inp) => Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2))
      },
      {
        formula: "Z = sqrt(R² + (XL - XC)²)",
        variables: ["R", "XL", "XC"],
        compute: (inp) => Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow((+inp["XL"] - +inp["XC"]), 2))
      }
    ]
  };

  // Análisis AC General (ejemplo para el subgrupo "KVAR")
  acGeneralEquations: { [sub: string]: Equation[] } = {
    'KVAR': [
      {
        formula: "kVAR = kVA * sen(φ)",
        variables: ["kVA", "sen(φ)"],
        compute: (inp) => +inp["kVA"] * +inp["sen(φ)"]
      },
      {
        formula: "kVAR = kW * tan(φ)",
        variables: ["kW", "tan(φ)"],
        compute: (inp) => +inp["kW"] * +inp["tan(φ)"]
      },
      {
        formula: "kVAR = (kW * X) / R",
        variables: ["kW", "X", "R"],
        compute: (inp) => (+inp["kW"] * +inp["X"]) / +inp["R"]
      },
      {
        formula: "kVAR = (kVA * X) / Z",
        variables: ["kVA", "X", "Z"],
        compute: (inp) => (+inp["kVA"] * +inp["X"]) / +inp["Z"]
      },
      {
        formula: "kVAR = (kW * X) / (Z * cos(φ))",
        variables: ["kW", "X", "Z", "cos(φ)"],
        compute: (inp) => (+inp["kW"] * +inp["X"]) / (+inp["Z"] * +inp["cos(φ)"])
      },
      {
        formula: "kVAR = (kVA * X) / sqrt(R² + X²)",
        variables: ["kVA", "X", "R"],
        compute: (inp) => (+inp["kVA"] * +inp["X"]) / Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow(+inp["X"], 2))
      },
      {
        formula: "kVAR = 1.73 * V * I * sen(φ) / 1000",
        variables: ["V", "I", "sen(φ)"],
        compute: (inp) => 1.73 * (+inp["V"]) * (+inp["I"]) * +inp["sen(φ)"] / 1000
      },
      {
        formula: "kVAR = (kVA * cos(φ) * X) / R",
        variables: ["kVA", "cos(φ)", "X", "R"],
        compute: (inp) => (+inp["kVA"] * +inp["cos(φ)"] * +inp["X"]) / +inp["R"]
      },
      {
        formula: "kVAR = 3 * I² * Z * sen(φ) / 1000",
        variables: ["I", "Z", "sen(φ)"],
        compute: (inp) => 3 * Math.pow(+inp["I"], 2) * +inp["Z"] * +inp["sen(φ)"] / 1000
      },
      {
        formula: "kVAR = (V² * sen(φ)) / Z",
        variables: ["V", "sen(φ)", "Z"],
        compute: (inp) => (Math.pow(+inp["V"], 2) * +inp["sen(φ)"]) / +inp["Z"]
      },
      {
        formula: "kVAR = kW * X / sqrt(R² + X²)",
        variables: ["kW", "X", "R"],
        compute: (inp) => (+inp["kW"] * +inp["X"]) / Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow(+inp["X"], 2))
      },
      {
        formula: "kVAR = kVA * X / sqrt(R² + X²)",
        variables: ["kVA", "X", "R"],
        compute: (inp) => (+inp["kVA"] * +inp["X"]) / Math.sqrt(Math.pow(+inp["R"], 2) + Math.pow(+inp["X"], 2))
      },
      {
        formula: "kVAR = kW * X / (R * Z)",
        variables: ["kW", "X", "R", "Z"],
        compute: (inp) => (+inp["kW"] * +inp["X"]) / (+inp["R"] * +inp["Z"])
      }
    ]
    // Puedes agregar otros subgrupos (KW, KVA, etc.) de forma similar.
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
  // Para grupos personalizados se espera un índice (number); para otros, una cadena (string)
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
      } else if (this.opcionSeleccionada === 'Análisis AC General') {
        return this.acGeneralEquations[this.subopcionSeleccionada].map(eq => eq.formula);
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

  // Método para resetear el formulario.
  // Si resetInputs es true y se está en un grupo personalizado, se reinicializa 'formulario' usando las variables de la ecuación seleccionada.
  resetearFormulario(resetInputs: boolean = true): void {
    if (resetInputs) {
      if (
        (this.opcionSeleccionada === 'Sistemas monofásicos' ||
          this.opcionSeleccionada === 'Sistemas trifásicos' ||
          this.opcionSeleccionada === 'Análisis AC trifásico' ||
          this.opcionSeleccionada === 'Análisis AC velocidad angular' ||
          this.opcionSeleccionada === 'Análisis AC General') &&
        this.selectedEquation
      ) {
        this.formulario = {};
        for (const variable of this.selectedEquation.variables) {
          // Para Análisis AC trifásico y AC General, asignamos valores predeterminados para ciertas variables.
          if (
            (this.opcionSeleccionada === 'Análisis AC trifásico' || this.opcionSeleccionada === 'Análisis AC General') &&
            variable === 'cos(φ)'
          ) {
            this.formulario[variable] = 0.9000;
          } else if (this.opcionSeleccionada === 'Análisis AC General' && variable === 'tan(φ)') {
            this.formulario[variable] = 0.7000;
          } else if (this.opcionSeleccionada === 'Análisis AC General' && variable === 'sen(φ)') {
            this.formulario[variable] = 0.5000;
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
      this.opcionSeleccionada === 'Análisis AC velocidad angular' ||
      this.opcionSeleccionada === 'Análisis AC General'
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
