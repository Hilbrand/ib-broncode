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
  setLegendaText(
    data,
    length,
    offset,
    colorFunction,
    legendaFunction,
    berekening
  ) {
    let totaal = 0;
    let b = berekening.bereken(data[offset].id);
    let ld = {
      grafiek: [],
      titel: "Salarisverhoging",
      arbeidsInkomen: data[offset].id,
    };

    for (let j = 0; j < length; j++) {
      let entry = data[offset + j];
      let getal = entry.getal;
      totaal += getal;
      ld.grafiek.unshift({
        color: colorFunction(j),
        naam: entry.type,
        percentage: this.percentage(getal),
        bedrag: this.geld(b.arbeidsinkomen * (getal / 100)),
      });
    }
    let md = b.arbeidsinkomen * 0.01 * totaal;
    ld.totals = [
      {
        naam: "marginale druk",
        percentage: this.percentage(totaal),
        bedrag: this.geld(md),
      },
      {
        naam: "netto",
        percentage: this.percentage(100 - totaal),
        bedrag: this.geld(b.arbeidsinkomen.toFixed() - md),
      },
      {
        naam: "bruto",
        percentage: this.percentage(100),
        bedrag: this.geld(b.arbeidsinkomen),
      },
    ];
    legendaFunction(ld);
  }

  getLabelYAs() {
    return "Marginale druk";
  }

  getFactorYas() {
    return 1;
  }
}
