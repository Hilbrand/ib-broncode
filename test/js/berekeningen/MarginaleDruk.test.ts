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

import { expect, test } from 'vitest'
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen.js";
import { MarginaleDruk } from '../../../src/js/berekeningen/MarginaleDruk.js'
import { GrafiekType, LeeftijdType, MarginaleDrukResultaatType, PeriodeType, PersoonType, WonenType, WoningType } from "../../../src/types";

test('Marginale Druk Details ', () => {
  const vis: GrafiekType = {jaar:2023, periode:PeriodeType.JAAR, svt: 'p', sv_p: 3};
  const personen: PersoonType[] = [{leeftijd:LeeftijdType.V}];
  const wonen: WonenType = {woning_type:WoningType.HUUR, huur:600};
  const ai: number = 27800;
  const md:MarginaleDruk = new MarginaleDruk(vis, personen, wonen, new BeschikbaarInkomen(vis, personen, wonen));
  let mdd: MarginaleDrukResultaatType = md.bereken(ai);

  let expected: MarginaleDrukResultaatType = {
    arbeidsinkomen: ai * 0.03,
    nettoInkomensBelasting: 33.81,
    algemeneHeffingsKorting: 6.12,
    arbeidskorting: 0,
    zorgtoeslag: 13.55,
    wonen: 31.65,
    kinderbijslag: 0,
    kindgebondenBudget: 0,
    inkomensafhankelijkeCombinatiekorting: 0,
    marginaleDruk: 85.13,
  };

  expect(mdd).toEqual(expected);
  expect(mdd.nettoInkomensBelasting + mdd.algemeneHeffingsKorting + mdd.arbeidskorting + mdd.zorgtoeslag 
    + mdd.wonen + mdd.kinderbijslag + mdd.kindgebondenBudget + mdd.inkomensafhankelijkeCombinatiekorting)
    .toEqual(mdd.marginaleDruk);
})
