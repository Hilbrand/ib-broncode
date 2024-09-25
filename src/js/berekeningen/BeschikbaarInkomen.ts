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

import functies from "../../ts/functies";
import inkomen from "../belasting/inkomen";
import ht from "../belasting//huurtoeslag";
import iack from "../belasting/inkomensafhankelijkecombinatiekorting";
import kgb from "../belasting/kindgebonden_budget";
import zt from "../belasting/zorgtoeslag";
import { Berekenen } from "../berekeningen/Berekenen";
import { BeschikbaarInkomenLegenda } from "../grafieken/BeschikbaarInkomenLegenda";
import {
  BeschikbaarInkomenResultaatType,
  InvoerGegevensType,
  LeeftijdType,
  VisualisatieTypeType,
} from "../../ts/types";
import { Legenda } from "../grafieken/Legenda";
import zorgtoeslag from "../belasting/zorgtoeslag";

export class BeschikbaarInkomen extends Berekenen {
  beschikbaarInkomen: number;

  constructor(gegevens: InvoerGegevensType) {
    super(gegevens);
  }

  createLegenda(): Legenda {
    return new BeschikbaarInkomenLegenda(this);
  }

  getYDomain(): number[] {
    let yDomain: number[] = super.getYDomain();

    return [0, Math.round(yDomain[1] / (1000 / this.factor))];
  }

  bereken(arbeidsInkomen: number, visualisatie: VisualisatieTypeType): BeschikbaarInkomenResultaatType {
    return this.berekenBeschikbaarInkomen(arbeidsInkomen, visualisatie);
  }

