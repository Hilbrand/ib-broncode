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
 * Berekening van inkomen, arbeidskorting en algemene heffingskorting
 *
 * Inkomsten belasting
 * https://wetten.overheid.nl/BWBR0011353/2024-04-30/0
 *
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2023
 * https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2023
 * IB AOW: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-hebt-voor-2023-aow-leeftijd
 */

import { isVolwassene } from "../../ts/functies";
import { InkomenType, PersoonType } from "../../ts/types";
import data from "./belasting_data";

// Berekening van pensioen premie. Als brutoloon < minimum loon, dan percentage minimum loon gebruiken.
// Dat is, ((minimum loon - franchise) / minimum loon) * premie factor
// Als boven minimum loon dan (bruto inkomen-franchise) * premie factor
function pensioenPremie(jaar: string, brutoloon: number, franchise: number, premiePercentage: number): number {
  const wml = data.WML[jaar];
  let premie;
  if (brutoloon < wml) {
    premie = brutoloon * (1 - franchise / wml) * premiePercentage * 0.01;
  } else {
    premie = (brutoloon - franchise) * premiePercentage * 0.01;
  }
  return Math.round(premie);
}

function algemeneHeffingsKorting(jaar: string, toetsingsinkomen: number, aow: boolean): number {
  const ahkt = aow ? data.AHK[jaar].AOW : data.AHK[jaar].V;

  for (let ahk of ahkt) {
    if (toetsingsinkomen < ahk.inkomen.tot) {
      const algemeneHeffingsKorting = ahk.maximaal - (toetsingsinkomen - ahk.afbouwpunt) * ahk.afbouwfactor;

      return Math.round(algemeneHeffingsKorting);
    }
  }
  return 0;
}

function arbeidskorting(jaar: string, arbeidsinkomen: number, aow: boolean): number {
  const akt = aow ? data.AK[jaar].AOW : data.AK[jaar].V;

  for (let ak of akt) {
    if (arbeidsinkomen < ak.inkomen.tot) {
      let arbeidskorting = ak.grens + (arbeidsinkomen - ak.afbouwpunt) * ak.afbouwfactor;

      return Math.round(arbeidskorting);
    }
  }
  return 0;
}

function toetsingsinkomen(arbeidsinkomen: number, hypotheekRenteAftrek: number): number {
  return Math.max(0, arbeidsinkomen - (hypotheekRenteAftrek || 0));
}

function anderePersoonToetsInkomen(arbeidsinkomen: number, persoon: PersoonType): number {
  if (persoon.inkomen_type === InkomenType.PERCENTAGE) {
    return arbeidsinkomen * persoon.percentage * 0.01;
  } else {
    return isNaN(persoon.bruto_inkomen) ? 0 : persoon.bruto_inkomen;
  }
}

function anderePersonenToetsInkomen(arbeidsinkomen: number, personen: PersoonType[]): number[] {
  return personen.length > 1
    ? personen
        .slice(1)
        .filter(isVolwassene)
        .map((p) => anderePersoonToetsInkomen(arbeidsinkomen, p))
    : [];
}

function isMeestVerdiener(arbeidsinkomen: number, andereInkomens: number[]): boolean {
  return andereInkomens.length != 0 && arbeidsinkomen > andereInkomens.reduce((min, _) => Math.max(min, _), 0);
}

function toeslagenToetsInkomen(arbeidsinkomen: number, andereInkomens: number[]): number {
  return arbeidsinkomen + (andereInkomens.length != 0 ? andereInkomens.reduce((subtotaal, a) => subtotaal + a, 0) : 0);
}

function ibRange(toetsingsInkomen: number, p): number {
  const top = Math.min(p?.tot - 1 || toetsingsInkomen, toetsingsInkomen);

  const range = Math.max(0, top - (p?.vanaf - 1 || 0));
  return p.percentage * range;
}

function inkomstenBelasting(jaar: string, toetsingsInkomen: number, aow: boolean): number {
  const ibTabel = aow ? data.IB[jaar].AOW : data.IB[jaar].V;

  return Math.round(ibTabel.reduce((ib, _) => ib + ibRange(toetsingsInkomen, _), 0));
}

function netto(jaar: string, bruto: number, aow: boolean = false): number {
  return Math.min(bruto, bruto - inkomstenBelasting(jaar, bruto, aow));
}

export default {
  algemeneHeffingsKorting,
  anderePersoonToetsInkomen,
  anderePersonenToetsInkomen,
  arbeidskorting,
  inkomstenBelasting,
  isMeestVerdiener,
  netto,
  pensioenPremie,
  toeslagenToetsInkomen,
  toetsingsinkomen,
};
