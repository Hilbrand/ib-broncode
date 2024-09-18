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
import { LeeftijdType, PersoonType } from "../../../src/types";
import kbs from "../../../src/js/belasting/kinderbijslag";

const JAAR: string = "2023";
const A3K: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.K05 },
  { leeftijd: LeeftijdType.K611 },
  { leeftijd: LeeftijdType.K1215 },
  { leeftijd: LeeftijdType.K1617 },
];

// Test Kinderbijslag

test("test Kinderbijslag, 4 kinderen", () => {
  expect(kbs.kinderbijslag(JAAR, A3K)).toEqual(Math.floor(4 * (261.7 + 317.77 + 373.85 * 2)));
});
