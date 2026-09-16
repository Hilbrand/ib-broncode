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
import { MarginaleDruk } from "../../../src/ts/berekeningen/MarginaleDruk.js";
import {
  InvoerGegevensType,
  MarginaleDrukResultaatType,
  SalarisVerhogingType,
  VisualisatieTypeType,
  WoningType,
} from "../../../src/ts/types.js";
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
  brutoloon: number,
  type: VisualisatieTypeType,
  nettoZonderKinderbijslag: boolean
): MarginaleDrukResultaatType {
  gegevens.visualisatie.svt = SalarisVerhogingType.A;
  gegevens.visualisatie.sv_abs = brutoloon;
  gegevens.visualisatie.type = type;
  const berekenen: MarginaleDruk = new MarginaleDruk(gegevens);

  return berekenen.bereken(arbeidsinkomen, nettoZonderKinderbijslag);
}

test("Bereken 2024 marginale druk alleenstaande 27500, 2 kinderen, huur 674", () => {
  const brutoloon: number = 30_000;
  const berekening = bereken(brutoloon, alleenstaande2KinderenHuur("md"), 1000, VisualisatieTypeType.T, true);
  const expected: MarginaleDrukResultaatType = {
    ahk: 126,
    ahkMax: -63,
    ak: 24,
    akMax: 24,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 939,
    arbeidsinkomen1: 29_206,
    brutoloon1: brutoloon,
    brutoloon: 1000,
    hraMax: 0,
    iack: 107,
    iackMax: 107,
    ibBox1: -348,
    kb: 0,
    kgb: -63,
    marginaleDruk: 52.3,
    nettoArbeidsinkomen: 477,
    nettoInkomen: 477,
    nettoloon: 848,
    nettoloonBelasting: -91,
    nettoloonBelastingGrafiek: -91,
    nvzk: 189,
    pensioenPremie: -61,
    toetsingsInkomen: 939,
    toetsingsInkomen1: 29_206,
    wonen: -180,
    woningType: WoningType.HUUR,
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
    arbeidsinkomen: 939,
    arbeidsinkomen1: 45_633,
    brutoloon1: brutoloon,
    brutoloon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -63,
    marginaleDruk: 90.4,
    nettoArbeidsinkomen: 96,
    nettoInkomen: 96,
    nettoloon: 468,
    nettoloonBelasting: -471,
    nettoloonBelastingGrafiek: -347,
    nvzk: 0,
    pensioenPremie: -61,
    toetsingsInkomen: 939,
    toetsingsInkomen1: 45_633,
    wonen: -180,
    woningType: WoningType.HUUR,
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
    arbeidsinkomen: 938,
    arbeidsinkomen1: 43_287,
    brutoloon1: brutoloon,
    brutoloon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: -64,
    marginaleDruk: 59.6,
    nettoArbeidsinkomen: 404,
    nettoInkomen: 404,
    nettoloon: 468,
    nettoloonBelasting: -470,
    nettoloonBelastingGrafiek: -347,
    nvzk: 0,
    pensioenPremie: -62,
    toetsingsInkomen: 938,
    toetsingsInkomen1: 43_287,
    wonen: 0,
    woningType: WoningType.HUUR,
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
    arbeidsinkomen: 939,
    arbeidsinkomen1: 45_633,
    brutoloon1: brutoloon,
    brutoloon: 1000,
    hraMax: 0,
    iack: 0,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: 0,
    marginaleDruk: 65.9,
    nettoArbeidsinkomen: 341,
    nettoInkomen: 341,
    nettoloon: 469,
    nettoloonBelasting: -470,
    nettoloonBelastingGrafiek: -347,
    nvzk: 0,
    pensioenPremie: -61,
    toetsingsInkomen: 939,
    toetsingsInkomen1: 33_253,
    wonen: 0,
    woningType: WoningType.KOOP,
    zt: -128,
  };
  expect(berekening).toEqual(expected);
});

test("\n\n" + "-".repeat(80) + "\nBereken 2024 marginale druk 47500 alleenstaande, 2 kinderen, koop", () => {
  const brutoloon: number = 47500;
  const berekening = bereken(brutoloon, alleenstaande2kinderenKoop2("md"), 1000, VisualisatieTypeType.G, false);
  const expected: MarginaleDrukResultaatType = {
    ahk: 0,
    ahkMax: 0,
    ak: -61, // moet 0 zijn want iack extra compenseert ook ak verlies.
    akMax: -61, // moet 0 zijn
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 939,
    arbeidsinkomen1: 45_633,
    brutoloon1: brutoloon,
    brutoloon: 1000,
    hraMax: 0,
    iack: 408,
    iackMax: 0,
    ibBox1: -347,
    kb: 0,
    kgb: 0,
    marginaleDruk: 6.1,
    nettoArbeidsinkomen: 939,
    nettoInkomen: 939,
    nettoloon: 939,
    nettoloonBelasting: 0,
    nettoloonBelastingGrafiek: 0,
    nvzk: 408,
    pensioenPremie: -61,
    toetsingsInkomen: 939,
    toetsingsInkomen1: 16_485,
    wonen: 0,
    woningType: WoningType.KOOP,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});

test("Bereken 2024 marginale druk 80000 alleenstaande, koop", () => {
  const arbeidsinkomen: number = 80000;
  const berekening = bereken(arbeidsinkomen, alleenstaandeKoop("md"), 939, VisualisatieTypeType.T, true);
  const expected: MarginaleDrukResultaatType = {
    ahk: -62,
    ahkMax: -62,
    ak: -61,
    akMax: -61,
    anderenArbeidsinkomen: [],
    arbeidsinkomen: 939,
    arbeidsinkomen1: arbeidsinkomen,
    brutoloon1: arbeidsinkomen,
    brutoloon: 939,
    hraMax: 118,
    iack: 0,
    iackMax: 0,
    ibBox1: -465,
    kb: 0,
    kgb: 0,
    marginaleDruk: 50.05,
    nettoArbeidsinkomen: 469,
    nettoInkomen: 469,
    nettoloon: 469,
    nettoloonBelasting: -470,
    nettoloonBelastingGrafiek: -347,
    nvzk: 0,
    pensioenPremie: 0,
    toetsingsInkomen: 939,
    toetsingsInkomen1: 67_620,
    wonen: 118,
    woningType: WoningType.KOOP,
    zt: 0,
  };
  expect(berekening).toEqual(expected);
});
