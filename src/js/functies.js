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

function telPersonen(personen, controleLeeftijd) {
  return personen.filter((p) => p.leeftijd == controleLeeftijd).length;
}

function telVolwassenen(personen) {
  return telPersonen(personen, "V") + telPersonen(personen, "AOW");
}

function toeslagenPartner(personen) {
  return telVolwassenen(personen) > 1;
}

function aow(personen) {
  return telPersonen(personen, "AOW") > 0;
}

function isHuur(wonen) {
  return wonen.woning_type == "huur";
}

function negatiefIsNul(getal) {
  return Math.max(0, getal);
}

function factorBerekening(periode) {
  return "maand" == periode ? (1 / 12) : 1;
}

export default {
  telPersonen,
  telVolwassenen,
  toeslagenPartner,
  aow,
  isHuur,
  negatiefIsNul,
  factorBerekening,
};
