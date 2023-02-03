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
 * Berekeing van eigen woning forfait
 *
 *  https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait
 */
import data from "@/js/belasting/belasting_data";

const EWF = data.EWF[data.JAAR].ewf;
const KSF = data.EWF[data.JAAR].kSchuldFactor;

//  Eigenwoning forfait
function eigenwoningforfait(wozWaarde) {
  for (let ewf of EWF) {
    if (wozWaarde < ewf.woz.tm) {
      return Math.floor(
        ewf.minimum
          ? ewf.minimum + ewf.factor * (wozWaarde - ewf.woz.van)
          : ewf.factor * wozWaarde
      );
    }
  }
}

// Rente moet worden opgesteld bij inkomen (aftrek geeft negative waarde)
function hypotheekRenteAftrek(rente, wozWaarde) {
  let ewf = eigenwoningforfait(wozWaarde);
  let ew = -rente + ewf;

  return Math.floor(ew > 0 ? ew * KSF : ew);
}

export default {
  hypotheekRenteAftrek,
};
