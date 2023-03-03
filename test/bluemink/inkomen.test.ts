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
import inkomen from '../../src/bluemink/inkomen.js'

// test algemeneHeffingsKorting

test('Algemene Heffings Korting 1.000', () => {
  expect(inkomen.algemeneHeffingsKorting(1000, 10000, false)).toEqual(2000)
})

test('Algemene Heffings Korting 10.000', () => {
  expect(inkomen.algemeneHeffingsKorting(10000, 10000, false)).toEqual(2000)
})

test('Algemene Heffings Korting 40.000', () => {
  expect(inkomen.algemeneHeffingsKorting(40000, 10000, false)).toEqual(2000)
})

test('Algemene Heffings Korting 100.000', () => {
  expect(inkomen.algemeneHeffingsKorting(100000, 10000, false)).toEqual(2000)
})

// test arbeidskorting

test('Arbeidskorting 1.000', () => {
  expect(inkomen.arbeidskorting(1000, 10000, false)).toEqual(0)
})

test('Arbeidskorting 15.000', () => {
  expect(inkomen.arbeidskorting(15000, 10000, false)).toEqual(1230)
})

test('Arbeidskorting 30.000', () => {
  expect(inkomen.arbeidskorting(26000, 10000, false)).toEqual(2880)
})

test('Arbeidskorting 60.000', () => {
  expect(inkomen.arbeidskorting(27000, 10000, false)).toEqual(3000)
})
