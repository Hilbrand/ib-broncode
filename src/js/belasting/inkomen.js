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
 * Berekeing van inkomen, arbeidskorting en algemeneheffingskorting
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2023
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2023
 */

import data from "@/js/belasting/belasting_data";

const AHK = data.AHK[data.JAAR]["V"];
const AK = data.AK[data.JAAR]["V"];

function algemeneHeffingsKorting(toetsingsinkomen, maxBelasting) {
  for (let i = 0; i < AHK.length; i++) {
    let ahk = AHK[i];

    if (toetsingsinkomen < ahk.inkomen.tot) {
      let algemeneHeffingsKorting =
        ahk.minimum + (toetsingsinkomen - ahk.minus) * ahk.factor;

      return Math.round(Math.min(maxBelasting, algemeneHeffingsKorting));
    }
  }
  return 0;
}

function arbeidskorting(arbeidsinkomen, maxArbeidsinkomen) {
  for (let i = 0; i < AK.length; i++) {
    let ak = AK[i];

    if (arbeidsinkomen < ak.inkomen.tot) {
      let arbeidskorting = ak.minimum + (arbeidsinkomen - ak.minus) * ak.factor;

      return Math.round(Math.min(maxArbeidsinkomen, arbeidskorting));
    }
  }
  return 0;
}

function maxArbeidsKorting(toetsingsInkomen, maxBelasting) {
  return (
    inkomstenBelasting(toetsingsInkomen) -
    algemeneHeffingsKorting(toetsingsInkomen, maxBelasting)
  );
}

function toetsingsinkomen(arbeidsinkomen, hypotheekRenteAftrek) {
  return Math.max(0, arbeidsinkomen + (hypotheekRenteAftrek || 0));
}

function toeslagenToetsInkomen(arbeidsinkomen, personen) {
  return (
    arbeidsinkomen +
    personen.reduce(
      (subtotaal, a) =>
        subtotaal + (isNaN(a.bruto_inkomen) ? 0 : a.bruto_inkomen),
      0
    )
  );
}

function inkomstenBelasting(toetsingsInkomen) {
  return Math.round(
    Math.min(data.IBGRENS_2023, toetsingsInkomen) * 0.3693 +
      Math.max(0, toetsingsInkomen - data.IBGRENS_2023) * 0.495
  );
}

function netto(bruto) {
  return Math.min(bruto, bruto - inkomstenBelasting(bruto));
}

function nettoKortingenInkomens(personen) {
  let nk = [];
  for (let idx in personen) {
    if (idx == 0) {
      continue;
    }
    let p = personen[idx];
    if (p.leeftijd == "V" || p.leeftijd == "AOW") {
      let inkomen = p.bruto_inkomen !== undefined ? p.bruto_inkomen : 0;

      nk.push({
        bruto: inkomen,
        netto: netto(inkomen),
        arbeidskorting: arbeidskorting(inkomen),
        algemeneHeffingsKorting: algemeneHeffingsKorting(inkomen),
      });
    }
  }
  let sum = nk.reduce((s, a) => {
    s.brutto += a.brutto;
    s.netto += a.netto;
    s.arbeidskorting += a.arbeidskorting;
    s.algemeneHeffingsKorting += a.algemeneHeffingsKorting;
    return s;
  }, {});

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
