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
import { MarginaleDrukLegenda } from "../grafieken/MarginaleDrukLegenda";
import { Berekenen } from "./Berekenen";
import { BeschikbaarInkomen } from "./BeschikbaarInkomen";
import { BeschikbaarInkomenResultaatType, InvoerGegevensType, MarginaleDrukResultaatType, VisualisatieTypeType } from "../../ts/types";

export class MarginaleDruk extends Berekenen {
  bi: BeschikbaarInkomen;
  getalFunctie: (a:number, b:number, c:number, i:boolean) => number;

  // percentage of absolute getallen instellen.
  //
  constructor(gegevens: InvoerGegevensType, bi: BeschikbaarInkomen) {
    super(gegevens);
    this.bi = bi;
    this.bi.factor = 1; // Maak berekeningen altijd op jaarbasis. Visualisatie berekening per maand of jaar.
    this.getalFunctie = gegevens.visualisatie.type === VisualisatieTypeType.T ? this.mdAbsolute : this.mdPercentage;
  }

  createLegenda(): MarginaleDrukLegenda {
    return new MarginaleDrukLegenda(this);
  }

  getYDomain() {
    return [0, 100];
  }

  bereken(arbeidsInkomen: number): MarginaleDrukResultaatType {
    const berekening1 = this.bi.bereken(arbeidsInkomen);
    const berekening2 = this.bi.bereken(arbeidsInkomen + this.salarisVerhoging(arbeidsInkomen));

    return this.marginaleDruk(berekening1, berekening2);
  }

  salarisVerhoging(arbeidsInkomen: number): number {
    return this.vis.svt == "a" ? this.vis.sv_abs : arbeidsInkomen * (this.vis.sv_p / 100);
  }

  mdAbsolute(netto1: number, netto2: number, Δtotaal: number, inverse: boolean): number {
    const Δnetto = netto2 - netto1;

    return isNaN(Δnetto) || Δnetto == 0 ? 0 : inverse ? -Δnetto : 1 * Δnetto;
  }

  mdPercentage(netto1: number, netto2: number, Δtotaal: number, inverse: boolean): number {
    const Δnetto = netto2 - netto1;
    const percentage = Δtotaal == 0 ? 0 : Δnetto / Δtotaal;
    const result: number = +(percentage * 100).toFixed(2);
    return isNaN(result) || result == 0 ? 0 : inverse ? -result : 1 * result;
  }

  inkomstenBelastingAangepast(berekening: BeschikbaarInkomenResultaatType): number {
    return berekening.brutoInkomstenBelasting - (berekening.algemeneHeffingsKorting + berekening.arbeidskorting);
  }

  nettoInkomensBelasting(
    berekening1: BeschikbaarInkomenResultaatType,
    berekening2: BeschikbaarInkomenResultaatType,
    ΔBruto: number,
    ΔalgemeneHeffingsKorting: number,
    Δarbeidskorting: number,
    negativeSumΔtoeslagen: number
  ): number {
    let nettoInkomensBelasting = this.getalFunctie(
      this.inkomstenBelastingAangepast(berekening1),
      this.inkomstenBelastingAangepast(berekening2),
      ΔBruto,
      false
    );

    return nettoInkomensBelasting - (ΔalgemeneHeffingsKorting + Δarbeidskorting);
  }

  marginaleDrukTotaal(alles, berekening1, berekening2, id) {
    let ΔNetto = berekening2.beschikbaarInkomen - berekening1.beschikbaarInkomen;
    let ΔBruto = berekening2.arbeidsinkomen - berekening1.arbeidsinkomen;
    let md = ΔNetto > 0 ? +(100 - (ΔNetto / ΔBruto) * 100).toFixed(2) : 0;

    alles.push({
      id: id,
      type: "marginale druk",
      getal: isNaN(md) ? 0 : md,
    });
  }

  belastingdruk(alles, berekening1: BeschikbaarInkomenResultaatType, id: number) {
    let belastingdruk =
      berekening1.arbeidsinkomen > 0
        ? functies.negatiefIsNul(100 - (berekening1.beschikbaarInkomen / berekening1.arbeidsinkomen) * 100)
        : 0;
    alles.push({
      id: id,
      type: "belastingdruk",
      getal: belastingdruk < 0 ? 0 : belastingdruk.toFixed(2),
    });
  }

