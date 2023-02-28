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
 * Legenda voor tonen effectieve belasting.
 */
export class EffectieveBelastingLegenda extends Legenda {
  setLegendaText(
    data,
    length,
    offset,
    colorFunction,
    legendaFunction,
    berekening
  ) {
    let b = berekening.bereken(data[offset].id);
    let ld = {
      grafiek: [],
      titel: "Effectieve belasting",
      arbeidsInkomen: b.arbeidsInkomen,
    };
    let entry = data[offset];
    ld.grafiek.push({
      color: colorFunction(0),
      naam: entry.type,
      percentage: this.percentage(b.effectieveBelastingPercentage),
      bedrag: this.geld(b.effectieveBelasting),
    });

    ld.totals = [
      {
        naam: "bruto",
        percentage: this.percentage(
          (100 * b.brutoInkomstenBelasting) / b.arbeidsInkomen
        ),
        bedrag: this.geld(b.brutoInkomstenBelasting),
      },
    ];
    legendaFunction(ld);
  }

  getLabelYAs() {
    return "Effectieve belasting";
  }
}
