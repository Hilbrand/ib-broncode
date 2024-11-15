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
 * Berekening van inkomens afhankelijke combinatie korting.
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/inkomensafhankelijke_combikorting/
 */

import data from "./belasting_data";
import inkomen from "../belasting/inkomen";
import { LeeftijdType, PersoonType } from "../../ts/types";

/**
 * Bepaalt laagste inkomen van alle personen, behalve de eerste.
 * De eerste persoon wordt overgeslagen, want daarvoor wordt het inkomen dynamisch berekend.
 * Als er andere personen zijn dan geeft het terug Number.MAX_VALUE
 */
function bepaalLaagsteArbeidsInkomenAnderen(andereInkomens: number[]): number {
  return andereInkomens.reduce((min, _) => Math.min(min, _), Number.MAX_VALUE);
}

/**
 * U hebt geen of minder dan 6 maanden een fiscale partner.
 * Of u hebt langer dan 6 maanden een fiscale partner,
 * én u hebt een lager arbeidsinkomen dan uw fiscale partner.
 */
function inkomensafhankelijkeCombinatiekorting(
  jaar: string,
  toetsinkomen: number,
  andereInkomens: number[],
  aow: boolean = false
): number {
  const tabel = data.IACK[jaar];
  const laagstePartnerinkomen = bepaalLaagsteArbeidsInkomenAnderen(andereInkomens);

  if (andereInkomens.length > 0 && toetsinkomen > laagstePartnerinkomen) {
    return 0;
  }
  const t = aow ? tabel.HAOW : tabel.H;

  return toetsinkomen < t.MinAInk
    ? 0
    : Math.min(t.MaxInkAfKrt, Math.round((toetsinkomen - (t.MinAInk - 1)) * t.InkKorting));
}

export default {
  bepaalLaagsteArbeidsInkomenAnderen,
  inkomensafhankelijkeCombinatiekorting,
};
