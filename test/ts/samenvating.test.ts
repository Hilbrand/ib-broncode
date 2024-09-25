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
import { maakSamenvatting } from "../../src/ts/samenvatting";
import { alleenstaande2KinderenHuur, eenverdiener2kinderenKoop } from "../js/berekeningen/invoer";
import { LeeftijdType } from "../../src/ts/types";

test("Samenvatting alleenstaande, 2 kinderen 6-11, huur 674", () => {
  const expected = "Alleenstaande met twee kinderen tussen 6 en 11 jaar, maandelijkse huur &euro; 674";
  const tekst = maakSamenvatting(alleenstaande2KinderenHuur("bi"));
  expect(tekst).toEqual(expected);
});

test("Samenvatting eenverdiener, 1 kind 0-5, 2 kinderen 6-11, koop", () => {
  const expected =
    "Eenverdiener met een kind tussen 0 en 5 jaar en twee kinderen tussen 6 en 11 jaar, " +
    "maandelijkse hypotheek rente &euro; 13482 voor een huis met WOZ-waarde: &euro; 315000";
  const gegevens = eenverdiener2kinderenKoop("bi");

  gegevens.personen.push({ leeftijd: LeeftijdType.K05 });
  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);
});

test("Samenvatting meerdere verdieners, 2 kinderen 6-11, koop", () => {
  const expected =
    "Meerdere verdieners met twee kinderen tussen 6 en 11 jaar, " +
    "maandelijkse hypotheek rente &euro; 13482 voor een huis met WOZ-waarde: &euro; 315000";
  const gegevens = eenverdiener2kinderenKoop("bi");

  gegevens.personen.push({ leeftijd: LeeftijdType.V, bruto_inkomen: 10000 });
  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);
});
