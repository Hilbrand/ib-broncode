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

import functies from "@/js/functies";
import { BeschikbaarInkomen } from "@/js/berekeningen/BeschikbaarInkomen";
import { MarginaleDruk } from "@/js/berekeningen/MarginaleDruk";
import { EffectieveBelasting } from "@/js/berekeningen/EffectieveBelasting";

const stap = 100;

function berekenGrafiekData(type, vis, personen, wonen) {
  let berekenen = null;

  switch (type) {
    case "bi":
      berekenen = new BeschikbaarInkomen(vis, personen, wonen);
      break;
    case "md":
      berekenen = new MarginaleDruk(vis, personen, wonen);
      break;
    case "eb":
      berekenen = new EffectieveBelasting(vis, personen, wonen);
      break;
  }
  berekenen.factor = functies.factorBerekening(vis.periode);
  let series = [];

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += stap) {
    let id = Math.round(i * berekenen.factor);

    berekenen.verzamelGrafiekSeries(series, berekenen.bereken(i), id);
  }
  return { berekenen: berekenen, series: series };
}

export default {
  berekenGrafiekData,
};
