/*
 * Copyright Hilbrand Bouwkamp
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 */

import functies from "../functies";
import { Legenda } from "../legenda/Legenda";
import { BerekenResultaatType, InvoerGegevensType, SerieType, WoningType } from "../types";

export interface Presentatie {
  toon(getal: number, resultaat: BerekenResultaatType): number;
}

export abstract class BerekenModel {
  gegevens: InvoerGegevensType;
  factor: number;
  legenda!: Legenda;

  constructor(gegevens: InvoerGegevensType) {
    this.gegevens = gegevens;
    this.factor = functies.factorBerekening(this.gegevens.visualisatie);
  }

  getGegevens(): InvoerGegevensType {
    return this.gegevens;
  }

  getIndexFactor(): number {
    return this.factor;
  }

  abstract getYDomain(): number[] | undefined;

  getFactorYas(): number {
    return this.factor;
  }

  getLegenda(): Legenda {
    if (this.legenda === undefined) {
      this.legenda = this.createLegenda();
    }
    return this.legenda;
  }

  abstract createLegenda(): Legenda;

  /**
   * Abstracte methode de berekening wordt uitgevoerd en het resultaat voor een gegeven arbeidsinkomen wordt gegeven.
   *
   * @param arbeidsInkomen arbeidsinkomen
   * @param nettoZonderKinderbijslag Bereken netto inkomen zonder kinderbijslag erbij op te tellen
   */
  abstract bereken(arbeidsInkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType;

  abstract verzamelGrafiekSeries(
    series: SerieType[],
    inkomen: number,
    nettoZonderKinderbijslag: boolean
  ): BerekenResultaatType;

  /**
   * Zet de gegevens om in het formaat dat de grafiek gebruikt.
   *
   * @param {*} series map object waarin de berekende gegevens moeten worden opgeslagen
   * @param {*} resultaat resultaat dat moeten worden opgeslagen
   * @param {number} id id waaronder deze gegevens in het series object moeten worden opgeslagen
   * @param negIsNul als true negatieve getallen worden 0
   */
  verzamelGrafiekSeriesInkomen(
    series: SerieType[],
    resultaat: BerekenResultaatType,
    id: number,
    presentatie: Presentatie
  ) {
    const huren = resultaat.woningType === WoningType.HUUR;

    series.push(
      {
        id: id,
        type: "alg. heffingskorting",
        getal: presentatie.toon(resultaat.ahk, resultaat),
      },
      {
        id: id,
        type: "arbeidskorting",
        getal: presentatie.toon(resultaat.ak, resultaat),
      },
      {
        id: id,
        type: "inkomenafh. combi krt",
        getal: presentatie.toon(resultaat.iack, resultaat),
      },
      {
        id: id,
        type: huren ? "huurtoeslag" : "hypotheekrenteaftrek",
        getal: presentatie.toon(resultaat.wonen, resultaat),
        // functies.afrondenNegIsNul(presentatie.toon(resultaat.wonen, resultaat), factor, !huren && negIsNul),
      },
      {
        id: id,
        type: "zorgtoeslag",
        getal: presentatie.toon(resultaat.zt, resultaat),
      },
      {
        id: id,
        type: "kinderbijslag",
        getal: presentatie.toon(resultaat.kb, resultaat),
      },
      {
        id: id,
        type: "kindgebonden budget",
        getal: presentatie.toon(resultaat.kgb, resultaat),
      }
    );
  }
}
