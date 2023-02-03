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
 * Berekeing van huurtoeslag
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/huurtoeslag/
 */

import data from "@/js/belasting/belasting_data";

const HT = data.HT[data.JAAR];
const HTBP = data.HTBP[data.JAAR];

function huurtoeslag(rekeninkomen, rekenhuur, aantalPersonen, aow) {
  // als jonger 23 dan HT.KwKrtGrns
  if (rekenhuur > HT.MaxHuur) {
    return 0;
  }
  let mph = aantalPersonen > 1;
  let htbp = aow
    ? mph
      ? HTBP.MPHAOW
      : HTBP.EPHAOW
    : mph
    ? HTBP.MPH
    : HTBP.EPH;
  let basishuur =
    (rekeninkomen > htbp.MinInkGr
      ? htbp["Factor a"] * rekeninkomen * rekeninkomen +
        htbp["Factor b"] * rekeninkomen
      : htbp.MinNrmHr) + htbp.TaakStBedr;
  let a = Math.max(0, Math.min(HT.KwKrtGrns, rekenhuur) - basishuur);
  let aftopGrens = aantalPersonen > 2 ? HT.AftopB : HT.AftopA;
  let b =
    rekenhuur > HT.KwKrtGrns
      ? Math.max(
          0,
          Math.min(rekenhuur, aftopGrens) - Math.max(HT.KwKrtGrns, basishuur)
        )
      : 0;
  let c =
    !mph && rekenhuur > aftopGrens
      ? Math.max(0, rekenhuur - Math.max(aftopGrens, basishuur))
      : 0;
  return 12 * Math.floor(a + 0.65 * b + 0.4 * c);
}

function huurtoeslagMax(rekeninkomen) {
  let maxhuur = HT.MaxHuur;

  return huurtoeslag(rekeninkomen, maxhuur, 1, false);
}

export default {
  huurtoeslag,
  huurtoeslagMax,
};
