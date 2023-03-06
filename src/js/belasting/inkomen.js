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
 * AHK https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2023
 * AK https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2023
 * IB AOW: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-hebt-voor-2023-aow-leeftijd
 */

import data from "@/js/belasting/belasting_data";
import ikd from "@/js/belasting/inkomen_details";

const AHK = data.AHK[data.JAAR];
const AK = data.AK[data.JAAR];
const IB = data.IB[data.JAAR];

/**
 * Berekenen van Algemene hefffingskorting.
 *
 * @param {*} toetsingsinkomen
 * @param {*} maxBelasting maximum belasting dat betaald kan worden
 * @param {boolean} aow true als aow leeftijd
 * @param {boolean} details true om detail berekening terug te krijgen
 * @returns
 */
function algemeneHeffingsKorting(
  toetsingsinkomen,
  maxBelasting,
  aow,
  details = false
) {
  let ahkt = aow ? AHK.AOW : AHK.V;
  for (let ahk of ahkt) {
    if (toetsingsinkomen < ahk.inkomen.tot) {
      let algemeneHeffingsKorting =
        ahk.minimum - (toetsingsinkomen - ahk.minus) * ahk.factor;
      let ahkBerekend = Math.round(
        Math.min(maxBelasting, algemeneHeffingsKorting)
      );

      return details
        ? ikd.algemeneHeffingsKortingDetails(
            toetsingsinkomen,
            maxBelasting,
            aow,
            ahk,
            algemeneHeffingsKorting,
            ahkBerekend
          )
        : ahkBerekend;
    }
  }
  return details ? ikd.algemeneHeffingsKortingDetailsBoven(aow) : 0;
}

/**
 * Berekenen van arbeidskorting
 *
 * @param {B} arbeidsinkomen
 * @param {*} maxArbeidsinkomen
 * @param {boolean} aow true als aow leeftijd
 * @param {boolean} details true om detail berekening terug te krijgen
 * @returns
 */
function arbeidskorting(
  arbeidsinkomen,
  maxArbeidsinkomen,
  aow,
  details = false
) {
  let akt = aow ? AK.AOW : AK.V;
  for (let ak of akt) {
    if (arbeidsinkomen < ak.inkomen.tot) {
      let arbeidskorting = ak.minimum + (arbeidsinkomen - ak.minus) * ak.factor;
      let akBerekend = Math.round(Math.min(maxArbeidsinkomen, arbeidskorting));

      return details
        ? ikd.arbeidskortingDetails(
            arbeidsinkomen,
            maxArbeidsinkomen,
            aow,
            akt,
            arbeidskorting,
            arbeidskortingakBerekend
          )
        : akBerekend;
    }
  }
  return details ? ikd.arbeidskortingDetailsBoven(aow) : 0;
}

/**
 *
 * @param {*} toetsingsInkomen
 * @param {*} maxBelasting
 * @param {*} aow
 * @returns
 */
function maxArbeidsKorting(toetsingsInkomen, maxBelasting, aow) {
  return (
    inkomstenBelasting(toetsingsInkomen, aow) -
    algemeneHeffingsKorting(toetsingsInkomen, maxBelasting, aow)
  );
}

/**
 *
 * @param {*} arbeidsinkomen
 * @param {*} hypotheekRenteAftrek
 * @returns
 */
function toetsingsinkomen(arbeidsinkomen, hypotheekRenteAftrek) {
  return Math.max(0, arbeidsinkomen + (hypotheekRenteAftrek || 0));
}

/**
 *
 * @param {*} arbeidsinkomen
 * @param {*} personen
 * @returns
 */
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

function ibRange(toetsingsInkomen, p) {
  let top = Math.min(p.tot || toetsingsInkomen, toetsingsInkomen);
  let range = Math.max(0, top - (p.vanaf || 0));

  return p.percentage * range;
}

function inkomstenBelasting(toetsingsInkomen, aow) {
  let ibTabel = aow ? IB.AOW : IB.V;

  return Math.round(
    ibTabel.reduce((ib, p) => ib + ibRange(toetsingsInkomen, p), 0)
  );
}

function netto(bruto, aow) {
  return Math.min(bruto, bruto - inkomstenBelasting(bruto, aow));
}

function nettoKortingenInkomens(personen) {
  let nk = [];
  for (let idx in personen) {
    if (idx == 0) {
      continue;
    }
    let p = personen[idx];
    let aow = p.leeftijd == "AOW";
    if (p.leeftijd == "V" || aow) {
      let inkomen = p.bruto_inkomen !== undefined ? p.bruto_inkomen : 0;
      // Hier wordt toestings inkomensten belasting berekend van anderen
      // Echter hypotheek aftrek wordt gedaan bij eerste persoon en niet hier
      // Het kan zijn dat een deel of alles hyppotheek aftrek bij anderen te leggen,
      // de totale belasting gunstiger uitkomt. Maar die optie is hier niet meegenomen.
      let tib = inkomstenBelasting(inkomen, aow);

      nk.push({
        bruto: inkomen,
        netto: netto(inkomen, aow),
        arbeidskorting: arbeidskorting(inkomen, aow),
        algemeneHeffingsKorting: algemeneHeffingsKorting(inkomen, tib, aow),
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
