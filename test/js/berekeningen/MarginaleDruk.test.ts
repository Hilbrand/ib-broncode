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
import {
  InvoerGegevensType,
  LeeftijdType,
  MarginaleDrukResultaatType,
  PeriodeType,
  PersoonType,
  SalarisVerhogingType,
  VisualisatieType,
  VisualisatieTypeType,
  WonenType,
  WoningType,
} from "../../../src/ts/types.js";

test("Marginale Druk Details Huur 2023", () => {
  const vis: VisualisatieType = {
    jaar: "2023",
    periode: PeriodeType.JAAR,
    svt: SalarisVerhogingType.P,
    sv_p: 3,
  };
  const personen: PersoonType[] = [{ leeftijd: LeeftijdType.V }];
  const wonen: WonenType = { woning_type: WoningType.HUUR, huur: 600 };
  const ai: number = 27800;
  const gegevens: InvoerGegevensType = {
    tab: "bi",
    personen: personen,
    wonen: wonen,
    visualisatie: vis,
  };

  const md: MarginaleDruk = new MarginaleDruk(gegevens, new BeschikbaarInkomen(gegevens));
  let mdd: MarginaleDrukResultaatType = md.bereken(ai);

  let expected: MarginaleDrukResultaatType = {
    ahk: 0,
    ahkMax: 0,
    ak: 3.12,
    arbeidsinkomen: 27800,
    extraLoon: 834,
    ibBox1: 0,
    kb: 0,
    kgb: 0,
    marginaleDruk: 85.25,
    nettoArbeidsinkomen: 14.75,
    nettoInkomen: 46.4,
    nettoLoon: 60.07,
    nettoLoonBelasting: 39.93,
    iack: 0,
    nvzk: 0,
    wonen: 0,
    zt: 0,
  };
  expect(mdd).toEqual(expected);
});

test("Marginale Druk Details 2024", () => {
  const vis: VisualisatieType = {
    jaar: "2024",
    periode: PeriodeType.JAAR,
    svt: SalarisVerhogingType.A,
    sv_abs: 1000,
  };
  const personen: PersoonType[] = [
    { leeftijd: LeeftijdType.V },
    { leeftijd: LeeftijdType.V, bruto_inkomen: 20000 },
    { leeftijd: LeeftijdType.K611 },
    { leeftijd: LeeftijdType.K611 },
  ];
  const wonen: WonenType = { woning_type: WoningType.HUUR, huur: 674 };
  const ai: number = 36667;
  const gegevens: InvoerGegevensType = {
    tab: "md",
    personen: personen,
    wonen: wonen,
    visualisatie: vis,
  };

  const md: MarginaleDruk = new MarginaleDruk(gegevens, new BeschikbaarInkomen(gegevens));
  let mdd: MarginaleDrukResultaatType = md.bereken(ai, VisualisatieTypeType.T);

  let expected: MarginaleDrukResultaatType = {
    ahk: -66,
    ahkMax: -66,
    ak: 24,
    arbeidsinkomen: 36667,
    extraLoon: 1000,
    ibBox1: -369,
    kb: 0,
    kgb: -67,
    marginaleDruk: 47.8,
    nettoArbeidsinkomen: 522,
    nettoInkomen: 522,
    nettoLoon: 589,
    nettoLoonBelasting: 411,
    iack: 0,
    nvzk: 0,
    wonen: 0,
    zt: 0,
  };
});

test("Marginale Druk Details Koop 2024", () => {
  const vis: VisualisatieType = {
    jaar: "2024",
    periode: PeriodeType.JAAR,
    svt: SalarisVerhogingType.A,
    sv_abs: 1000,
  };
  const personen: PersoonType[] = [
    { leeftijd: LeeftijdType.V },
    { leeftijd: LeeftijdType.V, bruto_inkomen: 18333 },
    { leeftijd: LeeftijdType.K611 },
    { leeftijd: LeeftijdType.K611 },
  ];
  const wonen: WonenType = { woning_type: WoningType.KOOP, woz: 315000, rente: 13482 };
  const ai: number = 80000;
  const gegevens: InvoerGegevensType = {
    tab: "md",
    personen: personen,
    wonen: wonen,
    visualisatie: vis,
  };

  const md: MarginaleDruk = new MarginaleDruk(gegevens, new BeschikbaarInkomen(gegevens));
  let mdd: MarginaleDrukResultaatType = md.bereken(ai, VisualisatieTypeType.G);

  let expected: MarginaleDrukResultaatType = {
    ahk: 0,
    ahkMax: 0,
    ak: 0,
    arbeidsinkomen: 80000,
    extraLoon: 1000,
    ibBox1: 0,
    kb: 0,
    kgb: 0,
    marginaleDruk: 44.4,
    nettoArbeidsinkomen: 55.6,
    nettoInkomen: 43.1,
    nettoLoon: 49.9,
    nettoLoonBelasting: 50.1,
    iack: 0,
    nvzk: 0,
    wonen: 12.5,
    zt: 0,
  };
});
