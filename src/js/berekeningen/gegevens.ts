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

import {
  GrafiekType,
  InvoerGegevens,
  JaarType,
  LeeftijdType,
  NavigatieType,
  PeriodeType,
  PersoonType,
  SalarisVerhogingType,
  WonenType,
  WoningType,
} from "../../types";
import navigatie from "../navigatie";

const DEFAULT_WOON_TYPE: WoningType = WoningType.HUUR;
const AVG_HUUR: number = 600;
const AVG_WOZ: number = 315000;
const AVG_RENTE: number = AVG_WOZ * 0.0428;
const JAAR: string = "PD2025";
const JAREN: JaarType[] = [
  { jaar: "2023", label: "2023" },
  { jaar: "2024", label: "2024" },
  { jaar: "PD2025", label: "2025 Prinsjesdag" },
];

function lengte(a: any): number {
  return (a && a.length) || 0;
}

function defaultPersoon(): PersoonType {
  return {
    leeftijd: LeeftijdType.V,
  };
}

function persoonNavigatieToJson(p: any[]): PersoonType {
  const len = lengte(p);
  let persoon: PersoonType = defaultPersoon();

  if (len == 0) {
    return persoon;
  }
  persoon.leeftijd = Array.isArray(p) ? p[0] : p;

  if (len == 2) {
    persoon.bruto_inkomen = p[1];
  }
  return persoon;
}

function personenNavigatieToJson(queryParams): PersoonType[] {
  let len = lengte(queryParams);

  if (len == 0) {
    return [];
  }
  return queryParams.filter((p) => lengte(p) > 0).map(persoonNavigatieToJson);
}

function defaultWonen(): WonenType {
  return {
    woning_type: DEFAULT_WOON_TYPE,
    huur: AVG_HUUR,
    woz: AVG_WOZ,
    rente: AVG_RENTE,
  };
}

function wonenNavigatieToJson(queryParams: any[]): WonenType {
  const len = lengte(queryParams);
  let wonen: WonenType = defaultWonen();

  if (len == 0) {
    return wonen;
  }
  const wt = queryParams[0];
  if (wt == WoningType.HUUR && len == 2) {
    wonen.woning_type = wt;
    wonen.huur = queryParams[1];
  } else if (len == 3) {
    (wonen.woning_type = wt), (wonen.woz = queryParams[1]);
    wonen.rente = queryParams[2];
  }
  return wonen;
}
function defaultGrafiek(): GrafiekType {
  return {
    jaar: JAAR,
    periode: PeriodeType.JAAR,
    van_tot: [10000, 100000],
    arbeidsInkomen: 0,
    svt: SalarisVerhogingType.P,
    sv_p: 3,
    sv_abs: 1000,
  };
}

function grafiekNavigatieToJson(p: any): GrafiekType {
  let jaar = JAAR;
  let grafiek: GrafiekType = defaultGrafiek();

  if (lengte(p) == 6) {
    grafiek.jaar = p[0];
    p.shift();
  }
  if (lengte(p) != 5) {
    return {};
  }
  grafiek.periode = p[0];
  grafiek.van_tot = p[1];
  grafiek.svt = p[2];
  if (grafiek.svt == SalarisVerhogingType.A) {
    grafiek.sv_abs = p[3];
  } else {
    grafiek.sv_p = p[3];
  }
  grafiek.arbeidsInkomen = p[4];
  return grafiek;
}

function navigatieToJson(query: NavigatieType): InvoerGegevens {
  let basis: InvoerGegevens = {
    // Als oude code "eb" gebruikt is, vervang door nieuwe "bd".
    tab: (query?.tab == "eb" ? "bd" : query?.tab) || "intro",
    personen: [defaultPersoon()],
    wonen: defaultWonen(),
    grafiek: defaultGrafiek(),
  };
  navigatie.copyNavigatieToJson(query?.p, basis.personen, personenNavigatieToJson);
  navigatie.copyNavigatieToJson(query?.w, basis.wonen, wonenNavigatieToJson);
  navigatie.copyNavigatieToJson(query?.grafiek, basis.grafiek, grafiekNavigatieToJson);
  return basis;
}

// --------------------------------------------------

// p=<leeftijd>;<leeftijd>,<bruto_inkomen>

function personenJsonToNavigatie(personen: PersoonType[]): string[] {
  return personen.map((p) => p.leeftijd + (p.bruto_inkomen ? "," + p.bruto_inkomen : ""));
}

// w=huur;<huur>
// w=koop;<woz>;<rente>

function wonenJsonToNavigatie(wonen: WonenType): any[] {
  let nav: any[] = [wonen.woning_type];
  if (wonen.woning_type == "koop") {
    nav.push(wonen.woz);
    nav.push(wonen.rente);
  } else {
    nav.push(wonen.huur);
  }
  return nav;
}

function grafiekJsonToNavigatie(grafiek: GrafiekType): any[] {
  let sv = grafiek.svt == SalarisVerhogingType.A ? grafiek.sv_abs : grafiek.sv_p;
  return [grafiek.jaar, grafiek.periode, grafiek.van_tot, grafiek.svt, sv, grafiek.arbeidsInkomen];
}

function jsonToNavigatie(json: InvoerGegevens): NavigatieType {
  return {
    tab: json.tab,
    p: navigatie.jsonArrayToNavigatie(personenJsonToNavigatie(json.personen)),
    w: navigatie.jsonArrayToNavigatie(wonenJsonToNavigatie(json.wonen)),
    grafiek: navigatie.jsonArrayToNavigatie(grafiekJsonToNavigatie(json.grafiek)),
  };
}

export default {
  JAAR,
  JAREN,
  navigatieToJson,
  jsonToNavigatie,
};
