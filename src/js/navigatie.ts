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

const KEY_VALUE_SPLIT: string = ";";

function toNumber(v: any): number {
  return Number.isNaN(v * 1) ? v : v * 1;
}

function toJsonArray(q: any) {
  let a = typeof q === "string" ? q.split(",").map((b) => toNumber(b)) : [q];

  return a.length == 1 ? toNumber(q) : a;
}

function splitParam(queryParam: string | any): string {
  let a: string[] | any = queryParam
    ? queryParam.split(KEY_VALUE_SPLIT)
    : queryParam;

  return a ? a.map(toJsonArray) : a;
}

function copyNavigatieToJson(from, to, functionNavToJson: (any) => any) {
  Object.entries(functionNavToJson(splitParam(from))).forEach(
    (a) => (to[a[0]] = toJsonArray(a[1]))
  );
}

// -------------------

function jsonArrayToNavigatie(jsonArray: string[]): string {
  return jsonArray.join(KEY_VALUE_SPLIT);
}

export default {
  splitParam,
  copyNavigatieToJson,
  jsonArrayToNavigatie,
};
