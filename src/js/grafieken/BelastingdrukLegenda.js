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

import { Legenda } from "@/js/grafieken/Legenda";

/**
 * Legenda voor tonen Belastingdruk.
 */
export class BelastingdrukLegenda extends Legenda {
  constructor(berekenen) {
    super(berekenen);
  }

  setLegendaText(data, length, offset) {
    let entry = data[offset];
    let b = this.berekenGetallen(data[offset]);
    let ld = {
      grafiek: [],
      titel: "Belastingdruk",
      arbeidsInkomen: data[offset].id.toFixed(),
    };

    ld.grafiek.push({
      color: this.colorFunction(0),
      naam: entry.type,
      percentage: this.percentage(entry.getal),
      bedrag: this.geld(entry.getal * entry.id * 0.01),
    });

    ld.totals = [
      {
        naam: "bruto belasting",
        percentage: this.percentage((100 * b.ibBox1) / b.arbeidsInkomen),
        bedrag: this.geld(b.ibBox1 * this.berekenen.getFactor()),
      },
    ];
    this.legendaFunction(ld);
  }

  getLabelYAs() {
    return "Belastingdruk";
  }
}
