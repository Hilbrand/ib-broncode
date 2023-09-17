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

//  Eigenwoning forfait
function eigenwoningforfait(jaar, wozWaarde) {
  const ewfj = data.EWF[jaar].ewf;

  for (let ewf of ewfj) {
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
function hypotheekRenteAftrek(jaar, rente, wozWaarde) {
  const ksfj = data.EWF[jaar].kSchuldFactor;
  const ewf = eigenwoningforfait(jaar, wozWaarde);
  const ew = -rente + ewf;

  return Math.floor(ew > 0 ? ew * ksfj : ew);
}

export default {
  hypotheekRenteAftrek,
};
