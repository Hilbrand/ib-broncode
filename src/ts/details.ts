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

import { Detail } from "./types";

function euro(getal: number): string {
  return "&euro; " + getal;
}

function f2p(factor: number, precisie: number): string {
  return (factor * 100).toFixed(precisie);
}

function aow(aow: boolean): string {
  return (aow ? "" : "Niet ") + "AOW-leeftijd: ";
}

function bouw(naam: string, condities: string[], berekeningen: string[], bedrag: number, bronnen: string[]): Detail {
  return {
    naam: naam,
    condities: condities,
    berekeningen: berekeningen,
    bedrag: euro(bedrag),
    bronnen: bronnen,
  };
}

export default {
  euro,
  f2p,
  aow,
  bouw,
};
