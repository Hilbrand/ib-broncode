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
import { BeschikbaarInkomenLegenda } from "../legenda/BeschikbaarInkomenLegenda";
import { Legenda } from "../legenda/Legenda";
import { BerekenResultaatType, InvoerGegevensType, SerieType } from "../types";
import { BerekenModel, Presentatie } from "./BerekenModel";
import { Berekenen } from "./Berekenen";

export class BeschikbaarInkomen extends BerekenModel implements Presentatie {
  bi: Berekenen;

  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
    this.bi = new Berekenen(gegevens, gegevens.visualisatie.jaar);
  }

  createLegenda(): Legenda {
    return new BeschikbaarInkomenLegenda(this) as Legenda;
  }

  getYDomain(): number[] | undefined {
    let yAs: number = this.gegevens.visualisatie.van_tot[1];
    // Zet y-as minimaal op 35_000, omdat ~beneden dat bedrag totaal meer is dan inkomen en dan boven grafiek uit zou komen.
    return [0, Math.round(Math.max(yAs, 35_000) / (1000 / this.getIndexFactor()))]
  }

  getFactorYas() {
    return 1 / (1000 / this.getIndexFactor());
  }

  bereken(arbeidsInkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType {
    return this.bi.bereken(arbeidsInkomen, nettoZonderKinderbijslag);
  }

  toon(getal: number, resultaat: BerekenResultaatType): number {
    return functies.afronden(getal, 1);
  }

  verzamelGrafiekSeries(series: SerieType[], inkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType {
    const resultaat = this.bi.bereken(inkomen, nettoZonderKinderbijslag);
    const id = inkomen * this.getIndexFactor();
    series.push({
      id: id,
      type: "netto",
      getal: this.toon(resultaat.nettoArbeidsinkomen, resultaat),
    });
    this.verzamelGrafiekSeriesInkomen(series, resultaat, id, this);
    return resultaat;
  }
}
