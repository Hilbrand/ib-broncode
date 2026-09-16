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

import functies from "../functies";
import inkomen from "../belasting/inkomen";
import ht from "../belasting/huurtoeslag";
import iack from "../belasting/inkomensafhankelijkecombinatiekorting";
import kbs from "../belasting/kinderbijslag";
import kgb from "../belasting/kindgebonden_budget";
import hra from "../belasting/hypotheekrente_aftrek.js";
import zt from "../belasting/zorgtoeslag";

import {
  BerekenInvoerType,
  BerekenResultaatType,
  BeschikbaarInkomenResultaatType,
  InvoerGegevensType,
  LeeftijdType,
  PersoonType,
  VisualisatieType,
  WonenType,
  WoningType,
} from "../types";

export class Berekenen {
  tab: string;
  vis: VisualisatieType;
  personen: PersoonType[];
  wonen: WonenType;
  algemeneGegevens: BerekenInvoerType;
  jaar: string;

  constructor(gegevens: InvoerGegevensType, jaar: string) {
    this.tab = gegevens.tab;
    this.vis = gegevens.visualisatie;
    this.personen = gegevens.personen;
    this.wonen = gegevens.wonen;
    this.jaar = jaar;
    this.algemeneGegevens = this.berekenAlgemeneGegevens(gegevens);
  }

  berekenAlgemeneGegevens(gegevens: InvoerGegevensType): BerekenInvoerType {
    let personen = gegevens.personen;
    let wonen = gegevens.wonen;
    let toeslagenpartner = functies.toeslagenPartner(personen);
    let aow = functies.aow(personen);
    let huren = functies.isHuur(wonen);

    return {
      toeslagenpartner: toeslagenpartner,
      aow: aow,
      kinderbijslag: kbs.kinderbijslag(this.jaar, personen),
      maxKindgebondenBudget: kgb.maxKindgebondenBudget(this.jaar, personen, toeslagenpartner),
      huren: huren,
      eigenwoningforfait: huren ? 0 : hra.eigenwoningforfait(this.jaar, wonen.woz),
      hypotheekRenteAftrek: huren ? 0 : hra.hypotheekRenteAftrek(this.jaar, wonen.rente, wonen.woz),
    };
  }

  bereken(_arbeidsinkomen: number, nettoZonderKinderbijslag: boolean): BeschikbaarInkomenResultaatType {
    const arbeidsinkomen = Math.round(_arbeidsinkomen);
    const anderenArbeidsinkomen = inkomen.anderePersonenToetsInkomen(arbeidsinkomen, this.personen);

    return this.berekenBeschikbaarInkomen(arbeidsinkomen, anderenArbeidsinkomen, nettoZonderKinderbijslag);
  }

