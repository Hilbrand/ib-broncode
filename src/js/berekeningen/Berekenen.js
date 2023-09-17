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
import hra from "@/js/belasting/hypotheekrente_aftrek";
import iack from "@/js/belasting/inkomensafhankelijke_combinatiekorting";
import inkomen from "@/js/belasting/inkomen";
import kbs from "@/js/belasting/kinderbijslag";
import kgb from "@/js/belasting/kindgebonden_budget";

export class Berekenen {
  constructor(vis, personen, wonen) {
    this.vis = vis;
    this.personen = personen;
    this.wonen = wonen;
    this.algemeneGegevens = this.berekenAlgemeneGegevens(vis.jaar, personen, wonen);
    this.factor = functies.factorBerekening(vis.periode);
  }

  getLegenda() {
    if (this.legenda === undefined) {
      this.legenda = this.createLegenda();
    }
    return this.legenda;
  }

  createLegenda() {}

  getYDomain() {
    return [0, this.vis.van_tot[1]];
  }

  getAlgemeneGegevens() {
    return this.algemeneGegevens;
  }

  getFactor() {
    return this.factor;
  }

  berekenAlgemeneGegevens(jaar, personen, wonen) {
    let toeslagenpartner = functies.toeslagenPartner(personen);
    let aow = functies.aow(personen);
    let huren = functies.isHuur(wonen);

    return {
      toeslagenpartner: toeslagenpartner,
      aow: aow,
      iacbInkomen: iack.bepaalLaagsteArbeidsInkomenAnderen(personen),
      kinderbijslag: kbs.kinderbijslag(jaar, personen),
      maxKindgebondenBudget: kgb.maxKindgebondenBudget(
        jaar,
        personen,
        toeslagenpartner
      ),
      nk: inkomen.nettoKortingenInkomens(personen),
      huren: huren,
      hypotheekRenteAftrek: huren
        ? 0
        : hra.hypotheekRenteAftrek(jaar, wonen.rente, wonen.woz),
    };
  }

  /**
   *
   * @param arbeidsInkomen jaar arbeidsinkomen
   */
  bereken(arbeidsInkomen) {}

  afronden(getal, factor) {
    return (getal * factor).toFixed("2") * 1;
  }

  verzamelGrafiekSeries(alles, gegevens, id) {}
}
