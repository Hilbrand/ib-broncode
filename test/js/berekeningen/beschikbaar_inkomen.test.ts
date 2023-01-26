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
import { BeschikbaarInkomen } from '../../../src/js/berekeningen/BeschikbaarInkomen.js'

const vis = {periode:'jaar'};
const personen = [{leeftijd:'V'}, {leeftijd:'V', inkomen:0}, {leeftijd:'K611'}, {leeftijd:'K611'}];
const wonen = {woning_type:'huur', huur:1100};
const algemeneGegevens = algemeen.berekenAlgemeneGegevens(vis, personen, wonen);
const arbeidsinkomen = 46377;
const bekenen = new BeschikbaarInkomen(vis, personen, wonen);
const berekening = bekenen.bereken(arbeidsinkomen);

test('Bereken beschikbaar inkomen eenverdiener, 2 kinderen', () => {
  let expected = {
    arbeidsinkomen: arbeidsinkomen,
    brutoInkomstenBelasting: 17127,
    netto: 29250,
    algemeneHeffingsKorting: 1624,
    arbeidskorting: 4486,
    zorgtoeslag: 275,
    wonen: 0,
    kinderbijslag: 2620,
    kindgebondenBudget: 2984,
    inkomensafhankelijkeCombinatiekorting: 0,
    beschikbaarInkomen: 38255,
  };

  expect(berekening).toEqual(expected);
})