  berekenBeschikbaarInkomen(
    brutoloon: number,
    anderenArbeidsinkomen: number[],
    nettoZonderKinderbijslag: boolean
  ): BeschikbaarInkomenResultaatType {
    const hoofdpersoon = this.personen[0];
    const aow = hoofdpersoon.leeftijd == LeeftijdType.AOW;
    // Pensioen Premie
    const pensioenPremie =
      hoofdpersoon.pensioenFranchise > 0
        ? inkomen.pensioenPremie(
            this.jaar,
            brutoloon,
            hoofdpersoon.pensioenFranchise,
            hoofdpersoon.pensioenPremiePercentage
          )
        : 0;
    const arbeidsinkomen = brutoloon - pensioenPremie;

    // Hypotheek rente wordt afgetrokken van arbeidsinkomen: toetsingsinkomen zal dus lager worden dan arbeidsinkomen.
    const oudeHypotheekaftrekRegels = "2023" == this.jaar || "2024" == this.jaar;
    const hypotheekaftrekVanaf2025 = inkomen.hypotheekrenteaftrekVanaf2025(
      this.jaar,
      brutoloon,
      this.algemeneGegevens.hypotheekRenteAftrek,
      aow
    );
    const toetsingsInkomen = inkomen.toetsingsinkomen(arbeidsinkomen, this.algemeneGegevens.hypotheekRenteAftrek);
    // Belasting die betaald zou zijn alleen over arbeid
    const ibBox1Arbeid = inkomen.inkomstenBelasting(this.jaar, arbeidsinkomen, aow);
    // Berekende belasting als hypotheek rente van inkomen is afgetrokken.
    const ibBox1 = functies.negatiefIsNul(
      oudeHypotheekaftrekRegels
        ? inkomen.inkomstenBelasting(this.jaar, toetsingsInkomen, aow)
        : ibBox1Arbeid - hypotheekaftrekVanaf2025
    );
    // Belasting die betaald moet worden over arbeid of met eventuele hypotheek verrekening.
    const ibBox1Effectief = Math.min(ibBox1, ibBox1Arbeid);

    // Potentieel aftrekbare hypotheekrente is verschil tussen arbeidsinkomen belasting
    // en belasting van inkomen met hypotheekrente verrekend in het inkomen.
    const hraMax = functies.negatiefIsNul(ibBox1Arbeid - ibBox1);

    // Arbeidskorting gaat over alleen arbeidsinkomen
    // Maar kan niet hoger zijn dan maximum te betalen belasting.
    let arbeidskortingMax = inkomen.arbeidskorting(this.jaar, arbeidsinkomen, aow);
    let arbeidskorting = functies.negatiefIsNul(Math.min(ibBox1Effectief, arbeidskortingMax));
    let maxBelastingNaAK = functies.negatiefIsNul(ibBox1Effectief - arbeidskorting);

    // Inkomensafhankelijke combinatie korting
    let inACKMax =
      this.algemeneGegevens.kinderbijslag > 0
        ? iack.inkomensafhankelijkeCombinatiekorting(
            this.jaar,
            arbeidsinkomen,
            anderenArbeidsinkomen,
            this.algemeneGegevens.aow
          )
        : 0;
    let inACK = Math.min(maxBelastingNaAK, inACKMax);
    let maxBelastingNaIACK = functies.negatiefIsNul(maxBelastingNaAK - inACK);

    // Algemene heffingskorting gaat over arbeidsinkomen + woning inkomen.
    // Maar kan niet hoger zijn dan maximum te betalen belasting.
    let algemeneHeffingsKortingMax = inkomen.algemeneHeffingsKorting(this.jaar, toetsingsInkomen, aow);
    let algemeneHeffingsKorting = Math.min(maxBelastingNaIACK, algemeneHeffingsKortingMax);

    // Maximum te betalen belasting is arbeidsinkomen belasting minus AHK en AK.
    let nettoBelasting = functies.negatiefIsNul(maxBelastingNaIACK - algemeneHeffingsKorting);

    // NVZK: niet-verzilverde kortingen
    let nvzk =
      arbeidskortingMax - arbeidskorting + (algemeneHeffingsKortingMax - algemeneHeffingsKorting) + (inACKMax - inACK);

    // Inkomen berekening inclusief fiscale partners.
    let toeslagenToetsInkomen = inkomen.toeslagenToetsInkomen(toetsingsInkomen, anderenArbeidsinkomen);
    let kindgebondenBudget = kgb.kindgebondenBudget(
      this.jaar,
      toeslagenToetsInkomen,
      this.algemeneGegevens.maxKindgebondenBudget,
      this.algemeneGegevens.toeslagenpartner
    );
    let zorgtoeslag = zt.zorgtoeslag(this.jaar, toeslagenToetsInkomen, this.algemeneGegevens.toeslagenpartner);
    let wonen = this.algemeneGegevens.huren
      ? ht.huurtoeslag(
          this.jaar,
          toeslagenToetsInkomen,
          this.wonen.huur,
          this.personen.length,
          this.algemeneGegevens.aow
        )
      : hraMax;

    // Arbeidsloon - ibBox1 + kortingen + hypotheekrenteaftrek
    let nettoloon = arbeidsinkomen - nettoBelasting;

    // Netto arbeidsinkomen is loon na belasting aftrek, zonder kortingen
    let nettoArbeidsinkomen =
      arbeidsinkomen - (arbeidskorting + algemeneHeffingsKorting + inACK + hraMax + nettoBelasting);

    // Netto inkomen is arbeidsinkomen minus arbeidsinkomen belasting.
    const huurtoeslag = this.wonen.woning_type === WoningType.HUUR ? wonen : 0;
    let nettoInkomen =
      nettoloon +
      // In de tabel wordt kinderbijslag niet getoond en dus niet meegenomen in nettoInkomen berekening
      (nettoZonderKinderbijslag ? 0 : this.algemeneGegevens.kinderbijslag) +
      kindgebondenBudget +
      zorgtoeslag +
      huurtoeslag;

    return {
      brutoloon: brutoloon,
      arbeidsinkomen: arbeidsinkomen,
      toetsingsInkomen: toetsingsInkomen,
      pensioenPremie: pensioenPremie,
      anderenArbeidsinkomen: anderenArbeidsinkomen.filter((_) => _ > 0),
      nettoloonBelasting: nettoBelasting,
      nettoArbeidsinkomen: nettoArbeidsinkomen,
      nettoInkomen: nettoInkomen,
      nettoloon: nettoloon,
      ibBox1: ibBox1Arbeid,
      ak: arbeidskorting,
      akMax: arbeidskortingMax,
      iack: inACK,
      iackMax: inACKMax,
      ahk: algemeneHeffingsKorting,
      ahkMax: algemeneHeffingsKortingMax,
      nvzk: nvzk,
      zt: zorgtoeslag,
      woningType: this.wonen.woning_type,
      wonen: wonen,
      hraMax: hraMax,
      kb: this.algemeneGegevens.kinderbijslag,
      kgb: kindgebondenBudget,
    } as BerekenResultaatType;
  }
}
