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
import {
  BeschikbaarInkomenResultaatType,
  InkomenType,
  InvoerGegevensType,
  LeeftijdType,
  VisualisatieTypeType,
} from "../../../src/ts/types";
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
  const brutoloon: number = 27_500;
  const berekening = bereken(brutoloon, alleenstaande2KinderenHuur("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 2342,
    ahkMax: 3226,
    ak: 5208,
    akMax: 5208,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 26_860,
    brutoloon: brutoloon,
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
    pensioenPremie: 640,
    wonen: 4896,
    zt: 1477,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen eenverdiener 47500, 2 kinderen, huur 674", () => {
  const brutoloon: number = 47_500;
  const berekening = bereken(brutoloon, eenverdiener2KinderenHuur("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 1982,
    ahkMax: 1982,
    ak: 5162,
    akMax: 5162,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 45_633,
    brutoloon: brutoloon,
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
    pensioenPremie: 1867,
    wonen: 936,
    zt: 261,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 47500 eenverdiener, 2 kinderen, koop", () => {
  const brutoloon: number = 47_500;
  const berekening = bereken(brutoloon, eenverdiener2kinderenKoop("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 2802,
    ahkMax: 2802,
    ak: 5162,
    akMax: 5162,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 45_633,
    brutoloon: brutoloon,
    hraMax: 4577,
    iack: 0,
    iackMax: 0,
    ibBox1: 16871,
    kb: 2736,
    kgb: 4872,
    nettoArbeidsinkomen: 28762,
    nettoInkomen: 48128,
    nettoLoon: 41303,
    nettoLoonBelasting: 4330,
    nvzk: 0,
    pensioenPremie: 1867,
    wonen: 4577,
    zt: 1953,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 80000 alleenstaande, koop", () => {
  const brutoloon: number = 80_000;
  const berekening = bereken(brutoloon, alleenstaandeKoop("bi"), VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 524,
    ahkMax: 524,
    ak: 2925,
    akMax: 2925,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: brutoloon,
    brutoloon: brutoloon,
    hraMax: 5139,
    iack: 0,
    iackMax: 0,
    ibBox1: 30138,
    kb: 0,
    kgb: 0,
    nettoArbeidsinkomen: 49862,
    nettoInkomen: 58450,
    nettoLoon: 58450,
    nettoLoonBelasting: 21550,
    nvzk: 0,
    pensioenPremie: 0,
    wonen: 5139,
    zt: 0,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 10000 minstverdiener, huur", () => {
  const brutoloon: number = 10_000;
  const gegevens = alleenstaande2KinderenHuur("bi");
  gegevens.personen.push({ leeftijd: LeeftijdType.V, inkomen_type: InkomenType.PERCENTAGE, percentage: 200 });
  const berekening = bereken(brutoloon, gegevens, VisualisatieTypeType.T);
  const expected: BeschikbaarInkomenResultaatType = {
    ahk: 2383,
    ahkMax: 3362,
    ak: 806,
    akMax: 806,
    anderenArbeidsinkomen: [20000],
    arbeidsinkomen: 9771,
    brutoloon: brutoloon,
    hraMax: 0,
    iack: 423,
    iackMax: 423,
    ibBox1: 3612,
    kb: 2736,
    kgb: 4872,
    nettoArbeidsinkomen: 6159,
    nettoInkomen: 21440,
    nettoLoon: 9771,
    nettoLoonBelasting: 0,
    nvzk: 979,
    pensioenPremie: 229,
    wonen: 4368,
    zt: 2429,
  };

  expect(berekening).toEqual(expected);
});
