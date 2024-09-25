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

import {
  InvoerGegevensType,
  VisualisatieType,
  LeeftijdType,
  PeriodeType,
  PersoonType,
  WonenType,
  WoningType,
  SalarisVerhogingType,
} from "../../../src/ts/types";

const vis: VisualisatieType = {
  jaar: "2024",
  periode: PeriodeType.JAAR,
  svt: SalarisVerhogingType.A,
};
const alleenstaande2Kinderen: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.K611 },
  { leeftijd: LeeftijdType.K611 },
];
const eenverdiener2Kinderen: PersoonType[] = [
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.V },
  { leeftijd: LeeftijdType.K611 },
  { leeftijd: LeeftijdType.K611 },
];
const alleenstaande: PersoonType[] = [{ leeftijd: LeeftijdType.V }];

const huur: WonenType = { woning_type: WoningType.HUUR, huur: 674 };
const koop: WonenType = {
  woning_type: WoningType.KOOP,
  rente: 13482,
  woz: 315000,
};

function invoerGegevens(
  tab: string,
  personen: PersoonType[],
  wonen: WonenType,
  visualisatie: VisualisatieType
): InvoerGegevensType {
  return JSON.parse(
    JSON.stringify({
      tab: tab,
      personen: personen,
      wonen: wonen,
      visualisatie: visualisatie,
    })
  ) as InvoerGegevensType;
}

export function alleenstaande2KinderenHuur(tab: string): InvoerGegevensType {
  return invoerGegevens(tab, alleenstaande2Kinderen, huur, vis);
}

export function eenverdiener2KinderenHuur(tab: string): InvoerGegevensType {
  return invoerGegevens(tab, eenverdiener2Kinderen, huur, vis);
}

export function eenverdiener2kinderenKoop(tab: string): InvoerGegevensType {
  return invoerGegevens(tab, eenverdiener2Kinderen, koop, vis);
}

export function alleenstaandeKoop(tab: string): InvoerGegevensType {
  return invoerGegevens(tab, alleenstaande, koop, vis);
}
