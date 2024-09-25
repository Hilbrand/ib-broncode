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

import type { DataTableColumns } from "naive-ui";
import type { BeschikbaarInkomenResultaatType, MarginaleDrukResultaatType, InvoerGegevensType } from "../../ts/types";

const AI_KOLOM: TableBaseColumn = {
  title: "Brutoinkomen",
  key: "arbeidsinkomen",
  align: 'right',
  width: 100
};

const BOX1_KOLOM: TableBaseColumn = {
  title: "IB Box 1",
  key: "ibBox1",
  align: 'right',
  width: 80,
};
const EL_KOLOM: TableBaseColumn = {
  title: "Extra loon",
  key: "extraLoon",
  align: 'right',
  width: 80,
};

const NL_KOLOM: TableBaseColumn = {
  title: "Nettoloon",
  key: "nettoLoon",
  align: 'right',
  width: 80,
}

const NI_KOLOM: TableBaseColumn = {
  title: "Netto inkomen",
  key: "beschikbaarInkomen",
  align: 'right',
  width: 80,
}

const AHK_KOLOM: TableBaseColumn = {
  title: "AHK",
  key: "algemeneHeffingsKorting",
  align: 'right',
  width: 60,
};

const AK_KOLOM: TableBaseColumn = {
  title: "AK",
  key: "arbeidskorting",
  align: 'right',
  width: 60,
};

const IACK_KOLOM: TableBaseColumn = {
  title: "IACK",
  key: "inkomensafhankelijkeCombinatiekorting",
  align: 'right',
  width: 60,
};

const ZT_KOLOM: TableBaseColumn = {
  title: "ZT",
  key: "zorgtoeslag",
  align: 'right',
  width: 60,
};

const KGB_KOLOM: TableBaseColumn = {
  title: "KGB",
  key: "kindgebondenBudget",
  align: 'right',
  width: 60,
};

const HT_KOLOM: TableBaseColumn = {
  title: "HT",
  key: "wonen",
  align: 'right',
  width: 60,
};

const MD_KOLOM: TableBaseColumn = {
  title: "Marginale Druk",
  key: "marginaleDruk",
  align: 'right',
  width: 105,
  render: (_, index) => _.marginaleDruk.toFixed(0) + ' %'
};

const BI_HUUR_KOLOMMEN: DataTableColumns<BeschikbaarInkomenResultaatType> = [
  AI_KOLOM,
  BOX1_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  HT_KOLOM,
  NI_KOLOM,
];
//Brutoloon 
// Belastbaar loon IB Box 1 
//AHK
// AK
// IACK
// NVZK
// Nettoloon
// ZT
// KGB
// HT
// KOT
// KOKO
// Netto inkomen
// Marginale druk
// Gemiddelde druk
const MD_HUUR_KOLOMMEN: DataTableColumns<MarginaleDrukResultaatType> = [
  AI_KOLOM,
  EL_KOLOM,
  BOX1_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  HT_KOLOM,
  MD_KOLOM
];

export function biHuurKolommen() : DataTableColumns<BeschikbaarInkomenResultaatType> {
  return BI_HUUR_KOLOMMEN;
}

export function mdHuurKolommen() : DataTableColumns<MarginaleDrukResultaatType> {
  return MD_HUUR_KOLOMMEN;
}

export default {
  biHuurKolommen,
  mdHuurKolommen,
}
