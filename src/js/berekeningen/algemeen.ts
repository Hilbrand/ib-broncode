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

import { Berekenen } from "./Berekenen";
import { BeschikbaarInkomen } from "./BeschikbaarInkomen";
import { MarginaleDruk } from "./MarginaleDruk";
import { Belastingdruk } from "./Belastingdruk";
import { InvoerGegevensType, TabType, VisualisatieTypeType } from "../../ts/types";

function berekenenMethode(gegevens: InvoerGegevensType): Berekenen {
  let berekenen: Berekenen = null;
  let bi = new BeschikbaarInkomen(gegevens);

  switch (gegevens.tab) {
    case TabType.BI:
      berekenen = bi;
      break;
    case TabType.MD:
      berekenen = new MarginaleDruk(gegevens, bi);
      break;
    case TabType.BD:
      berekenen = new Belastingdruk(gegevens, bi);
      break;
  }
  return berekenen;
}

function berekenGrafiekData(gegevens: InvoerGegevensType) {
  let berekenen = berekenenMethode(gegevens);
  let vis = gegevens.visualisatie;
  let series = [];
  // grafiek stappen: range: < 2000 = 1, < 20.000 = 10, < 200.000 = 100 per stap
  let stap = Math.max(
    10,
    Math.pow(10, Math.ceil(Math.abs(Math.log10(Math.max(1, vis.van_tot[1] - vis.van_tot[0]) / 20) - 2)))
  );

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += stap) {
    let id = Math.round(i * berekenen.factor);

    berekenen.verzamelGrafiekSeries(series, berekenen.bereken(i, VisualisatieTypeType.G), id, true);
  }
  return { berekenen: berekenen, series: series };
}

function berekenTabelData(gegevens: InvoerGegevensType) {
  let berekenen = berekenenMethode(gegevens);
  let vis = gegevens.visualisatie;
  let series = [];

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += vis.stap) {
    let id = Math.round(i * berekenen.factor);
    let idx = (i - vis.van_tot[0]) / vis.stap;

    series[idx] = berekenen.bereken(i, VisualisatieTypeType.T);
  }
  return { berekenen: berekenen, series: series };
}

export default {
  berekenGrafiekData,
  berekenTabelData,
};
