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

export function isVolwassene(persoon: PersoonType): boolean {
  return persoon.leeftijd == LeeftijdType.V || persoon.leeftijd == LeeftijdType.AOW;
}

export function heeftInkomen(persoon: PersoonType): boolean {
  return (
    isVolwassene(persoon) &&
    ((persoon.bruto_inkomen && persoon.bruto_inkomen > 0) || (persoon.percentage && persoon.percentage > 0))
  );
}

export function telPersonen(personen: PersoonType[], controleLeeftijd: LeeftijdType) {
  return personen.filter((p) => p.leeftijd == controleLeeftijd).length;
}

export function telVolwassenen(personen: PersoonType[]): number {
  return telPersonen(personen, LeeftijdType.V) + telPersonen(personen, LeeftijdType.AOW);
}

export function telKinderen(personen: PersoonType[]): number {
  return personen.length - telVolwassenen(personen);
}

export function toeslagenPartner(personen: PersoonType[]): boolean {
  return telVolwassenen(personen) > 1;
}

export function eenVerdiener(personen: PersoonType[]): boolean {
  return personen.filter(heeftInkomen).length == 0;
}

export function aow(personen: PersoonType[]): boolean {
  return telPersonen(personen, LeeftijdType.AOW) > 0;
}

export function isHuur(wonen: WonenType): boolean {
  return wonen.woning_type == WoningType.HUUR;
}

export function negatiefIsNul(getal: number): number {
  return Math.max(0, getal);
}

export function positiefIsNul(getal: number): number {
  return Math.min(0, getal);
}

export function factorBerekening(periode: PeriodeType): number {
  return PeriodeType.MAAND == periode ? 1 / 12 : 1;
}

export default {
  aow,
  factorBerekening,
  isHuur,
  isVolwassene,
  eenVerdiener,
  heeftInkomen,
  negatiefIsNul,
  positiefIsNul,
  telKinderen,
  telPersonen,
  telVolwassenen,
  toeslagenPartner,
};
