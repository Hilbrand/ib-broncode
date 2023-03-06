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
 * IB AOW: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-hebt-voor-2023-aow-leeftijd
 */

import data from "@/js/belasting/belasting_data";
import d from "@/js/details";

const AHK = data.AHK[data.JAAR];
const AK = data.AK[data.JAAR];
const IB = data.IB[data.JAAR];

const AHK_BRONNEN = [
  "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2023",
];
const AK_BRONNEN = [
  "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2023",
];

function algemeneHeffingsKortingDetails(
  toetsingsinkomen,
  maxBelasting,
  aow,
  ahk,
  algemeneHeffingsKorting,
  ahkBerekend
) {
  let conditie =
    (ahk.inkomen.van > 0 ? "vanaf " + d.euro(ahk.inkomen.van) : "") +
    (" tot " + d.euro(ahk.inkomen.tot));
  let berekening =
    (ahk.minimum > 0 ? d.euro(ahk.minimum) : "") +
    (ahk.factor > 0
      ? " - " +
        d.f2p(ahk.factor, 3) +
        " x (" +
        d.euro(toetsingsinkomen) +
        " - " +
        d.euro(ahk.minus) +
        ")"
      : "");
  let ahkMax = d.euro(Math.round(algemeneHeffingsKorting));
  var condities = [d.aow(aow) + conditie];
  if (maxBelasting < algemeneHeffingsKorting) {
    condities.push(
      "Begrensd op te betalen belasting " +
        d.euro(maxBelasting) +
        ", berekend: " +
        ahkMax
    );
  }

  return bouw(
    "Algemee Heffingskorting",
    condities,
    [berekening],
    ahkBerekend,
    AHK_BRONNEN
  );
}

function algemeneHeffingsKortingDetailsBoven(aow) {
  let ahkt = aow ? AHK.AOW : AHK.V;
  let conditie =
    aow(aow) + " vanaf " + d.euro(ahkt.slice(-1).pop().inkomen.tot);

  return bouw(
    "Algemene Heffingskorting",
    [conditie],
    [d.euro(0)],
    0,
    AHK_BRONNEN
  );
}

function arbeidskortingDetails(
  toetsingsinkomen,
  maxArbeidsinkomen,
  aow,
  ak,
  arbeidskorting,
  akBerekend
) {
  let conditie =
    (ak.inkomen.van > 0 ? "vanaf " + d.euro(ak.inkomen.van) : "") +
    (" tot " + d.euro(ak.inkomen.tot));
  let berekening =
    (ak.minimum > 0 ? d.euro(ak.minimum) : "") +
    (ak.factor > 0
      ? " - " +
        d.f2p(ak.factor, 3) +
        " x (" +
        d.euro(toetsingsinkomen) +
        " - " +
        d.euro(ah.minus) +
        ")"
      : "");
  let akMax = d.euro(Math.round(arbeidskorting));
  var condities = [d.aow(aow) + conditie];
  if (maxArbeidsinkomen < arbeidskorting) {
    condities.push(
      "Begrensd op te betalen belasting " +
        d.euro(maxArbeidsinkomen) +
        ", berekend: " +
        akMax
    );
  }

  return bouw(
    "Arbeidskorting",
    condities,
    [berekening],
    akBerekend,
    AK_BRONNEN
  );
}

function arbeidskortingDetailsBoven(aow) {
  let akt = aow ? AK.AOW : AK.V;
  let conditie =
    d.aow(aow) + " vanaf " + d.euro(akt.slice(-1).pop().inkomen.tot);

  return bouw("Arbeidskorting", [conditie], [d.euro(0)], 0, AK_BRONNEN);
}

export default {
  algemeneHeffingsKortingDetails,
  algemeneHeffingsKortingDetailsBoven,
  arbeidskortingDetails,
  arbeidskortingDetailsBoven,
};
