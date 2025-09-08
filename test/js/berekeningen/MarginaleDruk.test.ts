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
  eenverdiener2kinderenKoop2 as alleenstaande2kinderenKoop2,
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
  const brutoloon: number = 30_000;
  const berekening = bereken(brutoloon, alleenstaande2KinderenHuur("md"), 1000, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: 126,
    ahkMax: -63,
    ak: 24,
    akMax: 24,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 29_206,
    brutoloon: brutoloon,
    extraLoon: 1000,
    hraMax: 0,
    iack: 107,
    iackMax: 107,
    ibBox1: -348,
    kb: 0,
    kgb: -63,
    marginaleDruk: 52.3,
    nettoArbeidsinkomen: 477,
    nettoInkomen: 477,
    nettoLoon: 848,
    nettoLoonBelasting: 91,
    nvzk: 189,
    pensioenPremie: -61,
    toetsingsInkomen: 29_206,
    wonen: -180,
    zt: -128,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 marginale druk eenverdiener 47500, 2 kinderen, huur 674", () => {
  const brutoloon: number = 47_500;
  const berekening = bereken(brutoloon, eenverdiener2KinderenHuur("md"), 1000, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -63,
    ahkMax: -63,
    ak: -61,
    akMax: -61,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 45_633,
    brutoloon: brutoloon,
    extraLoon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -63,
    marginaleDruk: 90.4,
    nettoArbeidsinkomen: 96,
    nettoInkomen: 96,
    nettoLoon: 468,
    nettoLoonBelasting: 471,
    nvzk: 0,
    pensioenPremie: -61,
    toetsingsInkomen: 45_633,
    wonen: -180,
    zt: -129,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 marginale druk meestverdiener 45000, 2 kinderen, huur 674", () => {
  const brutoloon: number = 45_000;
  const gegevens = eenverdiener2KinderenHuur("md");
  gegevens.personen[1].bruto_inkomen = 21969;

  const berekening = bereken(brutoloon, gegevens, 1000, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    anderenArbeidsinkomen: [21969],
    arbeidsinkomen: 43_287,
    brutoloon: brutoloon,
    extraLoon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -64,
    marginaleDruk: 59.6,
    nettoArbeidsinkomen: 404,
    nettoInkomen: 404,
    nettoLoon: 468,
    nettoLoonBelasting: 470,
    nvzk: 0,
    pensioenPremie: -62,
    toetsingsInkomen: 43_287,
    wonen: 0,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 marginale druk 47500 eenverdiener, 2 kinderen, koop", () => {
  const brutoloon: number = 47500;
  const berekening = bereken(brutoloon, eenverdiener2kinderenKoop("md"), 1000, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 45_633,
    brutoloon: brutoloon,
    extraLoon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: 0,
    marginaleDruk:65.9,
    nettoArbeidsinkomen: 341,
    nettoInkomen: 341,
    nettoLoon: 469,
    nettoLoonBelasting: 470,
    nvzk: 0,
    pensioenPremie: -61,
    toetsingsInkomen: 33_253,
    wonen: 0,
    zt: -128,
  };
  expect(berekening).toEqual(expected);
});

test("\n\n" + "-".repeat(80) + "\nBereken 2024 marginale druk 47500 alleenstaande, 2 kinderen, koop", () => {
  const brutoloon: number = 47500;
  const berekening = bereken(brutoloon, alleenstaande2kinderenKoop2("md"), 1000, VisualisatieTypeType.G);
  const expected: MarginaleDrukResultaatType = {
    ahk: 0,
    ahkMax: 0,
    ak: 6.1, // moet 0 zijn want iack extra compenseert ook ak verlies.
    akMax: 6.1, // moet 0 zijn
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 45_633,
    brutoloon: brutoloon,
    extraLoon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: 0,
    kb: 0,
    kgb: 0,
    marginaleDruk: 6.1,
    nettoArbeidsinkomen: 0,
    nettoInkomen: 0,
    nettoLoon: 0,
    nettoLoonBelasting: 0,
    nvzk: 0,
    pensioenPremie: 6.1,
    toetsingsInkomen: 16_485,
    wonen: 0,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 marginale druk 80000 alleenstaande, koop", () => {
  const arbeidsinkomen: number = 80000;
  const berekening = bereken(arbeidsinkomen, alleenstaandeKoop("md"), 939, VisualisatieTypeType.T);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: arbeidsinkomen,
    brutoloon: arbeidsinkomen,
    extraLoon: 939,
    hraMax: 118,
    iack: 0,
    iackMax: 0,
    ibBox1: -465,
    kb: 0,
    kgb: 0,
    marginaleDruk: 50.05,
    nettoArbeidsinkomen: 469,
    nettoInkomen: 469,
    nettoLoon: 469,
    nettoLoonBelasting: 470,
    nvzk: 0,
    pensioenPremie: 0,
    toetsingsInkomen: 67_620,
    wonen: 118,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});
