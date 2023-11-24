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
 * Berekening van kinderopvang toeslag
 *
 * NIET IN GEBRUIK
 */

import data from "./belasting_data";
import { LeeftijdType, PersoonType } from "../../types";
import functies from "../functies";

function kinderopvangToeslag(
  jaar: number,
  toestingsInkomen: number,
  personen: PersoonType[]
): number {
  const kqttj = data.KOTT[jaar];
  const k05 = functies.telPersonen(personen, LeeftijdType.K05);
  const k611 = functies.telPersonen(personen, LeeftijdType.K611);
  const k1215 = functies.telPersonen(personen, LeeftijdType.K1215);
  const k1617 = functies.telPersonen(personen, LeeftijdType.K1617);

  const kinderen = k05 + k611 + k1215 + k1617;

  if (kinderen == 0) {
    return 0;
  }
  kqttj.forEach((kott) => {
    if (toestingsInkomen < kott.inkomen.tm) {
      return kott.kinderopvangtoeslag;
    }
  });
}

// function kinderopvangToeslag()
//   TABEL.MaxUren
