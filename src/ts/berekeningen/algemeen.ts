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

import { BeschikbaarInkomen } from "./BeschikbaarInkomen";
import { MarginaleDruk } from "./MarginaleDruk";
import { Belastingdruk } from "./Belastingdruk";
import { BerekenResultaatType, InvoerGegevensType, PeriodeType, SerieType, TabType, VisualisatieTypeType } from "../types";
import { JaarVergelijken } from "./JaarVergelijken";
import { BerekenModel } from "./BerekenModel";
import functies from "../functies";

function berekenenMethode(gegevens: InvoerGegevensType): BerekenModel {
  let berekenen: BerekenModel;

  switch (gegevens.tab) {
    case TabType.BI:
    default:
      berekenen = new BeschikbaarInkomen(gegevens);
      break;
    case TabType.MD:
      berekenen = new MarginaleDruk(gegevens);
      break;
    case TabType.BD:
      berekenen = new Belastingdruk(gegevens);
      break;
    case TabType.VJ:
      berekenen = new JaarVergelijken(gegevens);
  }
  return berekenen;
}

function stapBerekening(v: number) {
  return Math.max(1, Math.max(0.1, Math.pow(10, Math.floor(Math.log10(v) - 1))));
}

function berekenGrafiekData(gegevens: InvoerGegevensType) {
  let berekenen = berekenenMethode(gegevens);
  let vis = gegevens.visualisatie;
  let series = [] as SerieType[];
  // grafiek stappen: 1, 10, 100, 1000, ....
  const verschil = vis.van_tot[1] - vis.van_tot[0];
  const delen = vis.periode == PeriodeType.MAAND ? 100 : 10;
  const stap = stapBerekening(verschil / delen) / functies.factorBerekening(vis);
  const begin = stap * Math.floor(vis.van_tot[0] / stap);

  for (let i = begin; i <= vis.van_tot[1]; i += stap) {
    berekenen.verzamelGrafiekSeries(series, i, vis.type === VisualisatieTypeType.G);
  }
  return { berekenen: berekenen, series: series };
}

function berekenTabelData(gegevens: InvoerGegevensType): BerekenResultaatType[] {
  let berekenen = berekenenMethode(gegevens);
  let vis = gegevens.visualisatie;
  let series = [];

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += vis.stap) {
    let idx = Math.round((i - vis.van_tot[0]) / vis.stap);

    series[idx] = berekenen.bereken(Math.round(i), true);
  }
  return series;
}

export default {
  berekenGrafiekData,
  berekenTabelData,
};
