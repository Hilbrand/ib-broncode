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

import { assert, expect, test } from 'vitest'
import algemeen from '../../../src/js/berekeningen/algemeen.js'
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen";
import { MarginaleDruk } from '../../../src/js/berekeningen/MarginaleDruk.js'

test('Marginale Druk Details ', () => {
  const vis = {jaar: 2023, periode:'jaar', svt: 'p', sv_p: 3};
  const personen = [{leeftijd:'V'}];
  const wonen = {woning_type:'huur', huur:600};
   
  const ai = 27800;
  const md = new MarginaleDruk(vis, personen, wonen, new BeschikbaarInkomen(vis, personen, wonen));
  let mdd = md.bereken(ai);

  let expected = {
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
