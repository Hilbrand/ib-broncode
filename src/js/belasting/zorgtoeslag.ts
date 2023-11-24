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
 * Berekening van zorgtoeslag
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/informatieblad-zorgtoeslag-2023
 */

import data from "./belasting_data";

function zorgtoeslag(
  jaar: number,
  inkomen: number,
  toeslagpartner: boolean
): number {
  const tabel = data.TABEL[jaar];
  const drempel = tabel.Drempel;

  if (
    (toeslagpartner && inkomen > tabel.MxInk2) ||
    (!toeslagpartner && inkomen > tabel.MxInk1)
  ) {
    return 0;
  }
  if (toeslagpartner) {
    return Math.floor(
      tabel.SP * 2 -
        ((tabel.TDMT / 100) * drempel +
          (tabel.BDMT / 100) * Math.max(0, inkomen - drempel))
    );
  } else {
    return Math.floor(
      tabel.SP -
        ((tabel.TDA / 100) * drempel +
          (tabel.BDA / 100) * Math.max(0, inkomen - drempel))
    );
  }
}

export default {
  zorgtoeslag,
};
