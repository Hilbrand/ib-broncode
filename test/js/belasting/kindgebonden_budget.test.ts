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
import kgb from '../../../src/js/belasting/kindgebonden_budget.js'

// 2023 getallen

const A1K = [{leeftijd: 'V'}, {leeftijd: 'K611'}];
const A1K_MAX = 3848 + 1653;
const M1K = [{leeftijd: 'V'}, {leeftijd: 'V'}, {leeftijd: 'K611'}];
const M1K_MAX = 1653;
const A3K = [{leeftijd: 'V'}, {leeftijd: 'K611'}, {leeftijd: 'K1215'}, {leeftijd: 'K1617'}];
const A3K_MAX = 3848 + 4717 + 267 + 476;

// Test Max Kindgebonden Budget

test('test max Kindgebonden Budget alleenstaand, 1 kind 12-', () => {
  expect(kgb.maxKindgebondenBudget(A1K, false)).toEqual(A1K_MAX)
})

test('test max Kindgebonden Budget 2 V, 1 kind 12-', () => {
  expect(kgb.maxKindgebondenBudget(M1K, true)).toEqual(M1K_MAX)
})

test('test max Kindgebonden Budget alleenstaand, 1 kind 12-, 1 kind 12-15, 1 kind 16-17', () => {
  expect(kgb.maxKindgebondenBudget(A3K, false)).toEqual(A3K_MAX)
})

// Test Kindgebonden Budget

test('test Kindgebonden Budget 10.000, alleenstaand, 1 kind 12-', () => {
  expect(kgb.kindgebondenBudget(10000, kgb.maxKindgebondenBudget(A1K, false), false)).toEqual(A1K_MAX)
})
  
test('test Kindgebonden Budget 40.000, alleenstaand, 1 kind 12-', () => {
  expect(kgb.kindgebondenBudget(40000, kgb.maxKindgebondenBudget(A1K, false), false)).toEqual(A1K_MAX - 1007)
})

test('test Kindgebonden Budget 10.000, 2 V, 1 kind 12-', () => {
  expect(kgb.kindgebondenBudget(10000, kgb.maxKindgebondenBudget(M1K, true), true)).toEqual(M1K_MAX)
})
    
test('test Kindgebonden Budget 50.000, 2 V, 1 kind 12-', () => {
  expect(kgb.kindgebondenBudget(50000, kgb.maxKindgebondenBudget(M1K, true), true)).toEqual(M1K_MAX - 445)
})

test('test Kindgebonden Budget 50.000, 2 V, 1 kind 12-', () => {
  expect(kgb.kindgebondenBudget(50000, kgb.maxKindgebondenBudget(M1K, true), true)).toEqual(M1K_MAX - 445)
})
  
test('test Kindgebonden Budget 10.000, alleenstaand, 1 kind 12-, 1 kind 12-15, 1 kind 16-17', () => {
    expect(kgb.kindgebondenBudget(10000, kgb.maxKindgebondenBudget(A3K, false), false)).toEqual(A3K_MAX)
})

test('test Kindgebonden Budget 40.000, alleenstaand, 1 kind 12-, 1 kind 12-15, 1 kind 16-17', () => {
  expect(kgb.kindgebondenBudget(40000, kgb.maxKindgebondenBudget(A3K, false), false)).toEqual(A3K_MAX - 1007)
})

// const M2K = [{leeftijd: 'Volwassene'}, {leeftijd: 'Volwassene'}, {leeftijd: '12-'}, {leeftijd: '12-'}];

// test('test Kindgebonden Budget 46377, 2 V, 1 kind 12-', () => {
//   expect(kgb.kindgebondenBudget(46377, kgb.maxKindgebondenBudget(M2K, true), true)).toEqual(M1K_MAX - 445)
//})
