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

import { expect, test } from "vitest";
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen";
import {
  BeschikbaarInkomenResultaatType,
  GrafiekType,
  LeeftijdType,
  PeriodeType,
  PersoonType,
  WonenType,
  WoningType,
} from "../../../src/types";

const vis: GrafiekType = { jaar: "2024", periode: PeriodeType.JAAR };
const personen: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.K611 },
  { leeftijd: LeeftijdType.K611 },
];
const huur: WonenType = { woning_type: WoningType.HUUR, huur: 1100 };
const koop: WonenType = {
  woning_type: WoningType.KOOP,
  rente: 13482,
  woz: 315000,
};

test("Bereken beschikbaar inkomen eenverdiener, 2 kinderen, huur", () => {
  const arbeidsinkomen: number = 46377;
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(vis, personen, huur);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen);

  let expected: BeschikbaarInkomenResultaatType = {
    algemeneHeffingsKorting: 1932,
    arbeidsinkomen: arbeidsinkomen,
    arbeidskorting: 5114,
    ibBox1: 17146,
    beschikbaarInkomen: 43334,
    brutoInkomstenBelasting: 17146,
    inkomensafhankelijkeCombinatiekorting: 0,
    kinderbijslag: 2736,
    kindgebondenBudget: 4162,
    netto: 29231,
    wonen: 0,
    zorgtoeslag: 159,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken beschikbaar inkomen 10000 eenverdiener, 2 kinderen, koop", () => {
  const arbeidsinkomen: number = 10000;
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(vis, personen, koop);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen);

  let expected: BeschikbaarInkomenResultaatType = {
    algemeneHeffingsKorting: 3362,
    arbeidsinkomen: arbeidsinkomen,
    arbeidskorting: 335,
    ibBox1: 0,
    beschikbaarInkomen: 20441,
    brutoInkomstenBelasting: 3697,
    inkomensafhankelijkeCombinatiekorting: 0,
    kinderbijslag: 2736,
    kindgebondenBudget: 4872,
    netto: 6303,
    wonen: 0,
    zorgtoeslag: 2833,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken beschikbaar inkomen 30000 eenverdiener, koop", () => {
  const arbeidsinkomen: number = 30000;
  const eenverdiener: PersoonType[] = [{ leeftijd: LeeftijdType.V }];
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(vis, eenverdiener, koop);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen);

  let expected: BeschikbaarInkomenResultaatType = {
    algemeneHeffingsKorting: 3362,
    arbeidsinkomen: arbeidsinkomen,
    arbeidskorting: 5286,
    ibBox1: 6514,
    beschikbaarInkomen: 31048,
    brutoInkomstenBelasting: 11091,
    inkomensafhankelijkeCombinatiekorting: 0,
    kinderbijslag: 0,
    kindgebondenBudget: 0,
    netto: 18909,
    wonen: 2443,
    zorgtoeslag: 1048,
  };

  expect(berekening).toEqual(expected);
});
