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
import { BelastingdrukLegenda } from "../legenda/BelastingdrukLegenda";
import { BelastingDrukResultaatType, BerekenResultaatType, InvoerGegevensType, PersoonType, SerieType } from "../types";
import functies from "../functies";
import { BerekenModel } from "./BerekenModel";
import { Berekenen } from "./Berekenen";

/**
 * Berekend het belastingbedrag na verrekening van alle kortingen en toeslagen.
 */
export class Belastingdruk extends BerekenModel {
  bi: Berekenen;
  personen: PersoonType[];

  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
    this.bi = new Berekenen(gegevens, gegevens.visualisatie.jaar);
    this.personen = gegevens.personen;
  }

  createLegenda() {
    return new BelastingdrukLegenda(this);
  }

  getYDomain() {
    return [0, 100];
  }

  getFactorYas() {
    return 1;
  }

  bereken(arbeidsinkomen: number, nettoZonderKinderbijslag: boolean): BelastingDrukResultaatType {
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);
    const beschikbaarInkomen = this.bi.berekenBeschikbaarInkomen(
      arbeidsinkomen,
      anderenArbeidsinkomen,
      nettoZonderKinderbijslag
    );

    return {
      arbeidsinkomen: arbeidsinkomen,
      ibBox1: beschikbaarInkomen.ibBox1,
      belastingdrukPercentage: 100 * (beschikbaarInkomen.nettoloonBelasting / arbeidsinkomen),
    } as BelastingDrukResultaatType;
  }

  verzamelGrafiekSeries(series: SerieType[], inkomen: number, nettoZonderKinderbijslag: boolean): BerekenResultaatType {
    const resultaat = this.bereken(inkomen, nettoZonderKinderbijslag);
    const id = inkomen * this.getIndexFactor();

    series.push({
      id: id,
      type: "Belastingdruk",
      getal: functies.afronden(resultaat.belastingdrukPercentage, 1),
    });
    return resultaat;
  }
}
