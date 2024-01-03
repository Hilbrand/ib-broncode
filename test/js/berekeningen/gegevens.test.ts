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
import gegevens from "../../../src/js/berekeningen/gegevens";
import { GrafiekType, LeeftijdType, PeriodeType, PersoonType, SalarisVerhogingType, TabType } from "../../../src/types";

const personenQuery: string = "V;V,10000;K611";
const personenJson: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.V, bruto_inkomen: 10000 },
  { leeftijd: LeeftijdType.K611 },
];

const grafiekQuery: string = "2000;jaar;1,2;p;4;12345";
const grafiekJson: GrafiekType = {
  jaar: 2000,
  periode: PeriodeType.JAAR,
  van_tot: [1, 2],
  svt: SalarisVerhogingType.P,
  sv_p: 4,
  sv_abs: 1000,
  arbeidsInkomen: 12345,
};

const queryHuur = {
  tab: "ib",
  p: personenQuery,
  w: "huur;123",
  grafiek: grafiekQuery,
};
const jsonHuur = {
  tab: "ib",
  personen: personenJson,
  wonen: { woning_type: "huur", huur: "123" },
  grafiek: grafiekJson,
};
const jsonExpectedHuur = {
  tab: "ib",
  personen: personenJson,
  wonen: { woning_type: "huur", huur: 123, woz: 315000, rente: 13482 },
  grafiek: grafiekJson,
};

const queryKoop = {
  tab: "ib",
  p: personenQuery,
  w: "koop;123456;5432",
  grafiek: grafiekQuery,
};
const jsonExpectedKoop = {
  tab: "ib",
  personen: personenJson,
  wonen: { woning_type: "koop", huur: 600, woz: 123456, rente: 5432 },
  grafiek: grafiekJson,
};

test("navigatie naar json, wonen: huur", () => {
  //expect(gegevens.navigatieToJson(queryHuur)).toEqual(jsonExpectedHuur)
});

test("navigatie naar json, wonen: koop", () => {
  //expect(gegevens.navigatieToJson(queryKoop)).toEqual(jsonExpectedKoop)
});

test("half lege navigatie", () => {
  expect(gegevens.navigatieToJson({ tab: TabType.EB })).toEqual({
    tab: TabType.EB,
    personen: [{ leeftijd: "V" }],
    wonen: {
      woning_type: "huur",
      huur: 600,
      woz: 315000,
      rente: 13482,
    },
    grafiek: {
      periode: "jaar",
      van_tot: [10000, 100000],
      arbeidsInkomen: 0,
      jaar: 2024,
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("lege navigatie naar json", () => {
  expect(gegevens.navigatieToJson("")).toEqual({
    tab: "intro",
    personen: [{ leeftijd: "V" }],
    wonen: {
      woning_type: "huur",
      huur: 600,
      woz: 315000,
      rente: 13482,
    },
    grafiek: {
      periode: "jaar",
      van_tot: [10000, 100000],
      arbeidsInkomen: 0,
      jaar: 2024,
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  });
});

test("json naar navigatie", () => {
  expect(gegevens.jsonToNavigatie(jsonHuur)).toEqual(queryHuur);
});
