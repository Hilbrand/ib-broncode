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
 * Berekeing van kinderbijslag.
 *
 */

import data from "@/js/belasting/belasting_data";
import functies from "../functies";

function kinderbijslag(jaar, personen) {
  const kbsj = data.KBS[jaar];
  let k05 = functies.telPersonen(personen, "K05");
  let k611 = functies.telPersonen(personen, "K611");
  let k1215 = functies.telPersonen(personen, "K1215");
  let k1617 = functies.telPersonen(personen, "K1617");

  return Math.floor(
    4 * (k05 * kbsj.K05 + k611 * kbsj.K611 + (k1215 + k1617) * kbsj.K1217)
  );
}

export default {
  kinderbijslag,
};
