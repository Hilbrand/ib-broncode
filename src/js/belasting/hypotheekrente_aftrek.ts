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
import d from "../../ts/details";

const EWF_BRONNEN = [
  'Eigenwoningforfait berekening',
  "https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait"
];

type Ewf = {
  ewf?: any,
  ewfBerekend?: number
}

function eigenwoningforfaitDetails(wozWaarde: number, ewf: Ewf) {
  let berekening;
  let conditie;
  if (ewf.ewf.minimum) {
    conditie = `WOZ waarde ${d.euro(wozWaarde)} boven ${d.euro(ewf.ewf.ewf.woz.van)}`;
    berekening = `${d.eur(ewf.ewf.minimum)} + ${d.f2p(ewf.ewf.factor, 2)} x (${d.euro(wozWaarde)} \
      - ${-d.euro(ewf.ewf.van)})`;
  } else {
    conditie = `WOZ waarde ${d.euro(wozWaarde)} tussen ${d.euro(ewf.ewf.woz.van)} en ${d.euro(ewf.ewf.woz.tm)}`;
    berekening = `Eigenwoningforfait ${d.f2p(ewf.ewf.factor, 2)}% x ${d.euro(wozWaarde)}`;
  }
  return d.bouw("Eigenwoningforfait", [conditie], [berekening], ewf.ewfBerekend, EWF_BRONNEN);
}

//  Eigenwoningforfait
function eigenwoningforfait(jaar: string, wozWaarde: number): Ewf {
  const ewfj = data.EWF[jaar].ewf;

  for (let ewf of ewfj) {
    if (wozWaarde < ewf.woz.tm) {
      let ewfBerekend = Math.floor(
        ewf.minimum
          ? ewf.minimum + ewf.factor * (wozWaarde - ewf.woz.van)
          : ewf.factor * wozWaarde
      );
      return { ewf: ewf, ewfBerekend: ewfBerekend };
    }
  }
  return {};
}

function hypotheekRenteAftrekDetails(jaar: string, rente: number, wozWaarde: number, ewf: Ewf, ew, hra) {
  var berekening = `Eigenwoningforfait ${d.euro(ewf.ewfBerekend)} - Rente ${d.euro(rente)}`;
  const ewfDetails = eigenwoningforfaitDetails(wozWaarde, ewf);

  if (ew > 0) {
    berekening = `(${berekening}) x ${d.f2p(jaar)}`;
  } else {
  }
  return d.bouw("Hypotheek Renteaftrek", [ewfDetails.condities[0]], [ewfDetails.berekeningen[0], berekening], hra, EWF_BRONNEN);
}

// De aftrek is meestal gelijk aan het verschil tussen het eigenwoningforfait en de aftrekbare kosten zoals de rente
function hypotheekRenteAftrek(jaar: string, rente: number, wozWaarde: number, details: boolean = false): number {
  const ksfj = data.EWF[jaar].kSchuldFactor;
  const ewf = eigenwoningforfait(jaar, wozWaarde);
  const ew = ewf.ewfBerekend ? ewf.ewfBerekend - rente : 0;

  // Als uw eigenwoningforfait hoger is dan uw hypotheekrenteaftrek.
  // Dan telt uw eigenwoningforfait maar voor een klein deel mee.
  // Vanwege de zogenoemde ‘Wet Hillen’
  const hra = -Math.floor(ew > 0 ? ew * ksfj : ew);
  return details ? hypotheekRenteAftrekDetails(jaar, rente, wozWaarde, ewf, ew, hra) : hra;
}

export default {
  eigenwoningforfait,
  hypotheekRenteAftrek,
};
