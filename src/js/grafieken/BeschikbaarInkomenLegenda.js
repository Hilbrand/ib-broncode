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
 * Legenda voor tonen beschikbaar inkomen.
 */
export class BeschikbaarInkomenLegenda extends Legenda {
  constructor(berekenen) {
    super(berekenen);
  }

  setLegendaText(data, length, offset) {
    let totaal = 0;
    let b = this.berekenGetallen(data[offset]);
    let ld = {
      grafiek: [],
      titel: "Beschikbaar inkomen",
      arbeidsInkomen: data[offset].id.toFixed(),
    };

    for (let j = 0; j < length; j++) {
      let entry = data[offset + j];
      let getal = entry.getal;
      totaal += getal;
      ld.grafiek.unshift({
        color: this.colorFunction(j),
        naam: entry.type,
        bedrag: this.geld(entry.getal),
      });
    }
    ld.totals = [
      { naam: "beschikbaar inkomen", bedrag: this.geld(totaal) },
      {
        naam: "arbeidsinkomen",
        bedrag: this.geld(b.arbeidsinkomen * this.berekenen.getFactor()),
      },
      { naam: "inkomstenbelasting box 1", bedrag: this.geld(b.ibBox1) },
    ];
    this.legendaFunction(ld);
  }

  getLabelYAs() {
    return "Beschikbaar inkomen in x " + Legenda.EURO + " 1.000";
  }

  getFactorYas() {
    return 1 / 1000;
  }
}
