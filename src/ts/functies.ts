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

import { InvoerGegevensType, LeeftijdType, PeriodeType, PersoonType, WonenType, WoningType } from "./types";

function telKinderen(personen: PersoonType[]): number {
  return personen.length - telVolwassenen(personen);
}

function telPersonen(personen: PersoonType[], controleLeeftijd: LeeftijdType) {
  return personen.filter((p) => p.leeftijd == controleLeeftijd).length;
}

function telVolwassenen(personen: PersoonType[]): number {
  return telPersonen(personen, LeeftijdType.V) + telPersonen(personen, LeeftijdType.AOW);
}

function toeslagenPartner(personen: PersoonType[]): boolean {
  return telVolwassenen(personen) > 1;
}

function eenVerdiener(personen: PersoonType[]): boolean {
  return personen.filter((p) => p.bruto_inkomen > 0).length == 0;
}

function aow(personen: PersoonType[]): boolean {
  return telPersonen(personen, LeeftijdType.AOW) > 0;
}

function isHuur(wonen: WonenType): boolean {
  return wonen.woning_type == WoningType.HUUR;
}

function negatiefIsNul(getal: number): number {
  return Math.max(0, getal);
}

function factorBerekening(periode: PeriodeType): number {
  return PeriodeType.MAAND == periode ? 1 / 12 : 1;
}

const TEKST_GETALLEN = {
  1: "een",
  2: "twee",
  3: "drie",
  4: "vier",
  5: "vijf",
  6: "zes",
  7: "zeven",
  8: "acht",
  9: "negen",
}

function tekstGetal(getal: number) : string {
  return TEKST_GETALLEN[getal];
}

function tekstKinderen(personen: PersoonType[], leeftijd: LeeftijdType) {
  const aantal = telPersonen(personen, leeftijd);
  return tekstGetal(aantal) + ' kinderen tussen ' + leeftijd
}

function samenvatting(gegevens: InvoerGegevensType) : string {
  let tekst = '';

  if (toeslagenPartner(gegevens.personen)) {
    if (eenVerdiener(gegevens.personen)) {
      tekst += 'Eenverdiener ';
    } else {
      tekst += 'Meerdere verdieners '
    }
    // 
  } else {
    tekst += 'Alleenstaande ';
  }
  if (gegevens.personen[0].leeftijd == LeeftijdType.AOW) {
    tekst += 'in the AOW '
  }
  let aantalKinderen = telKinderen(gegevens.personen);
  if (aantalKinderen > 0) {
    tekst += 'met ' + aantalKinderen + ' kinderen';
  }
  if (isHuur(gegevens.wonen)) {
    tekst += ', maandelijkse huur &euro ' + gegevens.wonen.huur;
  } else if (gegevens.wonen.woning_type == WoningType.KOOP) {
    tekst += ', maandelijkse hypotheek rente &euro ' + gegevens.wonen.rente
      + " in huis met WOZ-waard: &euro " + gegevens.wonen.woz;
  }
  return tekst; 
}

export default {
  telKinderen,
  telPersonen,
  telVolwassenen,
  toeslagenPartner,
  aow,
  isHuur,
  negatiefIsNul,
  factorBerekening,
  samenvatting,
};
