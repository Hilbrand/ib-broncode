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
import d from "@/js/details";

const EWF = data.EWF[data.JAAR].ewf;
const KSF = data.EWF[data.JAAR].kSchuldFactor;
const EWF_BRONNEN = [
  'Eigenwoningforfait berekening',
  "https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait"
];

function eigenwoningforfaitDetails(wozWaarde, ewf, ewfBerekend) {
  let berekening;
  let conditie;
  if (ewf.minimum) {
    conditie = "WOZ waarde " + d.euro(wozWaarde) + " boven " + d.euro(ewf.woz.van);
    berekening = d.eur(ewf.minimum) + " + " + d.f2p(ewf.factor, 2) + " x (" + d.euro(wozWaarde) +
     " - " - d.euro(ewoz.van) + ")";

  } else {
    conditie = "WOZ waarde " + d.euro(wozWaarde) + " tussen " + d.euro(ewf.woz.van) + " en " + d.euro(ewf.woz.tm);
    berekening = "Eigenwoning forfait " + d.f2p(ewf.factor, 2) + "% x " + d.euro(wozWaarde); 
  }
  return d.bouw("Eigenwoning forfait", [conditie], [berekening], ewfBerekend, EWF_BRONNEN);
}

//  Eigenwoning forfait
function eigenwoningforfait(wozWaarde, details = false) {
  for (let ewf of EWF) {
    if (wozWaarde < ewf.woz.tm) {
      let ewfBerekend = Math.floor(
        ewf.minimum
          ? ewf.minimum + ewf.factor * (wozWaarde - ewf.woz.van)
          : ewf.factor * wozWaarde
      );
      return details ? [ewfBerekend, eigenwoningforfaitDetails(wozWaarde, ewf, ewfBerekend)] : [ewfBerekend];
    }
  }
}

function hypotheekRenteAftrekDetails(rente, ewf, ew, hra) {
  var berekening = "Eigenwoningforfait " + d.euro(ewf[0]) + " - Rente " + d.euro(rente); 

  if (ew > 0) {
    berekening = "(" + berekening + ") x " + d.f2p(KSF);
  } else {
  }
  console.log(ewf)
  let ewf1 = ewf[1];
  return d.bouw("Hypotheek Renteaftrek", [ewf1.condities[0]], [ewf1.berekeningen[0], berekening], hra, EWF_BRONNEN);
}

// Rente moet worden opgesteld bij inkomen (aftrek geeft negative waarde)
function hypotheekRenteAftrek(rente, wozWaarde, details = false) {
  let ewf = eigenwoningforfait(wozWaarde, details);
  let ew = ewf[0] - rente;
  let hra = Math.floor(ew > 0 ? ew * KSF : ew);

  return details ? hypotheekRenteAftrekDetails(rente, ewf, ew, hra) : hra;
}

export default {
  hypotheekRenteAftrek,
};
