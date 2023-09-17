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

import navigatie from "@/js/navigatie";

const DEFAULT_WOON_TYPE = "huur";
const AVG_HUUR = 600;
const AVG_WOZ = 315000;
const AVG_RENTE = AVG_WOZ * 0.0428;
const JAAR = 2023;
const JAREN = [2023]; //, 2024];

function lengte(a) {
  return (a && a.length) || 0;
}

function persoonNavigatieToJson(p) {
  let len = lengte(p);
  if (len == 0) {
    return {};
  }
  let json = { leeftijd: Array.isArray(p) ? p[0] : p };

  if (len == 2) {
    json.bruto_inkomen = p[1];
  }
  return json;
}

function personenNavigatieToJson(queryParams) {
  let len = lengte(queryParams);

  if (len == 0) {
    return {};
  }
  return queryParams.filter((p) => lengte(p) > 0).map(persoonNavigatieToJson);
}

function wonenNavigatieToJson(queryParams) {
  let len = lengte(queryParams);

  if (len == 0) {
    return { queryParams };
  }
  let wt = queryParams[0];
  if (wt == "huur" && len == 2) {
    return {
      woning_type: wt,
      huur: queryParams[1],
    };
  } else if (len == 3) {
    return {
      woning_type: wt,
      woz: queryParams[1],
      rente: queryParams[2],
    };
  } else {
    return {};
  }
}

function grafiekNavigatieToJson(p) {
  let jaar = JAAR;

  if (lengte(p) == 6) {
    jaar = p[0];
    p.shift();
  }
  if (lengte(p) != 5) {
    return {};
  }
  let json = {
    jaar: jaar,
    periode: p[0],
    van_tot: p[1],
    svt: p[2],
  };
  if (json.svt == "a") {
    json.sv_abs = p[3];
  } else {
    json.sv_p = p[3];
  }
  json.arbeidsInkomen = p[4];
  return json;
}

function navigatieToJson(query) {
  let basis = {
    tab: query.tab || "intro",
    // Personen
    personen: [{ leeftijd: "V" }],
    // Wonen
    wonen: {
      woning_type: DEFAULT_WOON_TYPE,
      huur: AVG_HUUR,
      woz: AVG_WOZ,
      rente: AVG_RENTE,
    },
    // Visualisatie instellingen
    grafiek: {
      jaar: JAAR,
      periode: "jaar",
      van_tot: [10000, 100000],
      arbeidsInkomen: 0,
      svt: "p",
      sv_p: 3,
      sv_abs: 1000,
    },
  };
  navigatie.copyNavigatieToJson(
    query.p,
    basis.personen,
    personenNavigatieToJson
  );
  navigatie.copyNavigatieToJson(query.w, basis.wonen, wonenNavigatieToJson);
  navigatie.copyNavigatieToJson(
    query.grafiek,
    basis.grafiek,
    grafiekNavigatieToJson
  );
  return basis;
}

// --------------------------------------------------

// p=<leeftijd>;<leeftijd>,<bruto_inkomen>

function personenJsonToNavigatie(json) {
  return json.map(
    (p) => p.leeftijd + (p.bruto_inkomen ? "," + p.bruto_inkomen : "")
  );
}

// w=huur;<huur>
// w=koop;<woz>;<rente>

function wonenJsonToNavigatie(json) {
  let nav = [json.woning_type];
  if (json.woning_type == "koop") {
    nav.push(json.woz);
    nav.push(json.rente);
  } else {
    nav.push(json.huur);
  }
  return nav;
}

function grafiekJsonToNavigatie(json) {
  let sv = json.svt == "a" ? json.sv_abs : json.sv_p;
  return [json.jaar, json.periode, json.van_tot, json.svt, sv, json.arbeidsInkomen];
}

function jsonToNavigatie(json) {
  return {
    tab: json.tab,
    p: navigatie.jsonArrayToNavigatie(personenJsonToNavigatie(json.personen)),
    w: navigatie.jsonArrayToNavigatie(wonenJsonToNavigatie(json.wonen)),
    grafiek: navigatie.jsonArrayToNavigatie(
      grafiekJsonToNavigatie(json.grafiek)
    ),
  };
}

export default {
  JAAR,
  JAREN,
  navigatieToJson,
  jsonToNavigatie,
};
