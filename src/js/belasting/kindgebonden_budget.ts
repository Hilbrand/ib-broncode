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
 * Berekening van kinder gebonden budget.
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/informatieblad-kindgebonden-budget-2023
 */

import { LeeftijdType, PersoonType } from "../../types";
import data from "./belasting_data.js";
import functies from "../functies";

function rekenBasis(jaar: number, aantalKinderen: number, toeslagenPartner: boolean): number {
  const tabelj = data.TABEL[jaar];
  const maxkgbj = data.MAXKGB[jaar];

  return aantalKinderen > 0 ? maxkgbj[aantalKinderen] + (toeslagenPartner ? 0 : tabelj.VHgeenTP) : 0;
}

/**
 * Bereken maximaal kindergebonden budget.
 *
 * @param personen
 * @param toeslagenPartner
 * @returns
 */

function maxKindgebondenBudget(jaar: number, personen: PersoonType[], toeslagenPartner: boolean): number {
  const tabelj = data.TABEL[jaar];
  const k05 = functies.telPersonen(personen, LeeftijdType.K05);
  const k611 = functies.telPersonen(personen, LeeftijdType.K611);
  const k1215 = functies.telPersonen(personen, LeeftijdType.K1215);
  const k1617 = functies.telPersonen(personen, LeeftijdType.K1617);
  const kinderen = k05 + k611 + k1215 + k1617;
  const basis = rekenBasis(jaar, kinderen, toeslagenPartner);

  return basis + k1215 * tabelj.VH12Plus + k1617 * tabelj.VH16Plus;
}

function kindgebondenBudget(
  jaar: number,
  toetsinkomen: number,
  maxKindergebondenBudget: number,
  toeslagenPartner: boolean
): number {
  const tabelj = data.TABEL[jaar];

  if (maxKindergebondenBudget > 0) {
    const maxInk = (toeslagenPartner ? tabelj.VerhoogdDrempelInkomen : 0) + tabelj.DrempelinkomenKGB;
    if (toetsinkomen > maxInk) {
      return Math.max(0, maxKindergebondenBudget - Math.floor((toetsinkomen - maxInk) * (tabelj.TslgTP / 100)));
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