  berekenBeschikbaarInkomen(arbeidsinkomen, visualisatie: VisualisatieTypeType): BeschikbaarInkomenResultaatType {
    const aow = this.personen[0].leeftijd == LeeftijdType.AOW;
    // Hypotheek rente wordt afgetrokken van arbeidsinkomen: toestingsinkomen zal dus lager worden dan arbeidsinkomen.
    const toetsingsInkomen = inkomen.toetsingsinkomen(arbeidsinkomen, this.algemeneGegevens.hypotheekRenteAftrek);
    // Berekende belasting als hypotheek rente van inkomen is afgetrokken.
    const ibBox1 = inkomen.inkomstenBelasting(this.vis.jaar, toetsingsInkomen, aow);
    // Belasting die betaald zou zijn alleen over arbeid
    const ibBox1Arbeid = inkomen.inkomstenBelasting(this.vis.jaar, arbeidsinkomen, aow);
    // Maximaal (of eigenlijk minimaal te betalen belasting)
    const ibBox1Max = Math.min(ibBox1, ibBox1Arbeid);

    // Potentieel aftrekbare hypotheekrente is verschil tussen arbeidsinkomen belasting
    // en belasting van inkomen met hypotheekrente verrekend in het inkomen.
    const hraMax = functies.negatiefIsNul(ibBox1Arbeid - ibBox1);

    // Arbeidskorting gaat over alleen arbeidsinkomen
    // Maar kan niet hoger zijn dan maximum te betalen belasting.
    let arbeidskortingMax = inkomen.arbeidskorting(this.vis.jaar, arbeidsinkomen, aow);
    let arbeidskorting = Math.min(ibBox1Max, arbeidskortingMax);
    let maxBelastingNaAK = functies.negatiefIsNul(ibBox1Max - arbeidskorting);

    // Inkomensafhankelijke combinatie korting
    let inACKMax =
      this.algemeneGegevens.kinderbijslag > 0
        ? iack.inkomensafhankelijkeCombinatiekorting(
            this.vis.jaar,
            arbeidsinkomen,
            this.algemeneGegevens.iacbInkomen,
            this.algemeneGegevens.aow
          )
        : 0;
    let inACK = Math.min(maxBelastingNaAK, inACKMax);
    let maxBelastingNaIACK = functies.negatiefIsNul(maxBelastingNaAK - inACK);

    // Algemene heffingskorting gaat over arbeidsinkomen + woning inkomen.
    // Maar kan niet hoger zijn dan maximum te betalen belasting.
    let algemeneHeffingsKortingMax = inkomen.algemeneHeffingsKorting(this.vis.jaar, toetsingsInkomen, aow);
    let algemeneHeffingsKorting = Math.min(maxBelastingNaIACK, algemeneHeffingsKortingMax);

    // Maximum te betalen belasting is arbeidsinkomen belasting minus AHK en AK.
    let maxBelasting = functies.negatiefIsNul(maxBelastingNaIACK - algemeneHeffingsKorting);
    // NVZK: niet-verzilverde heffingskortingen
    let nvzk =
      arbeidskortingMax - arbeidskorting + (algemeneHeffingsKortingMax - algemeneHeffingsKorting) + (inACKMax - inACK);

    // Inkomen berekening inclusief fiscale partners.
    let toeslagenToetsInkomen = inkomen.toeslagenToetsInkomen(arbeidsinkomen, this.personen);
    let kindgebondenBudget = kgb.kindgebondenBudget(
      this.vis.jaar,
      toeslagenToetsInkomen,
      this.algemeneGegevens.maxKindgebondenBudget,
      this.algemeneGegevens.toeslagenpartner
    );
    let zorgtoeslag = zt.zorgtoeslag(this.vis.jaar, toeslagenToetsInkomen, this.algemeneGegevens.toeslagenpartner);
    let wonen = this.algemeneGegevens.huren
      ? ht.huurtoeslag(
          this.vis.jaar,
          toeslagenToetsInkomen,
          this.wonen.huur,
          this.personen.length,
          this.algemeneGegevens.aow
        )
      : hraMax;

    // Arbeidsloon - ibBox1 + kortingen + hypotheekrenteaftrek
    let nettoLoon = arbeidsinkomen - maxBelasting;

    // Netto arbeidsinkomen is loon na belasting aftrek, zonder kortingen
    let nettoArbeidsinkomen =
      arbeidsinkomen - (arbeidskorting + algemeneHeffingsKorting + inACK + hraMax + maxBelasting);

    // Netto inkomen is arbeidsinkomen minus arbeidsinkomen belasting.
    let nettoInkomen =
      nettoLoon +
      // In de tabel wordt kinderbijslag niet getoond en dus niet meegenomen in nettoInkomen berekening
      (visualisatie == VisualisatieTypeType.T ? 0 : this.algemeneGegevens.kinderbijslag) +
      kindgebondenBudget +
      zorgtoeslag +
      wonen;

    let beschikbaarInkomen: BeschikbaarInkomenResultaatType = {
      arbeidsinkomen: arbeidsinkomen,
      nettoLoonBelasting: maxBelasting,
      nettoArbeidsinkomen: nettoArbeidsinkomen,
      nettoInkomen: nettoInkomen,
      nettoLoon: nettoLoon,
      ibBox1: ibBox1Arbeid,
      ak: arbeidskorting,
      akMax: arbeidskortingMax,
      iack: inACK,
      iackMax: inACKMax,
      ahk: algemeneHeffingsKorting,
      ahkMax: algemeneHeffingsKortingMax,
      nvzk: nvzk,
      zt: zorgtoeslag,
      wonen: wonen,
      hraMax: hraMax,
      kb: this.algemeneGegevens.kinderbijslag,
      kgb: kindgebondenBudget,
    };

    return beschikbaarInkomen;
  }

  verzamelGrafiekSeries(alles, beschikbaarInkomen, id: number, negIsNull: boolean) {
    let factor = this.getFactor();
    if (beschikbaarInkomen.marginaleDruk === undefined) {
      alles.push({
        id: id,
        type: "netto",
        getal: this.afronden(beschikbaarInkomen.nettoArbeidsinkomen, factor),
      });
    }
    alles.push(
      {
        id: id,
        type: "alg. heffingskorting",
        getal: this.afronden(beschikbaarInkomen.ahk, factor),
      },
      {
        id: id,
        type: "arbeidskorting",
        getal: this.afronden(beschikbaarInkomen.ak, factor),
      },
      {
        id: id,
        type: "inkomenafh. combi krt",
        getal: this.afronden(beschikbaarInkomen.iack, factor),
      },
      {
        id: id,
        type: this.algemeneGegevens.huren ? "huurtoeslag" : "hypotheekrenteaftrek",
        getal: this.afrondenNegIsNul(beschikbaarInkomen.wonen, factor, !this.algemeneGegevens.huren && negIsNull),
      },
      {
        id: id,
        type: "zorgtoeslag",
        getal: this.afronden(beschikbaarInkomen.zt, factor),
      },
      {
        id: id,
        type: "kinderbijslag",
        getal: this.afronden(beschikbaarInkomen.kb, factor),
      },
      {
        id: id,
        type: "kindgebonden budget",
        getal: this.afronden(beschikbaarInkomen.kgb, factor),
      }
    );
  }
}
