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
 * Legenda voor tonen marginale druk.
 */
export class MarginaleDrukLegenda extends Legenda {
  constructor(berekenen) {
    super(berekenen);
  }

  setLegendaText(data, length, offset) {
    let b = this.berekenGetallen(data[offset]);
    let ld = {
      grafiek: [],
      titel: "Opbouw van de marginale druk met vermindering in toeslagen en kortingen",
      arbeidsInkomen: data[offset].id.toFixed(),
    };
    let factor = this.berekenen.getFactor();

    for (let j = 0; j < length; j++) {
      const entry = data[offset + j];
      const getal = entry.getal;
      ld.grafiek.unshift({
        color: this.colorFunction(j),
        naam: entry.type,
        percentage: this.percentage(getal),
        bedrag: this.geld(b.extraLoon * factor * (-getal / 100)),
      });
    }
    ld.totals = [
      {
        naam: "marginale druk",
        percentage: this.percentage(b.marginaleDruk),
        bedrag: this.geld(b.marginaleDruk * factor * b.extraLoon * 0.01),
      },
      {
        naam: "netto extra loon",
        percentage: this.percentage(b.nettoInkomen / (b.extraLoon * 100)),
        bedrag: this.geld(b.nettoInkomen * factor),
      },
      {
        naam: "bruto extra loon",
        percentage: this.percentage(100),
        bedrag: this.geld(b.extraLoon * factor),
      },
    ];
    this.legendaFunction(ld);
  }

  getLabelYAs() {
    return "Marginale druk";
  }

  getFactorYas() {
    return 1;
  }
}
