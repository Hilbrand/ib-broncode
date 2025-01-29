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
  WoningType,
} from "../../ts/types";
import inkomen from "../belasting/inkomen";

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

  bereken(arbeidsinkomen: number, visualisatie: VisualisatieTypeType): MarginaleDrukResultaatType {
    // Andere arbeidsinkomen moet berekend worden over eerste arbeidsinkomen en niet over inkomen + extra loon
    // Daarom hier uit rekenen en doorgeven aan beide functie aanroepen.
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);
    const berekening1 = this.bi.berekenBeschikbaarInkomen(arbeidsinkomen, anderenArbeidsinkomen, visualisatie);
    const berekening2 = this.bi.berekenBeschikbaarInkomen(
      arbeidsinkomen + this.extraLoon(arbeidsinkomen),
      anderenArbeidsinkomen,
      visualisatie
    );

    return this.marginaleDruk(berekening1, berekening2, visualisatie);
  }

  extraLoon(arbeidsInkomen: number): number {
    return this.vis.svt == "a" ? this.vis.sv_abs : arbeidsInkomen * (this.vis.sv_p * 0.01);
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
    const grafiek = visualisatie === VisualisatieTypeType.G;
    const presentatieFunctie = grafiek ? this.percentage : this.absolute;

    const ΔextraLoon = berekening2.brutoloon - berekening1.brutoloon;
    const ΔibBox1 = this.mdAbsolute(berekening1.ibBox1, berekening2.ibBox1, false);

    const ΔhraMax = this.mdAbsolute(berekening1.hraMax, berekening2.hraMax, false);
    const Δak = this.mdAbsolute(berekening1.ak, berekening2.ak, false);
    const ΔakMax = this.mdAbsolute(berekening1.akMax, berekening2.akMax, false);
    const Δiack = this.mdAbsolute(berekening1.iack, berekening2.iack, false);
    const ΔiackMax = this.mdAbsolute(berekening1.iackMax, berekening2.iackMax, false);

    // Als tabel toon dan
    const Δahk = this.mdAbsolute(berekening1.ahk, berekening2.ahk, false);
    const ΔahkMax = this.mdAbsolute(berekening1.ahkMax, berekening2.ahkMax, false);

    const Δnvzk = this.mdAbsolute(berekening2.nvzk, berekening1.nvzk, false);

    const Δzt = this.mdAbsolute(berekening1.zt, berekening2.zt, false);
    const Δwonen = this.mdAbsolute(berekening1.wonen, berekening2.wonen, false);
    const Δkb = this.mdAbsolute(berekening1.kb, berekening2.kb, false);
    const Δkgb = this.mdAbsolute(berekening1.kgb, berekening2.kgb, false);

    const ΔnettoLoon = berekening2.nettoLoon - berekening1.nettoLoon;
    const ΔnettoInkomen = berekening2.nettoInkomen - berekening1.nettoInkomen;
    const Δhuurtoeslag = this.wonen.woning_type === WoningType.HUUR ? Δwonen : 0;
    const ΔnettoArbeidsinkomen = ΔnettoLoon + (Δzt + Δhuurtoeslag + Δkb + Δkgb);

    const ΔnettoLoonBelasting = this.mdAbsolute(berekening1.nettoLoonBelasting, berekening2.nettoLoonBelasting, false);
    // Als grafiek dan trek positieve kortingen van loonbelasting af omdat grafiek geen positieve
    // bedragen toont wordt dit verrekend met de te betalen belasting. In de legenda zijn positieve
    // bedragen ook niet te zien. Maar wel als de tabel wordt getoond.
    const nettoLoonBelastingPresentatie = grafiek
      ? -functies.negatiefIsNul(
          ΔnettoLoonBelasting +
            functies.positiefIsNul(Δahk) +
            functies.positiefIsNul(Δak) +
            functies.positiefIsNul(Δiack) +
            functies.positiefIsNul(Δnvzk)
        )
      : ΔnettoLoonBelasting;
    const md = ΔextraLoon - ΔnettoInkomen;

    return {
      brutoloon: berekening1.brutoloon,
      arbeidsinkomen: berekening1.arbeidsinkomen,
      anderenArbeidsinkomen: berekening1.anderenArbeidsinkomen,
      pensioenPremie: presentatieFunctie(berekening1.pensioenPremie - berekening2.pensioenPremie, ΔextraLoon, grafiek),
      extraLoon: ΔextraLoon,
      ibBox1: presentatieFunctie(ΔibBox1, ΔextraLoon, true),
      nettoLoonBelasting: presentatieFunctie(nettoLoonBelastingPresentatie, ΔextraLoon, grafiek),
      nettoInkomen: presentatieFunctie(ΔnettoInkomen, ΔextraLoon, grafiek),
      nettoArbeidsinkomen: presentatieFunctie(ΔnettoArbeidsinkomen, ΔextraLoon, grafiek),
      nettoLoon: presentatieFunctie(ΔnettoLoon, ΔextraLoon, grafiek),
      marginaleDruk: this.percentage(md, ΔextraLoon, false),

      hraMax: presentatieFunctie(ΔhraMax, ΔextraLoon, grafiek),
      ak: presentatieFunctie(Δak, ΔextraLoon, grafiek),
      akMax: presentatieFunctie(ΔakMax, ΔextraLoon, grafiek),
      iack: presentatieFunctie(Δiack, ΔextraLoon, grafiek),
      iackMax: presentatieFunctie(ΔiackMax, ΔextraLoon, grafiek),
      ahk: presentatieFunctie(grafiek ? Δahk - functies.positiefIsNul(Δnvzk) : Δahk, ΔextraLoon, grafiek),
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
