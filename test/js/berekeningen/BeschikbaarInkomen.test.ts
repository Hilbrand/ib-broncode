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

import { expect, test } from "vitest"
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen"
import { BeschikbaarInkomenResultaatType, GrafiekType, LeeftijdType, PeriodeType, PersoonType, WonenType, WoningType } from "../../../src/types";

const vis: GrafiekType = {jaar:2023, periode:PeriodeType.JAAR};
const personen: PersoonType[] = [{leeftijd:LeeftijdType.V}, {leeftijd:LeeftijdType.V}, {leeftijd:LeeftijdType.K611}, {leeftijd:LeeftijdType.K611}];
const wonen: WonenType = {woning_type:WoningType.HUUR, huur:1100};
const arbeidsinkomen: number = 46377;
const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(vis, personen, wonen);
const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen);

test('Bereken beschikbaar inkomen eenverdiener, 2 kinderen', () => {
  let expected: BeschikbaarInkomenResultaatType = {
    arbeidsinkomen: arbeidsinkomen,
    brutoInkomstenBelasting: 17127,
    netto: 29250,
    algemeneHeffingsKorting: 1624,
    arbeidskorting: 4486,
    zorgtoeslag: 275,
    wonen: 0,
    kinderbijslag: 2542,
    kindgebondenBudget: 2984,
    inkomensafhankelijkeCombinatiekorting: 0,
    beschikbaarInkomen: 41161,
  };

  expect(berekening).toEqual(expected);
})