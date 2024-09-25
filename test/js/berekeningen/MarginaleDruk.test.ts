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
import { BeschikbaarInkomen } from "../../../src/js/berekeningen/BeschikbaarInkomen.js";
import { MarginaleDruk } from "../../../src/js/berekeningen/MarginaleDruk.js";
import { InvoerGegevensType, MarginaleDrukResultaatType, VisualisatieTypeType } from "../../../src/ts/types.js";
import {
  alleenstaande2KinderenHuur,
  alleenstaandeKoop,
  eenverdiener2KinderenHuur,
  eenverdiener2kinderenKoop,
} from "./invoer";

function bereken(
  arbeidsinkomen: number,
  gegevens: InvoerGegevensType,
  extraLoon: number,
  type: VisualisatieTypeType
): MarginaleDrukResultaatType {
  gegevens.visualisatie.sv_abs = extraLoon;
  const berekenen: MarginaleDruk = new MarginaleDruk(gegevens, new BeschikbaarInkomen(gegevens));

  return berekenen.bereken(arbeidsinkomen, type);
}

test("Bereken 2024 marginale druk alleenstaande 27500, 2 kinderen, huur 674", () => {
  const arbeidsinkomen: number = 29206; /* Brutoloon: 30.000*/
  const berekening = bereken(arbeidsinkomen, alleenstaande2KinderenHuur("bi"), 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: 126,
    ahkMax: -63,
    ak: 24,
    akMax: 24,
    arbeidsinkomen: 29206,
    extraLoon: 939,
    hraMax: 0,
    iack: 107,
    iackMax: 107,
    ibBox1: -348,
    kb: 0,
    kgb: -63,
    marginaleDruk: 49.2,
    nettoArbeidsinkomen: 477,
    nettoInkomen: 477,
    nettoLoon: 848,
    nettoLoonBelasting: 91,
    nvzk: -189,
    wonen: -180,
    zt: -128,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen eenverdiener 47500, 2 kinderen, huur 674", () => {
  const arbeidsinkomen: number = 45633; // Brutoloon: 47500
  const berekening = bereken(arbeidsinkomen, eenverdiener2KinderenHuur("bi"), 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -63,
    ahkMax: -63,
    ak: -61,
    akMax: -61,
    arbeidsinkomen: 45633,
    extraLoon: 939,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -63,
    marginaleDruk: 89.78,
    nettoArbeidsinkomen: 96,
    nettoInkomen: 96,
    nettoLoon: 468,
    nettoLoonBelasting: 471,
    nvzk: 0,
    wonen: -180,
    zt: -129,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen meestverdiener 45000, 2 kinderen, huur 674", () => {
  const arbeidsinkomen: number = 43313; // Brutoloon: 45000
  const gegevens = eenverdiener2KinderenHuur("bi");
  gegevens.personen[1].bruto_inkomen = 21969;

  const berekening = bereken(arbeidsinkomen, gegevens, 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -62,
    akMax: -62,
    arbeidsinkomen: 43313,
    extraLoon: 939,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -64,
    marginaleDruk: 56.98,
    nettoArbeidsinkomen: 404,
    nettoInkomen: 404,
    nettoLoon: 468,
    nettoLoonBelasting: 471,
    nvzk: 0,
    wonen: 0,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 47500 eenverdiener, 2 kinderen, koop", () => {
  const arbeidsinkomen: number = 45633; // Brutoloon: 47500
  const berekening = bereken(arbeidsinkomen, eenverdiener2kinderenKoop("bi"), 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    arbeidsinkomen: 45633,
    extraLoon: 939,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -63,
    marginaleDruk: 70.5,
    nettoArbeidsinkomen: 277,
    nettoInkomen: 277,
    nettoLoon: 469,
    nettoLoonBelasting: 470,
    nvzk: 0,
    wonen: 0,
    zt: -129,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 beschikbaar inkomen 80000 alleenstaande, koop", () => {
  const arbeidsinkomen: number = 80000;
  const berekening = bereken(arbeidsinkomen, alleenstaandeKoop("bi"), 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    arbeidsinkomen: 80000,
    extraLoon: 939,
    hraMax: 118,
    iack: 0,
    iackMax: 0,
    ibBox1: -465,
    kb: 0,
    kgb: 0,
    marginaleDruk: 37.49,
    nettoArbeidsinkomen: 587,
    nettoInkomen: 587,
    nettoLoon: 469,
    nettoLoonBelasting: 470,
    nvzk: 0,
    wonen: 118,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});
