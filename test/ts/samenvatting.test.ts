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
import { maakSamenvatting, maakBestandsnaam, tekstVerdiener } from "../../src/ts/samenvatting";
import {
  alleenstaande2Kinderen,
  alleenstaande2KinderenHuur,
  eenverdiener2kinderenKoop,
} from "../js/berekeningen/invoer";
import { InkomenType, LeeftijdType, PersoonType } from "../../src/ts/types";

const minstVerdiener: PersoonType = { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.PERCENTAGE, percentage: 50 };
const meestVerdiener: PersoonType = { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.PERCENTAGE, percentage: 150 };
const evenveelVerdiener: PersoonType = {
  leeftijd: LeeftijdType.V,
  inkomen_type: InkomenType.PERCENTAGE,
  percentage: 100,
};
const brutoVerdiener: PersoonType = { leeftijd: LeeftijdType.V, inkomen_type: InkomenType.BRUTO, bruto_inkomen: 10000 };

// Testen voor samenvatting en bestandsnaam

test("Samenvatting alleenstaande, 2 kinderen 6-11, huur 674", () => {
  const expected = "Alleenstaande met twee kinderen tussen 6 en 11 jaar, maandelijkse huur &euro; 674";
  const gegevens = alleenstaande2KinderenHuur("bi");

  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);

  const bestandsnaam = maakBestandsnaam(gegevens);
  expect(bestandsnaam).toEqual("bi-alleenstaande-kinderen-huurwoning");
});

test("Samenvatting eenverdiener, 1 kind 0-5, 2 kinderen 6-11, koop", () => {
  const expected =
    "Eenverdiener met een kind tussen 0 en 5 jaar en twee kinderen tussen 6 en 11 jaar, " +
    "jaarlijkse hypotheek rente &euro; 13482 voor een huis met WOZ-waarde: &euro; 315000";
  const gegevens = eenverdiener2kinderenKoop("bi");
  gegevens.personen.push({ leeftijd: LeeftijdType.K05 });

  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);

  const bestandsnaam = maakBestandsnaam(gegevens);
  expect(bestandsnaam).toEqual("bi-eenverdiener-kinderen-koopwoning");
});

test("Samenvatting meerdere verdieners, 2 kinderen 6-11, koop", () => {
  const expected =
    "Meerdere verdieners met twee kinderen tussen 6 en 11 jaar, " +
    "jaarlijkse hypotheek rente &euro; 13482 voor een huis met WOZ-waarde: &euro; 315000";
  const gegevens = eenverdiener2kinderenKoop("bi");
  gegevens.personen.push({ leeftijd: LeeftijdType.V, bruto_inkomen: 10000 });

  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);

  const bestandsnaam = maakBestandsnaam(gegevens);
  expect(bestandsnaam).toEqual("bi-meerdereverdieners-kinderen-koopwoning");
});

test("Samenvatting Meest verdiener, 2 kinderen 6-11, koop", () => {
  const expected =
    "Meestverdiener met twee kinderen tussen 6 en 11 jaar, " +
    "jaarlijkse hypotheek rente &euro; 13482 voor een huis met WOZ-waarde: &euro; 315000";
  const gegevens = eenverdiener2kinderenKoop("bi");
  gegevens.personen.push({ leeftijd: LeeftijdType.V, inkomen_type: InkomenType.PERCENTAGE, percentage: 50 });

  const tekst = maakSamenvatting(gegevens);
  expect(tekst).toEqual(expected);

  const bestandsnaam = maakBestandsnaam(gegevens);
  expect(bestandsnaam).toEqual("bi-meestverdiener-kinderen-koopwoning");
});

// Testen voor functie tekstVerdiener

function maakPersonen(persoon: PersoonType): PersoonType[] {
  return [...alleenstaande2Kinderen, persoon];
}

test("Persoon is meest verdiener", () => {
  expect(tekstVerdiener(meestVerdiener, maakPersonen(meestVerdiener))).toEqual("meestverdiener");
});

test("Eerste persoon is meest verdiener", () => {
  expect(tekstVerdiener(undefined, maakPersonen(minstVerdiener))).toEqual("meestverdiener");
});

test("Persoon is minst verdiener", () => {
  expect(tekstVerdiener(minstVerdiener, maakPersonen(minstVerdiener))).toEqual("minstverdiener");
});

test("Eerste persoon is minst verdiener", () => {
  expect(tekstVerdiener(undefined, maakPersonen(meestVerdiener))).toEqual("minstverdiener");
});

test("Persoon is verdient evenveel", () => {
  expect(tekstVerdiener(evenveelVerdiener, maakPersonen(evenveelVerdiener))).toEqual("");
});

test("Eerste persoon is verdient evenveel", () => {
  expect(tekstVerdiener(undefined, maakPersonen(evenveelVerdiener))).toEqual("");
});

test("Persoon zonder tekst, omdat bruto verdiener aanwezig", () => {
  expect(tekstVerdiener(minstVerdiener, [...maakPersonen(minstVerdiener), brutoVerdiener])).toEqual("");
});

test("Eerste persoon zonder tekst, omdat bruto verdiener aanwezig", () => {
  expect(tekstVerdiener(undefined, [...maakPersonen(minstVerdiener), brutoVerdiener])).toEqual("");
});
