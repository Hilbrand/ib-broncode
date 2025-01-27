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

/*
 * Helper JavaScript om navigatie van en naar JSON objecten om te zetten.
 */
import {
  InkomenType,
  InvoerGegevensType,
  JaarType,
  LeeftijdType,
  NavigatieType,
  PeriodeType,
  PersoonType,
  SalarisVerhogingType,
  VisualisatieType,
  VisualisatieTypeType,
  WonenType,
  WoningType,
} from "./types";

const KEY_VALUE_SPLIT: string = ";";
const DEFAULT_WOON_TYPE: WoningType = WoningType.HUUR;
const AVG_HUUR: number = 710;
const AVG_WOZ: number = 315000;
const AVG_RENTE_PERCENTAGE: number = 0.04;
const AVG_RENTE: number = AVG_WOZ * AVG_RENTE_PERCENTAGE;
export const JAAR: string | number = 2025;
export const JAREN: JaarType[] = [
  { value: "2025", label: "2025" },
  { value: "PD2025", label: "Prinsjesdag Belastingplan 2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

// Generieke functies voor navigatie conversie.

function toNumber(v: any): number {
  return Number.isNaN(v * 1) ? v : v * 1;
}

function toJsonArray(q: any) {
  let a = typeof q === "string" ? q.split(",").map((b) => toNumber(b)) : [q];

  return a.length == 1 ? toNumber(q) : a;
}

function splitParam(queryParam: string | any): string {
  let a: string[] | any = queryParam ? queryParam.split(KEY_VALUE_SPLIT) : queryParam;

  return a ? a.map(toJsonArray) : a;
}

function copyNavigatieNaarJson(from, to, functionNavNaarJson: (any) => any) {
  Object.entries(functionNavNaarJson(splitParam(from))).forEach((a) => (to[a[0]] = toJsonArray(a[1])));
}

function jsonArrayNaarNavigatie(jsonArray: string[]): string {
  return jsonArray.join(KEY_VALUE_SPLIT);
}

function lengte(a: any): number {
  return (a && a.length) || 0;
}

// Functies om navigatie van en naar interne json om te zetten.

export function standaardPersoon(): PersoonType {
  return {
    leeftijd: LeeftijdType.V,
  };
}

function persoonNavigatieNaarJson(p: any[], index: number): PersoonType {
  const len = lengte(p);
  let persoon: PersoonType = standaardPersoon();

  if (len == 0) {
    return persoon;
  }
  persoon.leeftijd = Array.isArray(p) ? p[0] : p;

  if (len == 2) {
    if (isNaN(p[1])) {
      persoon.inkomen_type = InkomenType.PERCENTAGE;
      persoon.percentage = +p[1].substring(1);
    } else {
      persoon.inkomen_type = InkomenType.BRUTO;
      persoon.bruto_inkomen = p[1];
    }
  } else if (index != 0 && (persoon.leeftijd == LeeftijdType.V || persoon.leeftijd == LeeftijdType.AOW)) {
    persoon.inkomen_type = InkomenType.BRUTO;
  }
  return persoon;
}

function personenNavigatieNaarJson(queryParams: any[]): PersoonType[] {
  let len = lengte(queryParams);

  if (len == 0) {
    return [];
  }
  return queryParams
    .filter((p: any) => lengte(p) > 0)
    .map((p: any, index: number) => persoonNavigatieNaarJson(p, index));
}

export function standaardWonen(): WonenType {
  return {
    woning_type: DEFAULT_WOON_TYPE,
    huur: AVG_HUUR,
    woz: AVG_WOZ,
    rente: AVG_RENTE,
  };
}

function wonenNavigatieNaarJson(queryParams: any[]): WonenType {
  const len = lengte(queryParams);
  let wonen: WonenType = standaardWonen();

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
export function standardVisualisatie(): VisualisatieType {
  return {
    type: VisualisatieTypeType.G,
    jaar: JAAR,
    periode: PeriodeType.JAAR,
    van_tot: [10000, 100000],
    stap: 100,
    arbeidsInkomen: 0,
    svt: SalarisVerhogingType.P,
    sv_p: 3,
    sv_abs: 1000,
  };
}

// visualisatie=<type>;<jaar>;<periode>;<start>;<eind>;<stap>;<md type>;<md getal>;<arbeidsinkomen>

function visualisatieNavigatieNaarJson(p: any): VisualisatieType {
  let vis: VisualisatieType = standardVisualisatie();
  let orgLength8: boolean = lengte(p) == 8;

  if (orgLength8) {
    vis.type = p[0] as VisualisatieTypeType;
    p.shift();
  }
  if (orgLength8 || lengte(p) == 6) {
    vis.jaar = p[0];
    p.shift();
  }
  if (lengte(p) < 5) {
    return {} as VisualisatieType;
  }
  vis.periode = p[0];
  vis.van_tot = p[1];
  if (orgLength8) {
    vis.stap = p[2];
    p.shift();
  }
  vis.svt = p[2];
  if (vis.svt == SalarisVerhogingType.A) {
    vis.sv_abs = p[3];
  } else {
    vis.sv_p = p[3];
  }
  vis.arbeidsInkomen = p[4];
  return vis;
}

export function navigatieNaarJson(query: NavigatieType): InvoerGegevensType {
  let basis: InvoerGegevensType = {
    // Als oude code "eb" gebruikt is, vervang door nieuwe "bd".
    tab: (query?.tab == "eb" ? "bd" : query?.tab) || "intro",
    personen: [standaardPersoon()],
    wonen: standaardWonen(),
    visualisatie: standardVisualisatie(),
  };
  copyNavigatieNaarJson(query?.p, basis.personen, personenNavigatieNaarJson);
  copyNavigatieNaarJson(query?.w, basis.wonen, wonenNavigatieNaarJson);
  copyNavigatieNaarJson(query?.v || query?.grafiek, basis.visualisatie, visualisatieNavigatieNaarJson);
  return basis;
}

// --------------------------------------------------

// p=<leeftijd>;<leeftijd>[(,<bruto_inkomen>)|,P<percentage>)]

function persoonJsonNaarNavigatie(persoon: PersoonType) {
  const alsVoegToe = (n: number, p: string) => (!n || n === 0 ? "" : p + n);

  return (
    persoon.leeftijd +
    (persoon.inkomen_type == InkomenType.PERCENTAGE
      ? ",P" + alsVoegToe(persoon.percentage, "")
      : alsVoegToe(persoon.bruto_inkomen, ","))
  );
}

function personenJsonNaarNavigatie(personen: PersoonType[]): string[] {
  return personen.map(persoonJsonNaarNavigatie);
}

// w=huur;<huur>
// w=koop;<woz>;<rente>

function wonenJsonNaarNavigatie(wonen: WonenType): any[] {
  let nav: any[] = [wonen.woning_type];
  if (wonen.woning_type == "koop") {
    nav.push(wonen.woz);
    nav.push(wonen.rente);
  } else {
    nav.push(wonen.huur);
  }
  return nav;
}

function visualisatieJsonNaarNavigatie(vis: VisualisatieType): any[] {
  let sv = vis.svt == SalarisVerhogingType.A ? vis.sv_abs : vis.sv_p;
  return [vis.type, vis.jaar, vis.periode, vis.van_tot, vis.stap, vis.svt, sv, vis.arbeidsInkomen];
}

export function jsonNaarNavigatie(json: InvoerGegevensType): NavigatieType {
  return {
    tab: json.tab,
    p: jsonArrayNaarNavigatie(personenJsonNaarNavigatie(json.personen)),
    w: jsonArrayNaarNavigatie(wonenJsonNaarNavigatie(json.wonen)),
    v: jsonArrayNaarNavigatie(visualisatieJsonNaarNavigatie(json.visualisatie)),
  };
}

export default {
  JAAR,
  JAREN,
  standaardPersoon,
  navigatieNaarJson,
  jsonNaarNavigatie,
};
