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
import {
  BeschikbaarInkomenResultaatType,
  InvoerGegevensType,
  MarginaleDrukResultaatType,
  VisualisatieTypeType,
} from "../../ts/types";

export class MarginaleDruk extends Berekenen {
  bi: BeschikbaarInkomen;

  constructor(gegevens: InvoerGegevensType, bi: BeschikbaarInkomen) {
    super(gegevens);
    this.bi = bi;
    this.bi.factor = 1; // Maak berekeningen altijd op jaarbasis. Visualisatie berekening per maand of jaar.
  }

  createLegenda(): MarginaleDrukLegenda {
    return new MarginaleDrukLegenda(this);
  }

  getYDomain() {
    return [0, 100];
  }

  bereken(arbeidsInkomen: number, visualisatie: VisualisatieTypeType): MarginaleDrukResultaatType {
    const berekening1 = this.bi.bereken(arbeidsInkomen, visualisatie);
    const berekening2 = this.bi.bereken(arbeidsInkomen + this.extraLoon(arbeidsInkomen), visualisatie);

    return this.marginaleDruk(berekening1, berekening2, visualisatie);
  }

  extraLoon(arbeidsInkomen: number): number {
    return this.vis.svt == "a" ? this.vis.sv_abs : arbeidsInkomen * (this.vis.sv_p / 100);
  }

  mdAbsolute(netto1: number, netto2: number, inverse: boolean): number {
    const Δnetto = netto2 - netto1;

    return isNaN(Δnetto) || Δnetto == 0 ? 0 : inverse ? -Δnetto : 1 * Δnetto;
  }

  absolute(Δbedrag: number, Δtotaal: number, inverse: boolean): number {
    return inverse && Δbedrag != 0 ? -Δbedrag : Δbedrag;
  }

  percentage(Δbedrag: number, Δtotaal: number, inverse: boolean): number {
    const percentage = Δtotaal == 0 ? 0 : Δbedrag / Δtotaal;
    const result: number = +(percentage * 100).toFixed(2);
    return Math.max(0, isNaN(result) || result == 0 ? 0 : inverse ? -result : 1 * result);
  }

  marginaleDruk(
    berekening1: BeschikbaarInkomenResultaatType,
    berekening2: BeschikbaarInkomenResultaatType,
    visualisatie: VisualisatieTypeType
  ): MarginaleDrukResultaatType {
    const tabel = visualisatie === VisualisatieTypeType.T;
    const grafiek = visualisatie === VisualisatieTypeType.G;
    const presentatieFunctie = tabel ? this.absolute : this.percentage;

    const ΔextraLoon = berekening2.arbeidsinkomen - berekening1.arbeidsinkomen;
    const ΔibBox1 = this.mdAbsolute(berekening1.ibBox1, berekening2.ibBox1, false);

    const ΔhraMax = this.mdAbsolute(berekening1.hraMax, berekening2.hraMax, false);
    const Δak = this.mdAbsolute(berekening1.ak, berekening2.ak, false);
    const ΔakMax = this.mdAbsolute(berekening1.akMax, berekening2.akMax, false);
    const Δiack = this.mdAbsolute(berekening1.iack, berekening2.iack, false);
    const ΔiackMax = this.mdAbsolute(berekening1.iackMax, berekening2.iackMax, false);

    // Als tabel toon dan
    const Δahk = this.mdAbsolute(berekening1.ahk, berekening2.ahk, false);
    const ΔahkMax = this.mdAbsolute(berekening1.ahkMax, berekening2.ahkMax, false);

    const Δnvzk = this.mdAbsolute(berekening1.nvzk, berekening2.nvzk, false);
    // als grafiek dan
    const maxLoonBelasting = grafiek
      ? -functies.negatiefIsNul(
          ΔibBox1 -
            (functies.negatiefIsNul(Δahk) +
              functies.negatiefIsNul(Δak) +
              functies.negatiefIsNul(Δiack) +
              functies.negatiefIsNul(Δnvzk))
        )
      : this.mdAbsolute(berekening1.nettoLoonBelasting, berekening2.nettoLoonBelasting, false);

    const Δzt = this.mdAbsolute(berekening1.zt, berekening2.zt, false);
    const Δwonen = this.mdAbsolute(berekening1.wonen, berekening2.wonen, false);
    const Δkb = this.mdAbsolute(berekening1.kb, berekening2.kb, false);
    const Δkgb = this.mdAbsolute(berekening1.kgb, berekening2.kgb, false);

    const ΔnettoLoon = berekening2.nettoLoon - berekening1.nettoLoon;
    const ΔnettoInkomen = berekening2.nettoInkomen - berekening1.nettoInkomen;
    const ΔnettoArbeidsinkomen = ΔnettoLoon + (Δzt + Δwonen + Δkb + Δkgb);
    const md = ΔextraLoon - ΔnettoArbeidsinkomen;

    return {
      arbeidsinkomen: berekening1.arbeidsinkomen,
      extraLoon: ΔextraLoon,
      ibBox1: presentatieFunctie(ΔibBox1, ΔextraLoon, true),
      nettoLoonBelasting: presentatieFunctie(maxLoonBelasting, ΔextraLoon, grafiek),
      nettoInkomen: presentatieFunctie(ΔnettoInkomen, ΔextraLoon, grafiek),
      nettoArbeidsinkomen: presentatieFunctie(ΔnettoArbeidsinkomen, ΔextraLoon, grafiek),
      nettoLoon: presentatieFunctie(ΔnettoLoon, ΔextraLoon, grafiek),
      marginaleDruk: this.percentage(md, ΔextraLoon, false),

      hraMax: presentatieFunctie(ΔhraMax, ΔextraLoon, grafiek),
      ak: presentatieFunctie(Δak, ΔextraLoon, grafiek),
      akMax: presentatieFunctie(ΔakMax, ΔextraLoon, grafiek),
      iack: presentatieFunctie(Δiack, ΔextraLoon, grafiek),
      iackMax: presentatieFunctie(ΔiackMax, ΔextraLoon, grafiek),
      ahk: presentatieFunctie(tabel ? Δahk : Δahk - Δnvzk, ΔextraLoon, grafiek),
      ahkMax: presentatieFunctie(ΔahkMax, ΔextraLoon, grafiek),
      nvzk: presentatieFunctie(Δnvzk, ΔextraLoon, grafiek),

      zt: presentatieFunctie(Δzt, ΔextraLoon, grafiek),
      wonen: presentatieFunctie(Δwonen, ΔextraLoon, grafiek),
      kb: presentatieFunctie(Δkb, ΔextraLoon, grafiek),
      kgb: presentatieFunctie(Δkgb, ΔextraLoon, grafiek),
    };
  }

  verzamelGrafiekSeries(alles, marginaleDruk, id: number, negIsNull: boolean) {
    alles.push({
      id: id,
      type: "netto belasting",
      getal: this.afronden(marginaleDruk.nettoLoonBelasting, this.bi.factor),
    });
    this.bi.verzamelGrafiekSeries(alles, marginaleDruk, id, negIsNull);
  }
}
