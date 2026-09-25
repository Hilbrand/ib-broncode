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

import { BerekenModel } from "../berekeningen/BerekenModel";
import { SerieType } from "../types";
import { Legenda } from "./Legenda";

/**
 * Legenda voor tonen Verschil in inkomen.
 */
export class JaarVergelijkenLegenda extends Legenda {
  constructor(berekenen: BerekenModel) {
    super(berekenen);
  }

  getLegendaTextInkomen(inkomen: number) {
    const series = [] as SerieType[];
    const b = this.berekenen.verzamelGrafiekSeries(series, inkomen, false);
    let ld = {
      grafiek: [] as any,
      titel: "Beschikbaar inkomen",
      arbeidsInkomen: this.geld(inkomen),
      periode: this.berekenen.gegevens.visualisatie.periode,
      bovenaan: [],
      totals: [] as any,
    };

    for (let j = 0; j < series.length; j++) {
      let entry = series[j];
      ld.grafiek.unshift({
        color: this.colorFunction(j),
        naam: entry.type,
        bedrag: this.geld(entry.getal),
      });
    }
    ld.totals = [
      { naam: "netto verschil", bedrag: this.geld(b.nettoInkomen) },
      { naam: "netto percentage", bedrag: this.percentage((b.nettoInkomen / b.brutoloon1) * 100) },
    ];
    return ld;
  }

  getLabelYAs() {
    return "";
  }
}
