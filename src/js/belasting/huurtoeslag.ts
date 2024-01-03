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
 * Berekening van huurtoeslag
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/huurtoeslag/
 */

import data from "./belasting_data.js";

function huurtoeslag(
  jaar: number,
  rekeninkomen: number,
  rekenhuur: number,
  aantalPersonen: number,
  aow: boolean
): number {
  const htj = data.HT[jaar];
  const htbpj = data.HTBP[jaar];
  // als jonger 23 dan htj.KwKrtGrns
  if (rekenhuur > htj.MaxHuur) {
    return 0;
  }
  const mph = aantalPersonen > 1;
  const htbp = aow ? (mph ? htbpj.MPHAOW : htbpj.EPHAOW) : mph ? htbpj.MPH : htbpj.EPH;
  const basishuur =
    (rekeninkomen > htbp.MinInkGr
      ? htbp["Factor a"] * rekeninkomen * rekeninkomen + htbp["Factor b"] * rekeninkomen
      : htbp.MinNrmHr) + htbp.TaakStBedr;
  const a = Math.max(0, Math.min(htj.KwKrtGrns, rekenhuur) - basishuur);
  const aftopGrens = aantalPersonen > 2 ? htj.AftopB : htj.AftopA;
  const b =
    rekenhuur > htj.KwKrtGrns ? Math.max(0, Math.min(rekenhuur, aftopGrens) - Math.max(htj.KwKrtGrns, basishuur)) : 0;
  const c = !mph && rekenhuur > aftopGrens ? Math.max(0, rekenhuur - Math.max(aftopGrens, basishuur)) : 0;
  return 12 * Math.floor(a + 0.65 * b + 0.4 * c);
}

function huurtoeslagMax(jaar: number, rekeninkomen: number): number {
  const maxhuur = data.HT[jaar].MaxHuur;

  return huurtoeslag(jaar, rekeninkomen, maxhuur, 1, false);
}

export default {
  huurtoeslag,
  huurtoeslagMax,
};
