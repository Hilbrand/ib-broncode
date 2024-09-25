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
import type {
  BeschikbaarInkomenResultaatType,
  MarginaleDrukResultaatType,
  BelastingDrukResultaatType,
} from "../../ts/types";

const AI_KOLOM: TableBaseColumn = {
  title: "Brutoinkomen",
  key: "arbeidsinkomen",
  align: "right",
};

const IBBOX1_KOLOM: TableBaseColumn = {
  title: "IB Box 1",
  key: "ibBox1",
  align: "right",
};
const EL_KOLOM: TableBaseColumn = {
  title: "Extra loon",
  key: "extraLoon",
  align: "right",
};

const NL_KOLOM: TableBaseColumn = {
  title: "Nettoloon",
  key: "nettoLoon",
  align: "right",
};

const NI_KOLOM: TableBaseColumn = {
  title: "Netto inkomen",
  key: "nettoInkomen",
  align: "right",
};

const AHK_KOLOM: TableBaseColumn = {
  title: "AHK",
  key: "ahkMax",
  align: "right",
};

const AK_KOLOM: TableBaseColumn = {
  title: "AK",
  key: "akMax",
  align: "right",
};

const IACK_KOLOM: TableBaseColumn = {
  title: "IACK",
  key: "iackMax",
  align: "right",
};

const NVZK_KOLOM: TableBaseColumn = {
  title: "NVZK",
  key: "nvzk",
  align: "right",
};

const HRA_KOLOM: TableBaseColumn = {
  title: "HRA",
  key: "hraMax",
  align: "right",
};

const ZT_KOLOM: TableBaseColumn = {
  title: "ZT",
  key: "zt",
  align: "right",
};

const KGB_KOLOM: TableBaseColumn = {
  title: "KGB",
  key: "kgb",
  align: "right",
};

const HT_KOLOM: TableBaseColumn = {
  title: "HT",
  key: "wonen",
  align: "right",
};

const MD_KOLOM: TableBaseColumn = {
  title: "Marginale Druk",
  key: "marginaleDruk",
  align: "right",
  render: (_, index) => _.marginaleDruk.toFixed(0) + " %",
};

const BD_KOLOM: TableBaseColumn = {
  title: "Belastingdruk",
  key: "belastingdrukPercentage",
  align: "right",
  render: (_, index) => _.belastingdrukPercentage.toFixed(2) + " %",
};

const BI_HUUR_KOLOMMEN: DataTableColumns<BeschikbaarInkomenResultaatType> = [
  AI_KOLOM,
  IBBOX1_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NVZK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  HT_KOLOM,
  NI_KOLOM,
];

const BI_KOOP_KOLOMMEN: DataTableColumns<BeschikbaarInkomenResultaatType> = [
  AI_KOLOM,
  IBBOX1_KOLOM,
  HRA_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NVZK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  NI_KOLOM,
];

const MD_HUUR_KOLOMMEN: DataTableColumns<MarginaleDrukResultaatType> = [
  AI_KOLOM,
  EL_KOLOM,
  IBBOX1_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NVZK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  HT_KOLOM,
  NI_KOLOM,
  MD_KOLOM,
];

const MD_KOOP_KOLOMMEN: DataTableColumns<MarginaleDrukResultaatType> = [
  AI_KOLOM,
  EL_KOLOM,
  IBBOX1_KOLOM,
  HRA_KOLOM,
  AHK_KOLOM,
  AK_KOLOM,
  IACK_KOLOM,
  NVZK_KOLOM,
  NL_KOLOM,
  ZT_KOLOM,
  KGB_KOLOM,
  NI_KOLOM,
  MD_KOLOM,
];

const DB_KOLOMMEN: DataTableColumns<BelastingDrukResultaatType> = [AI_KOLOM, IBBOX1_KOLOM, BD_KOLOM];

export function biHuurKolommen(): DataTableColumns<BeschikbaarInkomenResultaatType> {
  return BI_HUUR_KOLOMMEN;
}

export function mdHuurKolommen(): DataTableColumns<MarginaleDrukResultaatType> {
  return MD_HUUR_KOLOMMEN;
}

export function biKoopKolommen(): DataTableColumns<BeschikbaarInkomenResultaatType> {
  return BI_KOOP_KOLOMMEN;
}

export function mdKoopKolommen(): DataTableColumns<MarginaleDrukResultaatType> {
  return MD_KOOP_KOLOMMEN;
}

export function bdKolommen(): DataTableColumns<BelastingDrukResultaatType> {
  return DB_KOLOMMEN;
}

export default {
  biHuurKolommen,
  biKoopKolommen,
  mdHuurKolommen,
  mdKoopKolommen,
  bdKolommen,
};
