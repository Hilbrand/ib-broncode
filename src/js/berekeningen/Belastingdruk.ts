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

import inkomen from "../belasting/inkomen";
import { BeschikbaarInkomen } from "./BeschikbaarInkomen";
import { BelastingdrukLegenda } from "../grafieken/BelastingdrukLegenda";
import { BelastingDrukResultaatType, InvoerGegevensType, VisualisatieTypeType } from "../../ts/types";

/**
 * Berekend het belastingbedrag na verrekening van alle kortingen en toeslagen.
 */
export class Belastingdruk extends BeschikbaarInkomen {
  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
  }

  createLegenda() {
    return new BelastingdrukLegenda(this);
  }

  getYDomain() {
    return [0, 100];
  }

  getFactor() {
    return 1;
  }

  bereken(arbeidsinkomen, visualisatie: VisualisatieTypeType): BelastingDrukResultaatType {
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);
    const beschikbaarInkomen = this.berekenBeschikbaarInkomen(arbeidsinkomen, anderenArbeidsinkomen, visualisatie);

    return {
      arbeidsinkomen: arbeidsinkomen,
      ibBox1: beschikbaarInkomen.ibBox1,
      belastingdrukPercentage: 100 * (beschikbaarInkomen.nettoLoonBelasting / arbeidsinkomen),
    };
  }

  verzamelGrafiekSeries(alles, beschikbaarInkomen, id) {
    alles.push({
      id: id,
      type: "Belastingdruk",
      getal: this.afronden(beschikbaarInkomen.belastingdrukPercentage, this.getFactor()),
    });
  }
}
