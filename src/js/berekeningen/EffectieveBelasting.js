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
import { BeschikbaarInkomen } from "@/js/berekeningen/BeschikbaarInkomen";
import { EffectieveBelastingLegenda } from "@/js/grafieken/EffectieveBelastingLegenda";

/**
 * Berekend het belastingbedrag na verrekening van alle kortingen en toeslagen.
 */
export class EffectieveBelasting extends BeschikbaarInkomen {
  constructor(vis, personen, wonen) {
    super(vis, personen, wonen);
  }

  createLegenda() {
    return new EffectieveBelastingLegenda(this);
  }

  getYDomain() {
    return [0, 100];
  }

  getFactor() {
    return 1;
  }

  bereken(arbeidsInkomen) {
    const beschikbaarInkomen = this.berekenBeschikbaarInkomen(arbeidsInkomen);
    const totaal =
      beschikbaarInkomen.netto +
      beschikbaarInkomen.algemeneHeffingsKorting +
      beschikbaarInkomen.arbeidskorting +
      beschikbaarInkomen.inkomensafhankelijkeCombinatiekorting;
    const effectieveBelasting = Math.max(0, arbeidsInkomen - totaal);

    return {
      arbeidsInkomen: arbeidsInkomen,
      brutoInkomstenBelasting: beschikbaarInkomen.brutoInkomstenBelasting,
      effectieveBelasting: effectieveBelasting,
      effectieveBelastingPercentage: 100 * (effectieveBelasting / arbeidsInkomen),
    };
  }

  verzamelGrafiekSeries(alles, beschikbaarInkomen, id) {
    alles.push({
      id: id,
      type: "effectieve belasting",
      getal: this.afronden(beschikbaarInkomen.effectieveBelastingPercentage, this.getFactor()),
    });
  }
}
