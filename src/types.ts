export enum LeeftijdType {
  K05 = "K05", // "Kind 0 t/m 5 Jaar",
  K611 = "K611", // "Kind 6 t/m 11 Jaar",
  K1215 = "K1215", // "Kind 12 t/m 15 jaar",
  K1617 = "K1617", // "16 of 17 jaar",
  V = "V", // "Volwassene",
  AOW = "AOW", // "AOW Leeftijd",
}

export type PersoonType = {
  leeftijd: LeeftijdType;
  bruto_inkomen?: number;
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

export type GrafiekType = {
  jaar?: number;
  periode?: PeriodeType;
  van_tot?: number[];
  arbeidsInkomen?: number;
  svt?: SalarisVerhogingType;
  sv_p?: number;
  sv_abs?: number;
};

export type InvoerGegevens = {
  tab: string;
  personen: PersoonType[];
  wonen: WonenType;
  grafiek: GrafiekType;
};

export type BerekenInvoerType = {
  toeslagenpartner: boolean;
  aow: boolean;
  iacbInkomen: number;
  kinderbijslag: number;
  maxKindgebondenBudget: number;
  nk?: number;
  huren: boolean;
  hypotheekRenteAftrek: number;
};

export type BerekenResultaatType = {
  arbeidsinkomen: number;
  beschikbaarInkomen?: number;
  algemeneHeffingsKorting: number;
  arbeidskorting: number;
  inkomensafhankelijkeCombinatiekorting: number;
  kindgebondenBudget: number;
  kinderbijslag: number;
  wonen: number;
  zorgtoeslag: number;
};

export type BeschikbaarInkomenResultaatType = {
  brutoInkomstenBelasting: number;
  netto: number;
} & BerekenResultaatType;

export type MarginaleDrukResultaatType = {
  nettoInkomensBelasting?: number;
  marginaleDruk: number;
} & BerekenResultaatType;

// Navigatie typen

export enum TabType {
  BI = "bi",
  MD = "md",
  EB = "eb",
}

export type PersoonNavigatieType = {
  leeftijd?: number;
  bruto_inkomen: number;
};

export type NavigatieType = {
  tab?: string;
  p?: string;
  w?: string;
  grafiek?: string;
};
