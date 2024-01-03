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

import { expect, test } from "vitest";
import zt from "../../../src/js/belasting/zorgtoeslag";

const JAAR: number = 2023;

// Zorgtoeslag alleenstaande

test("Zorgtoeslag alleen 40.000", () => {
  expect(zt.zorgtoeslag(JAAR, 40000, false)).toEqual(0);
});

test("Zorgtoeslag alleen 19.000", () => {
  expect(zt.zorgtoeslag(JAAR, 19000, false)).toEqual(1858);
});

// Zorgtoeslag met toeslagpartner

test("Zorgtoeslag samen 50.000", () => {
  expect(zt.zorgtoeslag(JAAR, 50000, true)).toEqual(0);
});

test("Zorgtoeslag samen 40.000", () => {
  expect(zt.zorgtoeslag(JAAR, 40000, true)).toEqual(1145);
});

test("Zorgtoeslag samen 20.000", () => {
  expect(zt.zorgtoeslag(JAAR, 20000, true)).toEqual(3181);
});
