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
  InvoerGegevensType,
  VisualisatieType,
  LeeftijdType,
  PeriodeType,
  PersoonType,
  WonenType,
  WoningType,
  VisualisatieTypeType,
} from "../../../src/ts/types";

const vis: VisualisatieType = { jaar: "2024", periode: PeriodeType.JAAR };
const personen: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.K611 },
  { leeftijd: LeeftijdType.K611 },
];
const huur: WonenType = { woning_type: WoningType.HUUR, huur: 1100 };
const koop: WonenType = {
  woning_type: WoningType.KOOP,
  rente: 13482,
  woz: 315000,
};

test("Bereken beschikbaar inkomen eenverdiener, 2 kinderen, huur", () => {
  const arbeidsinkomen: number = 46377;
  const gegevens: InvoerGegevensType = {
    tab: "bi",
    personen: personen,
    wonen: huur,
    visualisatie: vis,
  };
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(gegevens);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen, VisualisatieTypeType.T);

  let expected: BeschikbaarInkomenResultaatType = {
    ahk: 1932,
    ahkMax: 1932,
    ak: 5114,
    arbeidsinkomen: arbeidsinkomen,
    iack: 0,
    ibBox1: 17146,
    nettoArbeidsinkomen: 29231,
    nettoInkomen: 43334,
    nettoLoon: 36277,
    nettoLoonBelasting: 10100,
    nvzk: 0,
    kb: 2736,
    kgb: 4162,
    wonen: 0,
    zt: 159,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken beschikbaar inkomen 10000 eenverdiener, 2 kinderen, koop", () => {
  const arbeidsinkomen: number = 10000;
  const gegevens: InvoerGegevensType = {
    tab: "bi",
    personen: personen,
    wonen: koop,
    visualisatie: vis,
  };
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(gegevens);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen, VisualisatieTypeType.T);

  let expected: BeschikbaarInkomenResultaatType = {
    ahk: 2872,
    ahkMax: 3362,
    ak: 825,
    arbeidsinkomen: arbeidsinkomen,
    ibBox1: 0,
    kb: 2736,
    kgb: 4872,
    nettoArbeidsinkomen: 6303,
    nettoInkomen: 20441,
    nettoLoon: 10000,
    nettoLoonBelasting: 0,
    iack: 0,
    nvzk: 490,
    wonen: 0,
    zt: 2833,
  };

  expect(berekening).toEqual(expected);
});

test("Bereken beschikbaar inkomen 30000 eenverdiener, koop", () => {
  const arbeidsinkomen: number = 30000;
  const eenverdiener: PersoonType[] = [{ leeftijd: LeeftijdType.V }];
  const gegevens: InvoerGegevensType = {
    tab: "bi",
    personen: eenverdiener,
    wonen: koop,
    visualisatie: vis,
  };
  const berekenen: BeschikbaarInkomen = new BeschikbaarInkomen(gegevens);
  const berekening: BeschikbaarInkomenResultaatType = berekenen.bereken(arbeidsinkomen, VisualisatieTypeType.T);

  let expected: BeschikbaarInkomenResultaatType = {
    ahk: 3362,
    ahkMax: 3362,
    ak: 5286,
    arbeidsinkomen: arbeidsinkomen,
    ibBox1: 6514,
    kb: 0,
    kgb: 0,
    nettoArbeidsinkomen: 18909,
    nettoInkomen: 31048,
    nettoLoon: 30000,
    nettoLoonBelasting: 0,
    iack: 0,
    nvzk: 0,
    wonen: 2443,
    zt: 1048,
  };

  expect(berekening).toEqual(expected);
});
