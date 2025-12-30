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

import { assert, expect, test } from "vitest";
import ht from "../../../src/js/belasting/huurtoeslag";

const JAAR: string = "2023";
const JAAR_2026: string = "2026";

test("Huurtoeslag alleen 14.500, rekenhuur 355", () => {
  expect(ht.huurtoeslag(JAAR, 14500, 355, 1, false)).toEqual(12 * 129);
});

test("Huurtoeslag 3 personen 27038, rekenhuur 639", () => {
  expect(ht.huurtoeslag(JAAR, 27038, 639, 3, false)).toEqual(12 * 318);
});

test("Huurtoeslag alleen 14.500, rekenhuur 355", () => {
  expect(ht.huurtoeslag(JAAR, 14500, 355, 1, true)).toEqual(12 * 131);
});

test("Huurtoeslag 3 personen 27038, rekenhuur 639", () => {
  expect(ht.huurtoeslag(JAAR, 27038, 639, 3, true)).toEqual(12 * 351);
});

test("Huurtoeslag 3 personen 27038, rekenhuur 1050", () => {
  expect(ht.huurtoeslag(JAAR, 27038, 1050, 3, true)).toEqual(0);
});

test("Huurtoeslag 2026, 3 personen, aow, 27038, rekenhuur 639", () => {
  expect(ht.huurtoeslag(JAAR_2026, 27038, 639, 3, true)).toEqual(12 * 389);
});

test("Huurtoeslag 2026, 3 personen 27038, rekenhuur 1050", () => {
  expect(ht.huurtoeslag(JAAR_2026, 27038, 1050, 3, true)).toEqual(12 * 537);
});

test("Huurtoeslag 2026, aow, alleen 40_000, rekenhuur 1250", () => {
  expect(ht.huurtoeslag(JAAR_2026, 40_000, 1250, 1, true)).toEqual(12 * 150);
});

test("Huurtoeslag 2026, aow, alleen 50_000, rekenhuur 1250", () => {
  expect(ht.huurtoeslag(JAAR_2026, 50_000, 1250, 1, true)).toEqual(0);
});

// huurtoeslagMax

test("Max Huurtoeslag 10.000", () => {
  expect(ht.huurtoeslagMax(JAAR, 10000)).toEqual(12 * 417);
});

test("Max Huurtoeslag 34.000", () => {
  expect(ht.huurtoeslagMax(JAAR, 34000)).toEqual(12 * 74);
});

test("MaX Huurtoeslag 100.000", () => {
  expect(ht.huurtoeslagMax(JAAR, 100000)).toEqual(0);
});
