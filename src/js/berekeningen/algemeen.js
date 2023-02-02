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

const stap = 100;

function afronden(getal, factor) {
  return (getal * factor).toFixed("2") * 1;
}

function budgetData(
  alles,
  berekening,
  arbeidsinkomen_grafiek,
  algemeneData,
  factor
) {
  if (berekening.netto !== undefined) {
    alles.push({
      id: arbeidsinkomen_grafiek,
      type: "netto",
      getal: afronden(berekening.netto, factor),
    });
  }
  if (berekening.nettoInkomensBelasting !== undefined) {
    alles.push({
      id: arbeidsinkomen_grafiek,
      type: "netto belasting",
      getal: afronden(berekening.nettoInkomensBelasting, factor),
    });
  }
  alles.push(
    {
      id: arbeidsinkomen_grafiek,
      type: "algemeneHeffingsKorting",
      getal: afronden(berekening.algemeneHeffingsKorting, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: "arbeidskorting",
      getal: afronden(berekening.arbeidskorting, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: algemeneData.huren ? "huurtoeslag" : "hypotheekrenteaftrek",
      getal: afronden(berekening.wonen, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: "zorgtoeslag",
      getal: afronden(berekening.zorgtoeslag, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: "kinderbijslag",
      getal: afronden(berekening.kinderbijslag, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: "kindgebonden budget",
      getal: afronden(berekening.kindgebondenBudget, factor),
    },
    {
      id: arbeidsinkomen_grafiek,
      type: "inkomenafh. combi krt",
      getal: afronden(berekening.inkomensafhankelijkeCombinatiekorting, factor),
    }
  );
}

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
  const bereken =
    "bi" == type
      ? new BeschikbaarInkomen(vis, personen, wonen)
      : new MarginaleDruk(vis, personen, wonen);
  const factor = functies.factorBerekening(vis.periode);
  let alles = [];

  for (let i = vis.van_tot[0]; i <= vis.van_tot[1]; i += stap) {
    let arbeidsinkomen_grafiek = Math.round(i * factor);

    budgetData(
      alles,
      bereken.bereken(i),
      arbeidsinkomen_grafiek,
      bereken.getAlgemeneData(),
      bereken.getFactor()
    );
  }
  return { bereken: bereken, series: alles };
}

export default {
  berekenGrafiekData,
};
