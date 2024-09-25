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

import { LeeftijdType, PeriodeType, PersoonType, WonenType, WoningType } from "./types";

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

export default {
  telKinderen,
  eenVerdiener,
  telPersonen,
  telVolwassenen,
  toeslagenPartner,
  aow,
  isHuur,
  negatiefIsNul,
  factorBerekening,
};
