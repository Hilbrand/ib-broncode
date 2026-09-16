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

import { BerekenResultaatType, InvoerGegevensType, MarginaleDrukResultaatType, PersoonType, SerieType } from "../types";
import inkomen from "../belasting/inkomen";
import { Berekenen } from "./Berekenen";
import functies from "../functies";
import { JaarVergelijkenLegenda } from "../legenda/JaarVergelijkenLegenda";
import { BerekenModel, Presentatie } from "./BerekenModel";
import { VergelijkBerekening } from "./VergelijkBerekenen";

export class JaarVergelijken extends BerekenModel implements Presentatie {
  vergelijker: VergelijkBerekening;
  bi: Berekenen;
  bi2: Berekenen;
  personen: PersoonType[];

  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
    this.vergelijker = new VergelijkBerekening(gegevens);
    this.bi = new Berekenen(gegevens, gegevens.visualisatie.jaar);
    this.bi2 = new Berekenen(gegevens, gegevens.visualisatie.jaar2);
    this.personen = gegevens.personen;
  }

  createLegenda(): JaarVergelijkenLegenda {
    return new JaarVergelijkenLegenda(this);
  }

  getYDomain(): number[] | undefined {
    return undefined;
  }

  getFactorYas() {
    return this.getIndexFactor();
  }

  mdAbsolute(netto1: number, netto2: number, absoluut: boolean): number {
    return netto2 - netto1;
  }

  delta(Δbedrag: number, Δtotaal: number, absoluut: boolean): number {
    return Δbedrag;
  }

  toon(getal: number, resultaat: BerekenResultaatType): number {
    return functies.afronden(getal, 1);
  }

  bereken(arbeidsinkomen: number, nettoZonderKinderbijslag: boolean): MarginaleDrukResultaatType {
    // Andere arbeidsinkomen moet berekend worden over eerste arbeidsinkomen en niet over inkomen + extra loon
    // Daarom hier uit rekenen en doorgeven aan beide functie aanroepen.
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);
    const berekening1 = this.bi.berekenBeschikbaarInkomen(
      arbeidsinkomen,
      anderenArbeidsinkomen,
      nettoZonderKinderbijslag
    );
    const berekening2 = this.bi2.berekenBeschikbaarInkomen(
      arbeidsinkomen,
      anderenArbeidsinkomen,
      nettoZonderKinderbijslag
    );

    return this.vergelijker.vergelijk(berekening2, berekening1) as MarginaleDrukResultaatType;
  }

  verzamelGrafiekSeries(series: SerieType[], inkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType {
    const resultaat = this.bereken(inkomen, nettoZonderKinderbijslag);
    const id = inkomen * this.getIndexFactor();
    series.push({
      id: id,
      type: "inkomstenbelasting box 1",
      getal: this.toon(resultaat.ibBox1, resultaat),
    });

    this.verzamelGrafiekSeriesInkomen(series, resultaat, id, this);
    return resultaat;
  }
}
