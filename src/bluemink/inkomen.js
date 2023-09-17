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

const ALGEMENE_HEFFINGS_KORTING = 2000;
const ARBEIDS_KORTING = [
  // bedrag = 0
  {
    tot: 6000,
    bedrag: 0,
  },
  // begrag = (ib - 7000) * 0.3 + 30
  {
    vanaf: 7000,
    tot: 27000,
    percentage: 0.15,
    offset: 30,
  },
  // bedrag = 3000
  {
    vanaf: 27000,
    bedrag: 3000,
  },
];

const IB = [
  {
    tot: 23000,
    percentage: 0.3,
  },
  {
    vanaf: 23000,
    tot: 41000,
    percentage: 0.35,
  },
  {
    vanaf: 41000,
    tot: 50000,
    percentage: 0.44,
  },
  {
    vanaf: 50000,
    tot: 70000,
    percentage: 0.48,
  },
  {
    vanaf: 70000,
    percentage: 0.52,
  },
];

function algemeneHeffingsKorting(jaar, toetsingsinkomen, maxBelasting, aow) {
  return ALGEMENE_HEFFINGS_KORTING;
}

function arbeidskorting(jaar, arbeidsinkomen, maxArbeidsinkomen, aow) {
  for (let p of ARBEIDS_KORTING) {
    if (
      arbeidsinkomen < (p.tot || Number.POSITIVE_INFINITY) &&
      arbeidsinkomen >= (p.vanaf || 0)
    ) {
      return typeof p.bedrag === "undefined"
        ? p.offset + (arbeidsinkomen - p.vanaf) * p.percentage
        : p.bedrag;
    }
  }
  return 0;
}

function ibRange(toetsingsInkomen, p) {
  let top = Math.min(p.tot || toetsingsInkomen, toetsingsInkomen);
  let range = Math.max(0, top - (p.vanaf || 0));

  return p.percentage * range;
}

function inkomstenBelasting(toetsingsInkomen, aow) {
  let ibTabel = IB;

  return Math.round(
    ibTabel.reduce((ib, p) => ib + ibRange(toetsingsInkomen, p), 0)
  );
}

function toeslagenToetsInkomen(toetsingsInkomen, personen) {
  return toetsingsInkomen;
}

export default {
  algemeneHeffingsKorting,
  arbeidskorting,
  inkomstenBelasting,
  toeslagenToetsInkomen,
};
