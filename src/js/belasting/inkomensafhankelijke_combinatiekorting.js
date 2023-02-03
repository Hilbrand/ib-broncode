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
 * Berekeing van inkomens afhankelijke combinatie korting.
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/inkomensafhankelijke_combikorting/
 */

import data from "@/js/belasting/belasting_data";

const tabel = data.IACK[data.JAAR];

/**
 * Bepaalt laagste inkomen van alle personen, behalve de eerste.
 * De eerste persoon wordt overgeslagen, want daarvoor wordt het inkomen dynamisch berekend.
 * Als er andere personen zijn dan geeft het terug Number.MAX_VALUE
 */
function bepaalLaagsteArbeidsInkomenAnderen(personen) {
  let laagsteInkomen = Number.MAX_VALUE;

  for (let idx in personen) {
    if (idx == 0) {
      continue; // Sla eerste persoon over
    }
    let p = personen[idx];

    if (p.leeftijd == "V" || p.leeftijd == "AOW") {
      let pInkomen = p.bruto_inkomen === undefined ? 0 : p.bruto_inkomen;

      laagsteInkomen = Math.min(pInkomen, laagsteInkomen);
    }
  }
  return laagsteInkomen;
}

function inkomensafhankelijkeCombinatiekorting(
  toetsinkomen,
  laagstePartnerinkomen,
  aow = false
) {
  let arbeidsinkomen =
    laagstePartnerinkomen < 0
      ? toetsinkomen
      : Math.min(toetsinkomen, laagstePartnerinkomen);
  let t = aow ? tabel.HAOW : tabel.H;

  return arbeidsinkomen < t.MinAInk
    ? 0
    : arbeidsinkomen < t.MaxAInk
    ? Math.floor((arbeidsinkomen - t.MinAInk) * t.InkKorting)
    : t.MaxInkAfKrt;
}

export default {
  bepaalLaagsteArbeidsInkomenAnderen,
  inkomensafhankelijkeCombinatiekorting,
};
