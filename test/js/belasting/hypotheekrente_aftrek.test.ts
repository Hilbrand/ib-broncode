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
import ha from '../../../src/js/belasting/hypotheekrente_aftrek.js'

const JAAR = 2023;

// (400 - 1050) * 83.33
test('Hypotheek kleine schuld is optelling', () => {
  expect(ha.hypotheekRenteAftrek(JAAR, 400, 300000)).toEqual(541)
})

// 4000 - 1050 = 2950
test('Hypotheek schuld', () => {
  expect(ha.hypotheekRenteAftrek(JAAR, 4000, 300000)).toEqual(-2950)
})

// 50.000 - (4200 + (3.000.000 - 1.200.000) * 2.35%)
test('Hypotheek schuld duur huis', () => {
  expect(ha.hypotheekRenteAftrek(JAAR, 50000, 3000000)).toEqual(-3500)
})

// test('Hypotheek schuld', () => {
//   expect(ha.hypotheekRenteAftrek(13842, 315000)).toEqual(-2950)
// })
