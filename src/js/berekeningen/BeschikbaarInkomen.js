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
import inkomen from "@/js/belasting/inkomen";
import ht from "@/js/belasting//huurtoeslag";
import iack from "@/js/belasting/inkomensafhankelijke_combinatiekorting";
import kgb from "@/js/belasting/kindgebonden_budget";
import zt from "@/js/belasting/zorgtoeslag";
import { Berekenen } from "@/js/berekeningen/Berekenen";

export class BeschikbaarInkomen extends Berekenen {
  constructor(vis, personen, wonen) {
    super(vis, personen, wonen);
  }

  getYMax() {
    return Math.round(super.getYMax() / 1000);
  }

  bereken(arbeidsInkomen) {
    return this.berekenBeschikbaarInkomen(
      arbeidsInkomen,
      this.personen,
      this.wonen,
      this.algemeneGegevens
    );
  }

  berekenBeschikbaarInkomen(arbeidsinkomen, personen, wonen, algemeneGegevens) {
    let aow = personen[0].leeftijd == "AOW";
    let toetsingsInkomen = inkomen.toetsingsinkomen(
      arbeidsinkomen,
      algemeneGegevens.hypotheekRenteAftrek
    );
    let toetsingsInkomenBelasting = inkomen.inkomstenBelasting(
      toetsingsInkomen,
      aow
    );
    let arbeidsinkomenBelasting = inkomen.inkomstenBelasting(
      arbeidsinkomen,
      aow
    );
    let toeslagenToetsInkomen = inkomen.toeslagenToetsInkomen(
      arbeidsinkomen,
      personen
    );
    let nettoArbeidsinkomen = arbeidsinkomen - toetsingsInkomenBelasting;
    let algemeneHeffingsKorting = inkomen.algemeneHeffingsKorting(
      toetsingsInkomen,
      toetsingsInkomenBelasting,
      aow
    );
    let maxBelastingTeruggave = functies.negatiefIsNul(
      toetsingsInkomenBelasting - algemeneHeffingsKorting
    );
    let arbeidskorting = inkomen.arbeidskorting(
      arbeidsinkomen,
      maxBelastingTeruggave,
      aow
    );
    let effectieveRenteVerschil = functies.negatiefIsNul(
      arbeidsinkomenBelasting - toetsingsInkomenBelasting
    );

    let effectieveHypotheekRenteAftrek = Math.min(
      effectieveRenteVerschil == 0 ? 0 : effectieveRenteVerschil,
      toetsingsInkomenBelasting
    );
    let kindgebondenBudget = kgb.kindgebondenBudget(
      toeslagenToetsInkomen,
      algemeneGegevens.maxKindgebondenBudget,
      algemeneGegevens.toeslagenpartner
    );

    let gegevens = {
      arbeidsinkomen: arbeidsinkomen,
      brutoInkomstenBelasting: toetsingsInkomenBelasting,
      netto:
        nettoArbeidsinkomen -
        functies.negatiefIsNul(-effectieveHypotheekRenteAftrek),
      algemeneHeffingsKorting: algemeneHeffingsKorting,
      arbeidskorting: arbeidskorting,
      zorgtoeslag: zt.zorgtoeslag(
        toeslagenToetsInkomen,
        algemeneGegevens.toeslagenpartner
      ),
      wonen: algemeneGegevens.huren
        ? ht.huurtoeslag(
            toeslagenToetsInkomen,
            wonen.huur,
            personen.length,
            algemeneGegevens.aow
          )
        : effectieveHypotheekRenteAftrek,
      kinderbijslag: algemeneGegevens.kinderbijslag,
      kindgebondenBudget: kindgebondenBudget,
      inkomensafhankelijkeCombinatiekorting:
        algemeneGegevens.kinderbijslag > 0
          ? iack.inkomensafhankelijkeCombinatiekorting(
              arbeidsinkomen,
              algemeneGegevens.iacbInkomen,
              algemeneGegevens.aow
            )
          : 0,
    };

    gegevens.beschikbaarInkomen =
      gegevens.netto +
      gegevens.algemeneHeffingsKorting +
      gegevens.arbeidskorting +
      gegevens.zorgtoeslag +
      gegevens.wonen +
      gegevens.kinderbijslag +
      gegevens.kindgebondenBudget +
      gegevens.inkomensafhankelijkeCombinatiekorting;
    return gegevens;
  }
}
