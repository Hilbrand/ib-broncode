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
    this.algemeneData = this.berekenAlgemeneGegevens(personen, wonen);
    this.factor = functies.factorBerekening(vis.periode);
  }

  getYMax() {
    return this.vis.van_tot[1];
  }

  getAlgemeneData() {
    return this.algemeneData;
  }

  getFactor() {
    return this.factor;
  }

  berekenAlgemeneGegevens(personen, wonen) {
    let toeslagenpartner = functies.toeslagenPartner(personen);
    let huren = wonen.woning_type == "huur";

    return {
      toeslagenpartner: toeslagenpartner,
      iacbInkomen: iack.bepaalLaagsteArbeidsInkomenAnderen(personen),
      kinderbijslag: kbs.kinderbijslag(personen),
      maxKindgebondenBudget: kgb.maxKindgebondenBudget(
        personen,
        toeslagenpartner
      ),
      nk: inkomen.nettoKortingenInkomens(personen),
      huren: huren,
      hypotheekRenteAftrek: huren
        ? 0
        : hra.hypotheekRenteAftrek(wonen.rente, wonen.woz),
    };
  }

  bereken(arbeidsInkomen) {}
}
