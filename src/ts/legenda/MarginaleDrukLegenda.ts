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
import { MarginaleDruk } from "../berekeningen/MarginaleDruk";
import { SerieType } from "../types";
import { Legenda } from "./Legenda";

/**
 * Legenda voor tonen marginale druk.
 */
export class MarginaleDrukLegenda extends Legenda {
  constructor(berekenen: BerekenModel) {
    super(berekenen);
  }

  getLegendaTextInkomen(inkomen: number) {
    const series = [] as SerieType[];
    let b = this.berekenen.verzamelGrafiekSeries(series, inkomen, false);
    let ld = {
      grafiek: [] as any,
      titel: "Opbouw van de marginale druk met vermindering in toeslagen en kortingen",
      arbeidsInkomen: this.geld(inkomen),
      periode: this.berekenen.gegevens.visualisatie.periode,
    };
    const extraLoon = b.brutoloon;
    for (let j = 0; j < series.length; j++) {
      const entry = series[j];
      const getal = entry.getal;
      ld.grafiek.unshift({
        color: this.colorFunction(j),
        naam: entry.type,
        percentage: this.percentage(getal),
        bedrag: this.geld(extraLoon * (-getal / 100)),
      });
    }
    ld.bovenaan = [
      {
        naam: "bruto extra loon",
        percentage: this.percentage(100),
        bedrag: this.geld(extraLoon),
      },
    ];
    ld.totals = [
      {
        naam: "netto extra loon",
        percentage: this.percentage((this.berekenen as MarginaleDruk).toon(-b.nettoInkomen, b)),
        bedrag: this.geld(b.nettoInkomen),
      },
      {
        naam: "marginale druk",
        percentage: this.percentage(b.marginaleDruk),
        bedrag: this.geld(b.marginaleDruk * extraLoon * 0.01),
      },
    ];
    return ld;
  }

  getLabelYAs() {
    return "Marginale druk";
  }
}
