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
import { BeschikbaarInkomenLegenda } from "@/js/grafieken/BeschikbaarInkomenLegenda";
import { MarginaleDruk } from "@/js/berekeningen/MarginaleDruk";
import { MarginaleDrukLegenda } from "@/js/grafieken/MarginaleDrukLegenda";
import { EffectieveBelasting } from "@/js/berekeningen/EffectieveBelasting";
import { EffectieveBelastingLegenda } from "@/js/grafieken/EffectieveBelastingLegenda";

const stap = 100;

function berekenGrafiekData(type, vis, personen, wonen) {
  let bereken = null;
  let legenda = null;

  switch (type) {
    case "bi":
      bereken = new BeschikbaarInkomen(vis, personen, wonen);
      legenda = new BeschikbaarInkomenLegenda();
      break;
    case "md":
      bereken = new MarginaleDruk(vis, personen, wonen);
      legenda = new MarginaleDrukLegenda();
      break;
    case "eb":
      bereken = new EffectieveBelasting(vis, personen, wonen);
      legenda = new EffectieveBelastingLegenda();
      break;
  }
  const factor = functies.factorBerekening(vis.periode);
  let alles = [];

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += stap) {
    let arbeidsinkomen_grafiek = Math.round(i * factor);

    bereken.verzamelGrafiekSeries(
      alles,
      bereken.bereken(i),
      arbeidsinkomen_grafiek,
      bereken.getFactor()
    );
  }
  return { bereken: bereken, legenda: legenda, series: alles };
}

export default {
  berekenGrafiekData,
};
