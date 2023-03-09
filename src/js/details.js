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

function euro(getal) {
  return "&euro; " + getal;
}

function f2p(factor, precisie) {
  return (factor * 100).toFixed(precisie);
}

function aow(aow) {
  return (aow ? "" : "Niet ") + "AOW-leeftijd: ";
}

function bouw(name, condities, berekeningen, getal, bronnen) {
  return {
    name: name,
    condities: condities,
    berekeningen: berekeningen,
    getal: euro(getal),
    bronnen: bronnen,
  };
}

export default {
  euro,
  f2p,
  aow,
  bouw,
};
