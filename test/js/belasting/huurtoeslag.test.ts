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
import ht from '../../../src/js/belasting/huurtoeslag'

const JAAR = 2023;

test('Huurtoeslag alleen 14.500, rekenhuur 355', () => {
  expect(ht.huurtoeslag(JAAR, 14500, 355, 1, false)).toEqual(12 * 129)
})

test('Huurtoeslag alleen 27038, rekenhuur 639', () => {
  expect(ht.huurtoeslag(JAAR, 27038, 639, 3, false)).toEqual(12 * 318)
})

test('Huurtoeslag alleen 14.500, rekenhuur 355', () => {
  expect(ht.huurtoeslag(JAAR, 14500, 355, 1, true)).toEqual(12 * 131)
})

test('Huurtoeslag alleen 27038, rekenhuur 639', () => {
  expect(ht.huurtoeslag(JAAR, 27038, 639, 3, true)).toEqual(12 * 351)
})

test('Huurtoeslag alleen 10.000', () => {
  expect(ht.huurtoeslagMax(JAAR, 10000)).toEqual(12 * 417)
})

test('Huurtoeslag alleen 34.000', () => {
  expect(ht.huurtoeslagMax(JAAR, 34000)).toEqual(12 * 74)
})

test('Huurtoeslag alleen 100.000', () => {
  expect(ht.huurtoeslagMax(JAAR, 100000)).toEqual(0)
})
