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

import functies from "../../ts/functies";
import {
  BerekenInvoerType,
  BerekenResultaatType,
  InvoerGegevensType,
  PersoonType,
  VisualisatieType,
  VisualisatieTypeType,
  WonenType,
} from "../../ts/types";
import hra from "../belasting/hypotheekrente_aftrek.js";
import iack from "../belasting/inkomensafhankelijkecombinatiekorting.js";
import kbs from "../belasting/kinderbijslag";
import kgb from "../belasting/kindgebonden_budget";
import { Legenda } from "../grafieken/Legenda";

export class Berekenen {
  vis: VisualisatieType;
  personen: PersoonType[];
  wonen: WonenType;
  algemeneGegevens: BerekenInvoerType;
  factor: number;
  legenda: any;

  constructor(gegevens: InvoerGegevensType) {
    this.vis = gegevens.visualisatie;
    this.personen = gegevens.personen;
    this.wonen = gegevens.wonen;
    this.algemeneGegevens = this.berekenAlgemeneGegevens(gegevens);
    this.factor = functies.factorBerekening(this.vis.periode);
  }

  getLegenda(): Legenda {
    if (this.legenda === undefined) {
      this.legenda = this.createLegenda();
    }
    return this.legenda;
  }

  createLegenda(): Legenda {}

  getYDomain(): number[] {
    return [0, this.vis.van_tot[1]];
  }

  getAlgemeneGegevens(): BerekenInvoerType {
    return this.algemeneGegevens;
  }

  getFactor(): number {
    return this.factor;
  }

  berekenAlgemeneGegevens(gegevens: InvoerGegevensType): BerekenInvoerType {
    let jaar = gegevens.visualisatie.jaar;
    let personen = gegevens.personen;
    let wonen = gegevens.wonen;
    let toeslagenpartner = functies.toeslagenPartner(personen);
    let aow = functies.aow(personen);
    let huren = functies.isHuur(wonen);

    return {
      toeslagenpartner: toeslagenpartner,
      aow: aow,
      iacbInkomen: iack.bepaalLaagsteArbeidsInkomenAnderen(personen),
      kinderbijslag: kbs.kinderbijslag(jaar, personen),
      maxKindgebondenBudget: kgb.maxKindgebondenBudget(jaar, personen, toeslagenpartner),
      huren: huren,
      eigenwoningforfait: huren ? 0 : hra.eigenwoningforfait(jaar, wonen.woz),
      hypotheekRenteAftrek: huren ? 0 : hra.hypotheekRenteAftrek(jaar, wonen.rente, wonen.woz),
    };
  }

  /**
   *
   * @param arbeidsInkomen arbeidsinkomen
   * @param visualisatie
   */
  bereken(arbeidsInkomen: number, visualisatie: VisualisatieTypeType): BerekenResultaatType {
    return null;
  }

  afronden(getal: number, factor: number): number {
    return +(getal * factor).toFixed(2);
  }

  afrondenNegIsNul(getal: number, factor: number, negIsNull: boolean): number {
    const afgerond = this.afronden(getal, factor);

    return negIsNull ? functies.negatiefIsNul(afgerond) : afgerond;
  }

  /**
   * Zet de gegevens om in het formaat dat de grafiek gebruikt.
   *
   * @param {*} alles map object waarin de berekende gegevens moeten worden opgeslagen
   * @param {*} gegevens gegevens die moeten worden opgeslagen
   * @param {number} id id waaronder deze gegevens in het alles object moeten worden opgeslagen
   */
  verzamelGrafiekSeries(alles, gegevens, id: number, negIsNull: boolean) {}
}
