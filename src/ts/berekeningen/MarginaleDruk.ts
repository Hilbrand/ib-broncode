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

import { MarginaleDrukLegenda } from "../legenda/MarginaleDrukLegenda";
import {
  BerekenResultaatType,
  InvoerGegevensType,
  MarginaleDrukResultaatType,
  PersoonType,
  SalarisVerhogingType,
  SerieType,
} from "../types";
import inkomen from "../belasting/inkomen";
import { Berekenen } from "./Berekenen";
import functies from "../functies";
import { BerekenModel, Presentatie } from "./BerekenModel";
import { VergelijkBerekening } from "./VergelijkBerekenen";

export class MarginaleDruk extends BerekenModel implements Presentatie {
  vergelijker: VergelijkBerekening;
  bi: Berekenen;
  personen: PersoonType[];

  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
    this.vergelijker = new VergelijkBerekening(gegevens);
    this.personen = gegevens.personen;
    this.bi = new Berekenen(gegevens, gegevens.visualisatie.jaar);
  }

  createLegenda(): MarginaleDrukLegenda {
    return new MarginaleDrukLegenda(this);
  }

  getYDomain(): number[] {
    return [0, 100];
  }

  getFactorYas(): number {
    return 1;
  }

  extraLoon(arbeidsInkomen: number): number {
    return this.gegevens.visualisatie.svt == SalarisVerhogingType.A
      ? this.gegevens.visualisatie.sv_abs
      : arbeidsInkomen * (this.gegevens.visualisatie.sv_p * 0.01);
  }

  bereken<T>(arbeidsinkomen: number, nettoZonderKinderbijslag: boolean): MarginaleDrukResultaatType {
    // Andere arbeidsinkomen moet berekend worden over eerste arbeidsinkomen en niet over inkomen + extra loon
    // Daarom hier uit rekenen en doorgeven aan beide functie aanroepen.
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);
    const berekening1 = this.bi.berekenBeschikbaarInkomen(
      arbeidsinkomen,
      anderenArbeidsinkomen,
      nettoZonderKinderbijslag
    );
    const berekening2 = this.bi.berekenBeschikbaarInkomen(
      arbeidsinkomen + this.extraLoon(arbeidsinkomen),
      anderenArbeidsinkomen,
      nettoZonderKinderbijslag
    );

    let vergelijking = this.vergelijker.vergelijk(berekening1, berekening2) as MarginaleDrukResultaatType;
    vergelijking.brutoloon1 = berekening1.brutoloon;
    vergelijking.arbeidsinkomen1 = berekening1.arbeidsinkomen;
    vergelijking.toetsingsInkomen1 = berekening1.toetsingsInkomen;
    vergelijking.anderenArbeidsinkomen = berekening1.anderenArbeidsinkomen;
    vergelijking.marginaleDruk = this.percentage(
      vergelijking.brutoloon - vergelijking.nettoInkomen,
      vergelijking.brutoloon,
      false
    );
    return vergelijking;
  }

  percentage(Δbedrag: number, Δtotaal: number, inverse: boolean): number {
    const percentage = Δtotaal == 0 ? 0 : Δbedrag / Δtotaal;
    const result: number = +(percentage * 100).toFixed(2);

    return Math.max(0, isNaN(result) || result == 0 ? 0 : inverse ? -result : result);
  }

  toon(getal: number, resultaat: BerekenResultaatType): number {
    return functies.afronden(this.percentage(getal, resultaat.brutoloon, true), 1);
  }

  verzamelGrafiekSeries(series: SerieType[], inkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType {
    const resultaat = this.bereken(inkomen, nettoZonderKinderbijslag);
    const id = inkomen * this.getIndexFactor();

    series.push({
      id: id,
      type: "netto loon belasting",
      getal: this.toon(resultaat.nettoloonBelastingGrafiek, resultaat),
    });
    this.verzamelGrafiekSeriesInkomen(series, resultaat, id, this);
    series.push({
      id: id,
      type: "pensioen premie",
      getal: this.toon(resultaat.pensioenPremie, resultaat),
    });
    return resultaat;
  }
}