  sumNegative(values: number[]): number {
    return values.filter((v) => v < 0).reduce((a, b) => a + -b, 0);
  }

  marginaleDruk(berekening1: BeschikbaarInkomenResultaatType, berekening2: BeschikbaarInkomenResultaatType): MarginaleDrukResultaatType {
    let ΔBruto = berekening2.arbeidsinkomen - berekening1.arbeidsinkomen;
    let md = 100 - this.mdPercentage(berekening1.beschikbaarInkomen, berekening2.beschikbaarInkomen, ΔBruto, false);

    let ΔalgemeneHeffingsKorting = functies.negatiefIsNul(
      this.getalFunctie(berekening1.algemeneHeffingsKorting, berekening2.algemeneHeffingsKorting, ΔBruto, true)
    );
    let Δarbeidskorting = functies.negatiefIsNul(
      this.getalFunctie(berekening1.arbeidskorting, berekening2.arbeidskorting, ΔBruto, true)
    );

    let Δtoeslagen = {
      zorgtoeslag: this.getalFunctie(berekening1.zorgtoeslag, berekening2.zorgtoeslag, ΔBruto, true),
      wonen: this.getalFunctie(berekening1.wonen, berekening2.wonen, ΔBruto, true),
      kinderbijslag: this.getalFunctie(berekening1.kinderbijslag, berekening2.kinderbijslag, ΔBruto, true),
      kindgebondenBudget: this.getalFunctie(
        berekening1.kindgebondenBudget,
        berekening2.kindgebondenBudget,
        ΔBruto,
        true
      ),
      inkomensafhankelijkeCombinatiekorting: this.getalFunctie(
        berekening1.inkomensafhankelijkeCombinatiekorting,
        berekening2.inkomensafhankelijkeCombinatiekorting,
        ΔBruto,
        true
      ),
    };
    let negativeSumΔtoeslagen = this.sumNegative([
      Δtoeslagen.zorgtoeslag,
      Δtoeslagen.wonen,
      Δtoeslagen.kinderbijslag,
      Δtoeslagen.kindgebondenBudget,
      Δtoeslagen.inkomensafhankelijkeCombinatiekorting,
    ]);
    let nib = this.nettoInkomensBelasting(
      berekening1,
      berekening2,
      ΔBruto,
      ΔalgemeneHeffingsKorting,
      Δarbeidskorting,
      negativeSumΔtoeslagen
    );
    let nettoInkomensBelastingNul = functies.negatiefIsNul(nib - negativeSumΔtoeslagen);

    return {
      arbeidsinkomen: berekening1.arbeidsinkomen,
      nettoInkomensBelasting: nettoInkomensBelastingNul,
      nettoLoon: berekening2.arbeidsinkomen - berekening1.arbeidsinkomen + ΔalgemeneHeffingsKorting + Δarbeidskorting,
      extraLoon: berekening2.arbeidsinkomen - berekening1.arbeidsinkomen,
      algemeneHeffingsKorting: ΔalgemeneHeffingsKorting,
      arbeidskorting: Δarbeidskorting,
      zorgtoeslag: functies.negatiefIsNul(Δtoeslagen.zorgtoeslag),
      wonen: functies.negatiefIsNul(Δtoeslagen.wonen),
      kinderbijslag: functies.negatiefIsNul(Δtoeslagen.kinderbijslag),
      kindgebondenBudget: functies.negatiefIsNul(Δtoeslagen.kindgebondenBudget),
      inkomensafhankelijkeCombinatiekorting: functies.negatiefIsNul(Δtoeslagen.inkomensafhankelijkeCombinatiekorting),
      marginaleDruk: md,
    };
  }

  verzamelGrafiekSeries(alles, marginaleDruk, id) {
    alles.push({
      id: id,
      type: "netto belasting",
      getal: this.afronden(marginaleDruk.nettoInkomensBelasting, this.bi.factor),
    });
    this.bi.verzamelGrafiekSeries(alles, marginaleDruk, id);
  }
}
