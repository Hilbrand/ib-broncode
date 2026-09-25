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
import { JAAR, JAAR2, jsonNaarNavigatie, navigatieNaarJson } from "../../src/ts/navigatie";
import {
  InkomenType,
  InvoerGegevensType,
  LeeftijdType,
  NavigatieType,
  PeriodeType,
  PersoonType,
  SalarisVerhogingType,
  TabType,
  VisualisatieType,
  VisualisatieTypeType,
  WonenType,
  WoningType,
} from "../../src/ts/types";

const personenQuery: string = "V;V;V,10000;V,P50;V,17000,6.2;V,P50,18000,5.2;K611";
const personenJson: PersoonType[] = [
  { leeftijd: LeeftijdType.V, pensioenFranchise: 0, pensioenPremiePercentage: 0 },
  { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.BRUTO },
  { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.BRUTO, bruto_inkomen: 10000 },
  { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.PERCENTAGE, percentage: 50 },
  {
    leeftijd: LeeftijdType.V,
    inkomen_type: InkomenType.BRUTO,
    pensioenFranchise: 17000,
    pensioenPremiePercentage: 6.2,
  },
  {
    leeftijd: LeeftijdType.V,
    inkomen_type: InkomenType.PERCENTAGE,
    percentage: 50,
    pensioenFranchise: 18000,
    pensioenPremiePercentage: 5.2,
  },
  { leeftijd: LeeftijdType.K611 },
];
const wonenQuery: string = "huur;123";
const wonenJson: WonenType = { woning_type: WoningType.HUUR, huur: 123, rente: 14686.2, woz: 398000 };
const standaardJaar: string | number = 2026;
const standaardJaar2: string | number = 2025;
const grafiekOud6Query: string = "jaar;1,2;p;4;12345";
const grafiekOud7Query: string = standaardJaar + ";jaar;1,2;p;4;12345";
const grafiekOud9Query: string = "g;" + standaardJaar + ";jaar;1,2;100;p;4;12345";
const visualisatieQuery: string = "g;" + standaardJaar + ";" + standaardJaar2 + ";jaar;f;1,2;100;p;4;12345";

const visualisatieJson: VisualisatieType = {
  type: VisualisatieTypeType.G,
  jaar: standaardJaar,
  jaar2: standaardJaar2,
  periode: PeriodeType.JAAR,
  extraMaand: false,
  van_tot: [1, 2],
  stap: 100,
  svt: SalarisVerhogingType.P,
  sv_p: 4,
  sv_abs: 1000,
  arbeidsInkomen: 12345,
};

const queryGrafiekOud6: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  grafiek: grafiekOud6Query,
};
const queryGrafiekOud7: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  grafiek: grafiekOud7Query,
};
const queryGrafiekOud9: NavigatieType = {
  tab: TabType.BI,
  p: personenQuery,
  w: wonenQuery,
  grafiek: grafiekOud9Query,
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
  wonen: { woning_type: WoningType.HUUR, huur: 123, woz: 398000, rente: 14686.2 },
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
  wonen: { woning_type: WoningType.KOOP, huur: 750, woz: 123456, rente: 5432 },
  visualisatie: visualisatieJson,
};

test("navigatie naar json, wonen: huur", () => {
  expect(navigatieNaarJson(queryHuur)).toEqual(jsonExpectedHuur);
});

test("navigatie naar json, wonen: koop", () => {
  expect(navigatieNaarJson(queryKoop)).toEqual(jsonExpectedKoop);
});

test("half lege navigatie", () => {
  expect(navigatieNaarJson({ tab: TabType.BD })).toEqual({
    personen: [{ leeftijd: "V" }],
    tab: TabType.BD,
    wonen: {
      woning_type: "huur",
      huur: 750,
      woz: 398000,
      rente: 14686.2,
    },
    visualisatie: {
      type: VisualisatieTypeType.G,
      periode: "jaar",
      extraMaand: false,
      van_tot: [10000, 100000],
      stap: 100,
      arbeidsInkomen: 0,
      jaar: standaardJaar,
      jaar2: standaardJaar2,
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("lege navigatie naar json", () => {
  expect(navigatieNaarJson({})).toEqual({
    tab: "intro",
    personen: [{ leeftijd: "V" }],
    wonen: {
      woning_type: "huur",
      huur: 750,
      woz: 398000,
      rente: 14686.2,
    },
    visualisatie: {
      type: VisualisatieTypeType.G,
      periode: "jaar",
      extraMaand: false,
      van_tot: [10000, 100000],
      stap: 100,
      arbeidsInkomen: 0,
      jaar: standaardJaar,
      jaar2: standaardJaar2,
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("oude navigatie 6 naar json ", () => {
  expect(navigatieNaarJson(queryGrafiekOud6)).toEqual(jsonStandaard);
});

test("oude navigatie 7 naar json ", () => {
  expect(navigatieNaarJson(queryGrafiekOud7)).toEqual(jsonStandaard);
});

test("oude navigatie 9 naar json ", () => {
  expect(navigatieNaarJson(queryGrafiekOud9)).toEqual(jsonStandaard);
});

test("json naar navigatie", () => {
  expect(jsonNaarNavigatie(jsonHuur)).toEqual(queryHuur);
});
