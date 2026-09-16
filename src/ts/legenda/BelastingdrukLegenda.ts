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
 * Legenda voor tonen Belastingdruk.
 */
export class BelastingdrukLegenda extends Legenda {
  constructor(berekenen: BerekenModel) {
    super(berekenen);
  }

  getLegendaTextInkomen(inkomen: number) {
    const series = [] as SerieType[];
    let b = this.berekenen.verzamelGrafiekSeries(series, inkomen, false);
    let ld = {
      grafiek: [] as any,
      titel: "Belastingdruk",
      arbeidsInkomen: this.geld(inkomen),
      periode: this.berekenen.gegevens.visualisatie.periode,
      bovenaan: [],
      totals: [] as any,
    };

    const entry = series[0];
    ld.grafiek.push({
      color: this.colorFunction(0),
      naam: entry.type,
      percentage: this.percentage(entry.getal),
      bedrag: this.geld((entry.getal / 100) * b.arbeidsinkomen),
    });

    ld.totals = [
      {
        naam: "bruto belasting",
        percentage: this.percentage((100 * b.ibBox1) / b.arbeidsinkomen),
        bedrag: this.geld(b.ibBox1),
      },
    ];
    return ld;
  }

  getLabelYAs() {
    return "Belastingdruk";
  }
}
