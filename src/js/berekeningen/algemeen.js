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

const stap = 100;
/*
function addGrafiekGegevens2(
  alles,
  berekening,
  arbeidsinkomen_grafiek,
  algemeneGegevens,
  factor
) {
  alles.push({
    id: arbeidsinkomen_grafiek,
    type: "belasting percentage",
    getal:
      1000 *
      ((arbeidsinkomen_grafiek - berekening.beschikbaarInkomen) /
        arbeidsinkomen_grafiek) *
      100,
    //      getal: afronden((berekening.beschikbaarInkomen / arbeidsinkomen_grafiek) * 100, factor),
  });
}
*/

function log(berekening, berekening2) {
  console.log("".padEnd(30, "."));
  console.log("berekening2.budget:" + berekening2.budget);
  console.log("berekening1.budget :" + berekening.budget);
  console.log("berekening2.arbeidsinkomen:" + berekening2.arbeidsinkomen);
  console.log("berekening1.arbeidsinkomen :" + berekening.arbeidsinkomen);
  console.log("berekening2:" + JSON.stringify(berekening2));
  console.log("berekening1:" + JSON.stringify(berekening));
}

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
