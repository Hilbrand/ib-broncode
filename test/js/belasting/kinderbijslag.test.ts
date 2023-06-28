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
import kbs from '../../../src/js/belasting/kinderbijslag.js'

const A3K = [{leeftijd: 'V'}, {leeftijd: 'K05'}, {leeftijd: 'K611'}, {leeftijd: 'K1215'}, {leeftijd: 'K1617'}];

// Test Kinderbijslag

test('test Kinderbijslag, 4 kinderen', () => {
  expect(kbs.kinderbijslag(A3K)).toEqual(Math.floor(4 * (261.70 + 317.77 + 373.85 * 2)))
})
