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
 * Berekeing van kinder gebonden budget.
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/informatieblad-kindgebonden-budget-2023
 */

import data from "@/js/belasting/belasting_data";
import functies from "@/js/functies";

const TABEL = data.TABEL[data.JAAR];
const MAXKGB = data.MAXKGB[data.JAAR];

const KGB_BRONNEN = [
  "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/berekening-kindgebonden-budget-2023",
];

function rekenBasis(aantalKinderen, toeslagenPartner) {
  return aantalKinderen > 0
    ? MAXKGB[aantalKinderen] + (toeslagenPartner ? 0 : TABEL.VHgeenTP)
    : 0;
}

/**
 * Bereken maximaal kindergebonden budget.
 *
 * @param personen
 * @param toeslagenPartner
 * @returns
 */

function maxKindgebondenBudget(personen, toeslagenPartner) {
  let k05 = functies.telPersonen(personen, "K05");
  let k611 = functies.telPersonen(personen, "K611");
  let k1215 = functies.telPersonen(personen, "K1215");
  let k1617 = functies.telPersonen(personen, "K1617");
  let kinderen = k05 + k611 + k1215 + k1617;
  let basis = rekenBasis(kinderen, toeslagenPartner);

  return basis + k1215 * TABEL.VH12Plus + k1617 * TABEL.VH16Plus;
}

function kindgebondenBudget(
  toetsinkomen,
  maxKindergebondenBudget,
  toeslagenPartner
) {
  if (maxKindergebondenBudget > 0) {
    let maxInk =
      (toeslagenPartner ? TABEL.VerhoogdDrempelInkomen : 0) +
      TABEL.DrempelinkomenKGB;
    if (toetsinkomen > maxInk) {
      return Math.max(
        0,
        maxKindergebondenBudget -
          Math.floor((toetsinkomen - maxInk) * (TABEL.TslgTP / 100))
      );
    } else {
      return maxKindergebondenBudget;
    }
  } else {
    return 0;
  }
}

export default {
  maxKindgebondenBudget,
  kindgebondenBudget,
};
