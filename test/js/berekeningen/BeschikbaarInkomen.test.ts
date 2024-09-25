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
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen";
import { BeschikbaarInkomenResultaatType, InvoerGegevensType, VisualisatieTypeType } from "../../../src/ts/types";
import {
  alleenstaande2KinderenHuur,
  alleenstaandeKoop,
  eenverdiener2KinderenHuur,
  eenverdiener2kinderenKoop,
} from "./invoer";

function bereken(
  arbeidsinkomen: number,
  gegevens: InvoerGegevensType,
  type: VisualisatieTypeType
): BeschikbaarInkomenResultaatType {
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(gegevens);

  return berekenen.bereken(arbeidsinkomen, type);
}

test("Bereken 2024 beschikbaar inkomen alleenstaande 27500, 2 kinderen, huur 674", () => {
  const arbeidsinkomen: number = 26860; /* Brutoloon: 27500*/
  const berekening = bereken(arbeidsinkomen, alleenstaande2KinderenHuur("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 2342,
    ahkMax: 3226,
    ak: 5208,
    akMax: 5208,
    arbeidsinkomen: arbeidsinkomen,
    hraMax: 0,
    iack: 2380,
    iackMax: 2380,
    ibBox1: 9930,
    kb: 2736,
    kgb: 8350,
    nettoArbeidsinkomen: 16930,
    nettoInkomen: 41583,
    nettoLoon: 26860,
    nettoLoonBelasting: 0,
    nvzk: 884,
    wonen: 4896,
    zt: 1477,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen eenverdiener 47500, 2 kinderen, huur 674", () => {
  const arbeidsinkomen: number = 45633; // Brutoloon: 47500
  const berekening = bereken(arbeidsinkomen, eenverdiener2KinderenHuur("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 1982,
    ahkMax: 1982,
    ak: 5162,
    akMax: 5162,
    arbeidsinkomen: arbeidsinkomen,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: 16871,
    kb: 2736,
    kgb: 4212,
    nettoArbeidsinkomen: 28762,
    nettoInkomen: 41315,
    nettoLoon: 35906,
    nettoLoonBelasting: 9727,
    nvzk: 0,
    wonen: 936,
    zt: 261,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 47500 eenverdiener, 2 kinderen, koop", () => {
  const arbeidsinkomen: number = 45633; // Brutoloon: 47500
  const berekening = bereken(arbeidsinkomen, eenverdiener2kinderenKoop("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 2802,
    ahkMax: 2802,
    ak: 5162,
    akMax: 5162,
    arbeidsinkomen: arbeidsinkomen,
    hraMax: 4577,
    iack: 0,
    iackMax: 0,
    ibBox1: 16871,
    kb: 2736,
    kgb: 4212,
    nettoArbeidsinkomen: 28762,
    nettoInkomen: 50353,
    nettoLoon: 41303,
    nettoLoonBelasting: 4330,
    nvzk: 0,
    wonen: 4577,
    zt: 261,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 80000 alleenstaande, koop", () => {
  const arbeidsinkomen: number = 80000;
  const berekening = bereken(arbeidsinkomen, alleenstaandeKoop("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 524,
    ahkMax: 524,
    ak: 2925,
    akMax: 2925,
    arbeidsinkomen: arbeidsinkomen,
    hraMax: 5139,
    iack: 0,
    iackMax: 0,
    ibBox1: 30138,
    kb: 0,
    kgb: 0,
    nettoArbeidsinkomen: 49862,
    nettoInkomen: 63589,
    nettoLoon: 58450,
    nettoLoonBelasting: 21550,
    nvzk: 0,
    wonen: 5139,
    zt: 0,
  };

  expect(berekening).toEqual(expected);
});
