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
import { LeeftijdType, PersoonType } from "../../../src/ts/types";
import iack from "../../../src/js/belasting/inkomensafhankelijkecombinatiekorting";

const JAAR: string = "2023";
const INKOMEN: number = 20000;
const ENKELE_PERSOON: PersoonType[] = [{ leeftijd: LeeftijdType.V }];

// Bepaal Laagste Arbeidsinkomen Inkomen Anderen

test("Laagste Arbeidsinkomen Inkomen, alleenstaande", () => {
  expect(iack.bepaalLaagsteArbeidsInkomenAnderen([])).toEqual(Number.MAX_VALUE);
});

test("Laagste Arbeidsinkomen Inkomen, inkomen 1000", () => {
  expect(iack.bepaalLaagsteArbeidsInkomenAnderen([1000])).toEqual(1000);
});

// Test Inkomensafhankelijke Combinatiekorting

test("Inkomensafhankelijke Combinatiekorting 5.000", () => {
  expect(iack.inkomensafhankelijkeCombinatiekorting(JAAR, 5000, [])).toEqual(0);
});

test("Inkomensafhankelijke Combinatiekorting 20.000", () => {
  expect(iack.inkomensafhankelijkeCombinatiekorting(JAAR, 20000, [])).toEqual(1655);
});

test("Inkomensafhankelijke Combinatiekorting 50.000", () => {
  expect(iack.inkomensafhankelijkeCombinatiekorting(JAAR, 50000, [])).toEqual(2694);
});
