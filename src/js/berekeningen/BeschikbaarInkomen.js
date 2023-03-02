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
import { BeschikbaarInkomenLegenda } from "@/js/grafieken/BeschikbaarInkomenLegenda";

export class BeschikbaarInkomen extends Berekenen {
  constructor(vis, personen, wonen) {
    super(vis, personen, wonen);
  }

  createLegenda() {
    return new BeschikbaarInkomenLegenda(this);
  }

  getYDomain() {
    let yDomain = super.getYDomain();

    return yDomain[(0, Math.round(yDomain[1] / 1000))];
  }

  bereken(arbeidsInkomen) {
    return this.berekenBeschikbaarInkomen(arbeidsInkomen);
  }

  berekenBeschikbaarInkomen(arbeidsinkomen) {
    let aow = this.personen[0].leeftijd == "AOW";
    let toetsingsInkomen = inkomen.toetsingsinkomen(
      arbeidsinkomen,
      this.algemeneGegevens.hypotheekRenteAftrek
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
      this.personen
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
      this.algemeneGegevens.maxKindgebondenBudget,
      this.algemeneGegevens.toeslagenpartner
    );

    let beschikbaarInkomen = {
      arbeidsinkomen: arbeidsinkomen,
      brutoInkomstenBelasting: toetsingsInkomenBelasting,
      netto:
        nettoArbeidsinkomen -
        functies.negatiefIsNul(-effectieveHypotheekRenteAftrek),
      algemeneHeffingsKorting: algemeneHeffingsKorting,
      arbeidskorting: arbeidskorting,
      zorgtoeslag: zt.zorgtoeslag(
        toeslagenToetsInkomen,
        this.algemeneGegevens.toeslagenpartner
      ),
      wonen: this.algemeneGegevens.huren
        ? ht.huurtoeslag(
            toeslagenToetsInkomen,
            this.wonen.huur,
            this.personen.length,
            this.algemeneGegevens.aow
          )
        : effectieveHypotheekRenteAftrek,
      kinderbijslag: this.algemeneGegevens.kinderbijslag,
      kindgebondenBudget: kindgebondenBudget,
      inkomensafhankelijkeCombinatiekorting:
        this.algemeneGegevens.kinderbijslag > 0
          ? iack.inkomensafhankelijkeCombinatiekorting(
              arbeidsinkomen,
              this.algemeneGegevens.iacbInkomen,
              this.algemeneGegevens.aow
            )
          : 0,
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

  verzamelGrafiekSeries(alles, beschikbaarInkomen, id) {
    let factor = this.getFactor();
    if (beschikbaarInkomen.netto !== undefined) {
      alles.push({
        id: id,
        type: "netto",
        getal: this.afronden(beschikbaarInkomen.netto, factor),
      });
    }
    alles.push(
      {
        id: id,
        type: "algemeneHeffingsKorting",
        getal: this.afronden(
          beschikbaarInkomen.algemeneHeffingsKorting,
          factor
        ),
      },
      {
        id: id,
        type: "arbeidskorting",
        getal: this.afronden(beschikbaarInkomen.arbeidskorting, factor),
      },
      {
        id: id,
        type: this.algemeneGegevens.huren
          ? "huurtoeslag"
          : "hypotheekrenteaftrek",
        getal: this.afronden(beschikbaarInkomen.wonen, factor),
      },
      {
        id: id,
        type: "zorgtoeslag",
        getal: this.afronden(beschikbaarInkomen.zorgtoeslag, factor),
      },
      {
        id: id,
        type: "kinderbijslag",
        getal: this.afronden(beschikbaarInkomen.kinderbijslag, factor),
      },
      {
        id: id,
        type: "kindgebonden budget",
        getal: this.afronden(beschikbaarInkomen.kindgebondenBudget, factor),
      },
      {
        id: id,
        type: "inkomenafh. combi krt",
        getal: this.afronden(
          beschikbaarInkomen.inkomensafhankelijkeCombinatiekorting,
          factor
        ),
      }
    );
  }
}
