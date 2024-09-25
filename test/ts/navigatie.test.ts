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
import { JAAR, jsonToNavigatie, navigatieToJson } from "../../src/ts/navigatie";
import {
  VisualisatieType,
  InvoerGegevensType,
  LeeftijdType,
  PeriodeType,
  PersoonType,
  SalarisVerhogingType,
  TabType,
  VisualisatieTypeType,
  WoningType,
  NavigatieType,
  WonenType,
} from "../../src/ts/types";

const personenQuery: string = "V;V,10000;K611";
const personenJson: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.V, bruto_inkomen: 10000 },
  { leeftijd: LeeftijdType.K611 },
];
const wonenQuery: string = "huur;123";
const wonenJson: WonenType = { woning_type: WoningType.HUUR, huur: 123, rente: 13482, woz: 315000 };
const standaardJaar: string = JAAR;
const grafiekOud1Query: string = "jaar;1,2;p;4;12345";
const grafiekOud2Query: string = standaardJaar + ";jaar;1,2;p;4;12345";
const visualisatieQuery: string = "g;" + standaardJaar + ";jaar;1,2;100;p;4;12345";

const visualisatieJson: VisualisatieType = {
  type: VisualisatieTypeType.G,
  jaar: standaardJaar,
  periode: PeriodeType.JAAR,
  van_tot: [1, 2],
  stap: 100,
  svt: SalarisVerhogingType.P,
  sv_p: 4,
  sv_abs: 1000,
  arbeidsInkomen: 12345,
};

const queryGrafiekOud1: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  grafiek: grafiekOud1Query,
};
const queryGrafiekOud2: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  grafiek: grafiekOud2Query,
};
const jsonStandaard: InvoerGegevensType = {
  tab: TabType.BI,
  personen: personenJson,
  wonen: wonenJson,
  visualisatie: visualisatieJson,
};

const queryHuur: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  v: visualisatieQuery,
};
const jsonHuur: InvoerGegevensType = {
  tab: TabType.BI,
  personen: personenJson,
  wonen: { woning_type: WoningType.HUUR, huur: 123 },
  visualisatie: visualisatieJson,
};
const jsonExpectedHuur: InvoerGegevensType = {
  tab: TabType.BI,
  personen: personenJson,
  wonen: { woning_type: WoningType.HUUR, huur: 123, woz: 315000, rente: 13482 },
  visualisatie: visualisatieJson,
};

const queryKoop: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: "koop;123456;5432",
  v: visualisatieQuery,
};
const jsonExpectedKoop: InvoerGegevensType = {
  tab: TabType.BI,
  personen: personenJson,
  wonen: { woning_type: WoningType.KOOP, huur: 600, woz: 123456, rente: 5432 },
  visualisatie: visualisatieJson,
};

test("navigatie naar json, wonen: huur", () => {
  expect(navigatieToJson(queryHuur)).toEqual(jsonExpectedHuur);
});

test("navigatie naar json, wonen: koop", () => {
  expect(navigatieToJson(queryKoop)).toEqual(jsonExpectedKoop);
});

test("half lege navigatie", () => {
  expect(navigatieToJson({ tab: TabType.BD })).toEqual({
    personen: [{ leeftijd: "V" }],
    tab: TabType.BD,
    wonen: {
      woning_type: "huur",
      huur: 600,
      woz: 315000,
      rente: 13482,
    },
    visualisatie: {
      type: VisualisatieTypeType.G,
      periode: "jaar",
      van_tot: [10000, 100000],
      stap: 100,
      arbeidsInkomen: 0,
      jaar: "PD2025",
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("lege navigatie naar json", () => {
  expect(navigatieToJson("")).toEqual({
    tab: "intro",
    personen: [{ leeftijd: "V" }],
    wonen: {
      woning_type: "huur",
      huur: 600,
      woz: 315000,
      rente: 13482,
    },
    visualisatie: {
      type: VisualisatieTypeType.G,
      periode: "jaar",
      van_tot: [10000, 100000],
      stap: 100,
      arbeidsInkomen: 0,
      jaar: "PD2025",
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("oude navigatie 1 naar json ", () => {
  expect(navigatieToJson(queryGrafiekOud1)).toEqual(jsonStandaard);
});

test("oude navigatie 2 naar json ", () => {
  expect(navigatieToJson(queryGrafiekOud2)).toEqual(jsonStandaard);
});

test("json naar navigatie", () => {
  expect(jsonToNavigatie(jsonHuur)).toEqual(queryHuur);
});
