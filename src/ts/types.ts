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

export type JaarType = {
  value: string;
  label: string;
};

export enum LeeftijdType {
  K05 = "K05", // "Kind 0 t/m 5 Jaar",
  K611 = "K611", // "Kind 6 t/m 11 Jaar",
  K1215 = "K1215", // "Kind 12 t/m 15 jaar",
  K1617 = "K1617", // "16 of 17 jaar",
  V = "V", // "Volwassene",
  AOW = "AOW", // "AOW Leeftijd",
}

export enum LeeftijdTekstType {
  K05 = "0 en 5 jaar", // "Kind 0 t/m 5 Jaar",
  K611 = "6 en 11 jaar", // "Kind 6 t/m 11 Jaar",
  K1215 = "12 en 15 jaar", // "Kind 12 t/m 15 jaar",
  K1617 = "16 en 17 jaar", // "16 of 17 jaar",
  V = "Volwassene", // "Volwassene",
  AOW = "AOW-er", // "AOW Leeftijd",
}

export enum InkomenType {
  BRUTO = "bruto",
  PERCENTAGE = "percentage",
}

export type PersoonType = {
  leeftijd: LeeftijdType;
  inkomen_type?: InkomenType;
  bruto_inkomen?: number;
  percentage?: number;
  pensioenPremiePercentage?: number;
  pensioenFranchise?: number;
};

export enum WoningType {
  HUUR = "huur",
  KOOP = "koop",
}

export type WonenType = {
  woning_type: WoningType;
  huur?: number;
  woz?: number;
  rente?: number;
};

export enum PeriodeType {
  MAAND = "maand",
  JAAR = "jaar",
}

export enum SalarisVerhogingType {
  P = "p", // Procentueel
  A = "a", // Absoluut
}

export enum VisualisatieTypeType {
  G = "g", // grafiek
  T = "t", // Tabel
}

export type VisualisatieType = {
  /**
   * Visualisatie type: grafiek of tabel.
   */
  type: VisualisatieTypeType;
  /**
   * Jaar dat getoond wordt in legenda.
   */
  jaar: string;
  /**
   * Jaar dat wordt gebruikt bij vergelijken met ander jaar.
   */
  jaar2: string;
  /**
   * Cijfers tonen per jaar of maand.
   */
  periode: PeriodeType;
  /**
   * Bij maand visualisatie neem in de berekening mee dat er wel/geen 13e maand is.
   */
  extraMaand: boolean;
  /**
   * Begin en eind inkomensrange voor tonen cijfers.
   */
  van_tot: number[];
  /**
   * Intervalstap voor tonen cijfers in tabel.
   */
  stap: number;
  /**
   * Arbeidsinkomen dat in legenda wordt getoond.
   */
  arbeidsInkomen: number;
  /**
   * Type van gegevens voor gebruik in salarisverhogingsberekening: percentage of vast bedrag.
   */
  svt: SalarisVerhogingType;
  /**
   * Percentage dat wordt gebruikt als SalarisVerhogingType percentage is.
   */
  sv_p: number;
  /**
   * Absolute salarisverhoging die wordt gebruikt als SalarisVerhogingType absoluut is.
   */
  sv_abs: number;
};

export type InvoerGegevensType = {
  tab: string;
  personen: PersoonType[];
  wonen: WonenType;
  visualisatie: VisualisatieType;
};

export type BerekenInvoerType = {
  toeslagenpartner: boolean;
  aow: boolean;
  kinderbijslag: number;
  maxKindgebondenBudget: number;
  nk?: number;
  huren: boolean;
  eigenwoningforfait: number;
  hypotheekRenteAftrek: number;
};

export type BerekenResultaatType = {
  brutoloon: number;
  arbeidsinkomen: number; // belastbaar loon (brutoloon - pensioen premie)
  toetsingsInkomen: number;
  pensioenPremie: number;
  anderenArbeidsinkomen?: number[];
  ibBox1: number;
  nettoloon: number; // belastbaar loon - ibBox1 + AHK + AK + HT
  nettoInkomen: number; // netto inkomen
  nettoArbeidsinkomen: number;
  nettoloonBelasting: number;
  nettoloonBelastingGrafiek: number;
  ahk: number;
  ahkMax: number;
  ak: number;
  akMax?: number;
  iack: number;
  iackMax?: number;
  nvzk: number; // niet-verzilverde heffingskortingen
  kb: number;
  kgb: number;
  woningType: WoningType;
  wonen: number;
  hraMax?: number;
  zt: number;
};

export type BeschikbaarInkomenResultaatType = {} & BerekenResultaatType;

export type MarginaleDrukResultaatType = {
  brutoloon1: number;
  arbeidsinkomen1: number;
  toetsingsInkomen1: number;
  marginaleDruk: number;
} & BerekenResultaatType;

export type BelastingDrukResultaatType = {
  belastingdrukPercentage: number;
} & BerekenResultaatType;

export interface DeltaFunction {
  delta: (a: number, b: number, c: number, inverse: boolean) => number;
}

export type SerieType = {
  id: number;
  type: string;
  getal: number;
};

// Navigatie typen

export enum TabType {
  BI = "bi",
  MD = "md",
  BD = "bd",
  VJ = "vj",
}

export type PersoonNavigatieType = {
  leeftijd?: number;
  bruto_inkomen: number;
};

export type NavigatieType = {
  tab?: string;
  p?: string;
  w?: string;
  grafiek?: string; // vervangen door visualisatie
  v?: string;
};
