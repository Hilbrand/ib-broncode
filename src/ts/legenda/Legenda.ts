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

import { BerekenModel } from "../berekeningen/BerekenModel";

/**
 * Basis class voor legenda in grafiek.
 */
export abstract class Legenda {
  static EURO = "€";

  berekenen: BerekenModel;
  colorFunction!: (idx: number) => string;
  legendaFunction!: (data: any) => any;
  updateFunction!: (idx: number) => void;

  constructor(berekenen: BerekenModel) {
    this.berekenen = berekenen;
  }

  setColorFunction(colorFunction: (idx: number) => string) {
    this.colorFunction = colorFunction;
  }

  setLegendaFunction(legendaFunction: (data: any) => any) {
    this.legendaFunction = legendaFunction;
  }

  setUpdateFunction(updateFunction: (idx: number) => void) {
    this.updateFunction = updateFunction;
  }

  isSalarisLijn(): boolean {
    return false;
  }

  getFactor(): number {
    return this.berekenen.getIndexFactor();
  }

  percentage(getal: number): string {
    return (getal > 0 || getal < 0 ? (1 * getal).toFixed(2) : "-").padStart(5, "\u00A0") + " %";
  }

  geld(bedrag: number): string {
    return bedrag > 0 || bedrag < 0
      ? Legenda.EURO + " " + (bedrag * this.getFactor()).toFixed()?.toLocaleString().padStart(5, "\u00A0")
      : "-";
  }

  setLegendaVast(id: number) {
    const inkomen = id / this.berekenen.getIndexFactor();
    this.berekenen.gegevens.visualisatie.arbeidsInkomen = inkomen;
    this.updateLegenda(inkomen);
  }

  setLegendaText(id: number) {
    this.updateLegenda(id / this.berekenen.getIndexFactor());
  }

  setLegendaIngesteld() {
    const inkomen = this.berekenen.gegevens.visualisatie.arbeidsInkomen;

    if (inkomen > 0) {
      this.updateLegenda(inkomen);
      this.updateFunction(inkomen * this.berekenen.getIndexFactor());
    }
  }

  updateLegenda(inkomen: number) {
    this.legendaFunction(this.getLegendaTextInkomen(inkomen));
  }

  /**
   * @param inkomen
   */
  abstract getLegendaTextInkomen(inkomen: number): any;

  getLabelYAs() {
    return "";
  }
}
