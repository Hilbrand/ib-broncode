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

import ht from "@/js/belasting//huurtoeslag";
import inkomen from "@/bluemink/inkomen";
import { BeschikbaarInkomen } from "@/js/berekeningen/BeschikbaarInkomen";

export class BlueminkBeschikbaarInkomen extends BeschikbaarInkomen {
  constructor(vis, personen, wonen) {
    super(vis, personen, wonen);
  }

  berekenBeschikbaarInkomen(arbeidsinkomen) {
    let toetsingsInkomenBelasting = inkomen.inkomstenBelasting(arbeidsinkomen);
    let nettoArbeidsinkomen = arbeidsinkomen - toetsingsInkomenBelasting;
    let toeslagenToetsInkomen = inkomen.toeslagenToetsInkomen(
      arbeidsinkomen,
      this.personen
    );

    let beschikbaarInkomen = {
      arbeidsinkomen: arbeidsinkomen,
      brutoInkomstenBelasting: toetsingsInkomenBelasting,
      netto: nettoArbeidsinkomen,
      algemeneHeffingsKorting: inkomen.algemeneHeffingsKorting(arbeidsinkomen),
      arbeidskorting: inkomen.arbeidskorting(arbeidsinkomen),
      zorgtoeslag: 0,
      wonen: this.algemeneGegevens.huren
        ? ht.huurtoeslag(
            toeslagenToetsInkomen,
            this.wonen.huur,
            this.personen.length,
            this.algemeneGegevens.aow
          )
        : 0,
      kinderbijslag: this.algemeneGegevens.kinderbijslag,
      kindgebondenBudget: 0,
      inkomensafhankelijkeCombinatiekorting: 0,
    };

    beschikbaarInkomen.beschikbaarInkomen =
      beschikbaarInkomen.netto +
      beschikbaarInkomen.algemeneHeffingsKorting +
      beschikbaarInkomen.arbeidskorting +
      beschikbaarInkomen.zorgtoeslag +
      beschikbaarInkomen.wonen +
      beschikbaarInkomen.kinderbijslag +
      beschikbaarInkomen.kindgebondenBudget +
      beschikbaarInkomen.inkomensafhankelijkeCombinatiekorting;
    return beschikbaarInkomen;
  }
}
