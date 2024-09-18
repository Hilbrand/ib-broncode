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
 * Berekening van eigen woning forfait
 *
 *  https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait
 */
import data from "./belasting_data";

//  Eigenwoning forfait
function eigenwoningforfait(jaar: string, wozWaarde: number): number {
  const ewfj = data.EWF[jaar].ewf;

  for (let ewf of ewfj) {
    if (wozWaarde < ewf.woz.tm) {
      return Math.floor(ewf.minimum ? ewf.minimum + ewf.factor * (wozWaarde - ewf.woz.van) : ewf.factor * wozWaarde);
    }
  }
}

// Rente moet worden opgesteld bij inkomen (aftrek geeft negative waarde)
function hypotheekRenteAftrek(jaar: string, rente: number, wozWaarde: number): number {
  const ksfj = data.EWF[jaar].kSchuldFactor;
  const ewf = eigenwoningforfait(jaar, wozWaarde);
  const ew = -rente + ewf;

  // Als uw eigenwoningforfait hoger is dan uw hypotheekrenteaftrek.
  // Dan telt uw eigenwoningforfait maar voor een klein deel mee.
  // Vanwege de zogenoemde ‘Wet Hillen’
  return Math.floor(ew > 0 ? ew * ksfj : ew);
}

export default {
  eigenwoningforfait,
  hypotheekRenteAftrek,
};
