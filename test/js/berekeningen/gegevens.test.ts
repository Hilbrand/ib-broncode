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
import gegevens from '../../../src/js/berekeningen/gegevens.js'

const personenQuery = "V;V,10000;K612";
const personenJson = [{leeftijd: 'V'}, {leeftijd: 'V', bruto_inkomen:10000}, {leeftijd: 'K612'}];

const queryHuur = { tab: "ib", p: personenQuery, w: "huur;123", grafiek: "jaar;1,2;4"}
const jsonHuur = { tab: "ib", personen: personenJson, wonen: {woning_type:"huur", huur:"123"}, grafiek: { periode: "jaar", van_tot: [1, 2], sv:4}};
const jsonExpectedHuur = { tab: "ib", personen: personenJson, wonen: {woning_type:"huur", huur:123, woz:315000, rente:13482}, grafiek: { periode: "jaar", van_tot: [1, 2], sv:4}};

const queryKoop = { tab: "ib", p: personenQuery, w: "koop;123456;5432", grafiek: "jaar;1,2;4"}
const jsonKoop = { tab: "ib", personen: personenJson, wonen: {woning_type:"huur", huur:"123"}, grafiek: { periode: "jaar", van_tot: [1, 2], sv:4}};
const jsonExpectedKoop = { tab: "ib", personen: personenJson, wonen: {woning_type:"koop", huur:600, woz:123456, rente:5432}, grafiek: { periode: "jaar", van_tot: [1, 2], sv:4}};

test('navigatie naar json, wonen: huur', () => {
  expect(gegevens.navigatieToJson(queryHuur)).toEqual(jsonExpectedHuur)
})

test('navigatie naar json, wonen: koop', () => {
  expect(gegevens.navigatieToJson(queryKoop)).toEqual(jsonExpectedKoop)
})


test('lege navigatie naar json', () => {
  expect(gegevens.navigatieToJson("")).toEqual({
       tab :"intro",
       personen: [ {leeftijd: 'V' }],
       wonen: {
         woning_type: "huur",
         huur: 600,
         woz: 315000,
         rente: 13482,
      },
         grafiek: {
          periode: "jaar",
          van_tot: [10000, 100000],
          sv: 3,
        }
  })
})

test('json naar navigatie', () => {
  expect(gegevens.jsonToNavigatie(jsonHuur)).toEqual(queryHuur)
})
