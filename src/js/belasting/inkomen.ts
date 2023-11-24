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

/**
 * Berekening van inkomen, arbeidskorting en algemeneheffingskorting
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2023
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2023
 * IB AOW: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-hebt-voor-2023-aow-leeftijd
 */

import { LeeftijdType, PersoonType } from "../../types";
import data from "./belasting_data";

function algemeneHeffingsKorting(
  jaar: number,
  toetsingsinkomen: number,
  maxBelasting: number,
  aow: boolean
): number {
  const ahkt = aow ? data.AHK[jaar].AOW : data.AHK[jaar].V;

  for (let ahk of ahkt) {
    if (toetsingsinkomen < ahk.inkomen.tot) {
      const algemeneHeffingsKorting =
        ahk.minimum + (toetsingsinkomen - ahk.minus) * ahk.factor;

      return Math.round(Math.min(maxBelasting, algemeneHeffingsKorting));
    }
  }
  return 0;
}

function arbeidskorting(
  jaar: number,
  arbeidsinkomen: number,
  maxArbeidsinkomen: number,
  aow: boolean
): number {
  const akt = aow ? data.AK[jaar].AOW : data.AK[jaar].V;

  for (let ak of akt) {
    if (arbeidsinkomen < ak.inkomen.tot) {
      let arbeidskorting = ak.minimum + (arbeidsinkomen - ak.minus) * ak.factor;

      return Math.round(Math.min(maxArbeidsinkomen, arbeidskorting));
    }
  }
  return 0;
}

function maxArbeidsKorting(
  jaar: number,
  toetsingsInkomen: number,
  maxBelasting: number,
  aow: boolean
): number {
  return (
    inkomstenBelasting(jaar, toetsingsInkomen, aow) -
    algemeneHeffingsKorting(jaar, toetsingsInkomen, maxBelasting, aow)
  );
}

function toetsingsinkomen(
  arbeidsinkomen: number,
  hypotheekRenteAftrek: number
): number {
  return Math.max(0, arbeidsinkomen + (hypotheekRenteAftrek || 0));
}

function toeslagenToetsInkomen(
  arbeidsinkomen: number,
  personen: PersoonType[]
): number {
  return (
    arbeidsinkomen +
    personen.reduce(
      (subtotaal, a) =>
        subtotaal + (isNaN(a.bruto_inkomen) ? 0 : a.bruto_inkomen),
      0
    )
  );
}

function ibRange(toetsingsInkomen: number, p): number {
  const top = Math.min(p.tot || toetsingsInkomen, toetsingsInkomen);
  const range = Math.max(0, top - (p.vanaf || 0));

  return p.percentage * range;
}

function inkomstenBelasting(
  jaar: number,
  toetsingsInkomen: number,
  aow: boolean
): number {
  const ibTabel = aow ? data.IB[jaar].AOW : data.IB[jaar].V;

  return Math.round(
    ibTabel.reduce((ib, p) => ib + ibRange(toetsingsInkomen, p), 0)
  );
}

function netto(jaar: number, bruto: number, aow: boolean): number {
  return Math.min(bruto, bruto - inkomstenBelasting(jaar, bruto, aow));
}

function nettoKortingenInkomens(jaar: number, personen: PersoonType[]) {
  let nk = [];
  personen.forEach((p, idx) => {
    if (idx == 0) {
      return;
    }
    let aow = p.leeftijd == LeeftijdType.AOW;
    if (p.leeftijd == LeeftijdType.V || aow) {
      let inkomen = p.bruto_inkomen !== undefined ? p.bruto_inkomen : 0;
      // Hier wordt toestings inkomensten belasting berekend van anderen
      // Echter hypotheek aftrek wordt gedaan bij eerste persoon en niet hier
      // Het kan zijn dat een deel of alles hyppotheek aftrek bij anderen te leggen,
      // de totale belasting gunstiger uitkomt. Maar die optie is hier niet meegenomen.
      let tib = inkomstenBelasting(jaar, inkomen, aow);

      nk.push({
        bruto: inkomen,
        netto: netto(jaar, inkomen, aow),
        arbeidskorting: 0, //arbeidskorting(jaar, inkomen, aow),
        algemeneHeffingsKorting: algemeneHeffingsKorting(
          jaar,
          inkomen,
          tib,
          aow
        ),
      });
    }
  });
  return nk;
}

export default {
  toetsingsinkomen,
  toeslagenToetsInkomen,
  inkomstenBelasting,
  maxArbeidsKorting,
  arbeidskorting,
  algemeneHeffingsKorting,
  netto,
  nettoKortingenInkomens,
};
