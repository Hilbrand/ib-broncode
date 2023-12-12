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
import inkomen from "../../../src/js/belasting/inkomen"

const JAAR: number = 2023;

// test algemeneHeffingsKorting

test('Algemene Heffings Korting 1.000', () => {
  expect(inkomen.algemeneHeffingsKorting(JAAR, 1000, 10000, false)).toEqual(3070)
  expect(inkomen.algemeneHeffingsKorting(JAAR, 1000, 10000, true)).toEqual(1583)
})

test('Algemene Heffings Korting 10.000', () => {
  expect(inkomen.algemeneHeffingsKorting(JAAR, 10000, 10000, false)).toEqual(3070)
  expect(inkomen.algemeneHeffingsKorting(JAAR, 10000, 10000, true)).toEqual(1583)
})

test('Algemene Heffings Korting 40.000', () => {
  expect(inkomen.algemeneHeffingsKorting(JAAR, 40000, 10000, false)).toEqual(2013)
  expect(inkomen.algemeneHeffingsKorting(JAAR, 40000, 10000, true)).toEqual(1038)
})

test('Algemene Heffings Korting 100.000', () => {
  expect(inkomen.algemeneHeffingsKorting(JAAR, 100000, 10000, false)).toEqual(0)
  expect(inkomen.algemeneHeffingsKorting(JAAR, 100000, 10000, true)).toEqual(0)
})

// test arbeidskorting

test('Arbeidskorting 1.000', () => {
  expect(inkomen.arbeidskorting(JAAR, 1000, 10000, false)).toEqual(82)
  expect(inkomen.arbeidskorting(JAAR, 1000, 10000, true)).toEqual(42)
})

test('Arbeidskorting 15.000', () => {
  expect(inkomen.arbeidskorting(JAAR, 15000, 10000, false)).toEqual(2156)
  expect(inkomen.arbeidskorting(JAAR, 15000, 10000, true)).toEqual(1115)
})

test('Arbeidskorting 30.000', () => {
  expect(inkomen.arbeidskorting(JAAR, 30000, 10000, false)).toEqual(4815)
  expect(inkomen.arbeidskorting(JAAR, 30000, 10000, true)).toEqual(2482)
})

test('Arbeidskorting 60.000', () => {
  expect(inkomen.arbeidskorting(JAAR, 60000, 10000, false)).toEqual(3600)
  expect(inkomen.arbeidskorting(JAAR, 60000, 10000, true)).toEqual(1855)
})

// test inkomstenBelasting

test('Belasting 10.000', () => {
  expect(inkomen.inkomstenBelasting(JAAR, 10000, false)).toEqual(3693)
  expect(inkomen.inkomstenBelasting(JAAR, 10000, true)).toEqual(1903)
})

test('Belasting 100.000', () => {
  expect(inkomen.inkomstenBelasting(JAAR, 100000, false)).toEqual(40320)
  expect(inkomen.inkomstenBelasting(JAAR, 100000, true)).toEqual(33392)
})

test('Belasting 40.021', () => {
  expect(inkomen.inkomstenBelasting(2024, 40021, true)).toEqual(Math.round(7632.1837))
})

// test netto

test('Netto 10.000', () => {
  expect(inkomen.netto(JAAR, 10000)).toEqual(6307)
})


test('',() => {
  expect(inkomen.toeslagenToetsInkomen(100, [{bruto_inkomen: 200}, {}])).toEqual(300);
})

// test('Netto 25.000', () => {
//   expect(inkomen.inkomstenBelastingAangepast(25000)).toEqual(25000)
// })


// test('Netto 35.000', () => {
//   expect(inkomen.inkomstenBelastingAangepast(35000)).toEqual(35000)
// })

// test('algemeneHeffingsKorting verschil', () => {
//     expect(inkomen.algemeneHeffingsKorting(35000) - inkomen.algemeneHeffingsKorting(25000)).toEqual(308)
//   })
