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

/**
 * Basis class voor legenda in grafiek.
 */
export class Legenda {
  static EURO = "€";

  percentage(getal) {
    return (
      (getal > 0 ? (1 * getal).toFixed(1) : "-").padStart(5, "\u00A0") + " %"
    );
  }

  geld(bedrag) {
    return bedrag > 0
      ? Legenda.EURO + " " + bedrag.toFixed().padStart(4, "\u00A0")
      : "-";
  }

  setLegendaText(data, length, offset) {}

  getLabelYAs() {}

  getFactorYas() {}
}
