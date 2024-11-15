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

import { InkomenType, InvoerGegevensType, LeeftijdTekstType, LeeftijdType, PersoonType, WoningType } from "./types";
import functies, { heeftInkomen } from "./functies";

const TEKST_GETALLEN = {
  1: "een",
  2: "twee",
  3: "drie",
  4: "vier",
  5: "vijf",
  6: "zes",
  7: "zeven",
  8: "acht",
  9: "negen",
};

function tekstGetal(getal: number): string {
  return TEKST_GETALLEN[getal];
}

function tekstKindTekst(aantal: number): string {
  return aantal == 1 ? "kind" : "kinderen";
}

function tekstKinderen(personen: PersoonType[], leeftijd: LeeftijdType) {
  const aantal = functies.telPersonen(personen, leeftijd);
  const tekstKinderen = tekstKindTekst(aantal);
  return aantal == 0 ? "" : tekstGetal(aantal) + " " + tekstKinderen + " tussen " + LeeftijdTekstType[leeftijd];
}

export function tekstVerdiener(persoon: PersoonType, personen: PersoonType[], tussenTekst: string = ""): string {
  if (personen.filter((_) => heeftInkomen(_) && _.inkomen_type === InkomenType.BRUTO).length > 0) {
    return "";
  }
  const percentagePersonen = personen.filter((_) => heeftInkomen(_) && _.inkomen_type === InkomenType.PERCENTAGE);
  const maxPercentage = percentagePersonen.reduce(
    (max, _) => (_.percentage > max.percentage ? _ : max),
    percentagePersonen[0]
  );
  const minPercentage = percentagePersonen.reduce(
    (min, _) => (_.percentage < min.percentage ? _ : min),
    percentagePersonen[0]
  );

  if (persoon === undefined) {
    if (maxPercentage?.percentage < 100) {
      return "meest" + tussenTekst + "verdiener";
    } else if (maxPercentage?.percentage > 100) {
      return "minst" + tussenTekst + "verdiener";
    } else {
      return "";
    }
  } else if (persoon.percentage === maxPercentage.percentage && persoon.percentage > 100) {
    return "meest" + tussenTekst + "verdiener";
  } else if (persoon.percentage === minPercentage.percentage && persoon.percentage < 100) {
    return "minst" + tussenTekst + "verdiener";
  }
  return "";
}

export function maakSamenvatting(gegevens: InvoerGegevensType): string {
  let tekst = "";

  if (functies.toeslagenPartner(gegevens.personen)) {
    if (functies.eenVerdiener(gegevens.personen)) {
      tekst += "Eenverdiener";
    } else {
      let verdiener = tekstVerdiener(undefined, gegevens.personen);
      tekst += verdiener === "" ? "Meerdere verdieners" : verdiener.charAt(0).toUpperCase() + verdiener.slice(1);
    }
  } else {
    tekst += "Alleenstaande";
  }
  tekst += " ";
  if (gegevens.personen[0].leeftijd == LeeftijdType.AOW) {
    tekst += "in the AOW ";
  }
  if (functies.telKinderen(gegevens.personen) > 0) {
    tekst +=
      "met " +
      [LeeftijdType.K05, LeeftijdType.K611, LeeftijdType.K1215, LeeftijdType.K1617]
        .map((lt) => tekstKinderen(gegevens.personen, lt))
        .filter((s) => s !== "")
        .join(" en ");
  }

  if (functies.isHuur(gegevens.wonen)) {
    tekst += ", maandelijkse huur &euro; " + gegevens.wonen.huur;
  } else if (gegevens.wonen.woning_type == WoningType.KOOP) {
    tekst +=
      ", jaarlijkse hypotheek rente &euro; " +
      gegevens.wonen.rente +
      " voor een huis met WOZ-waarde: &euro; " +
      gegevens.wonen.woz;
  }
  return tekst;
}

export function maakBestandsnaam(gegevens: InvoerGegevensType): string {
  let tekst = gegevens.tab;
  if (functies.toeslagenPartner(gegevens.personen)) {
    if (functies.eenVerdiener(gegevens.personen)) {
      tekst += "-eenverdiener-";
    } else {
      let verdiener = tekstVerdiener(undefined, gegevens.personen);
      tekst += "-" + (verdiener === "" ? "meerdereverdieners" : verdiener) + "-";
    }
  } else {
    tekst += "-alleenstaande-";
  }
  const aantalKinderen = functies.telKinderen(gegevens.personen);
  if (aantalKinderen > 0) {
    tekst += tekstKindTekst(aantalKinderen) + "-";
  }
  tekst += functies.isHuur(gegevens.wonen) ? "huurwoning" : "koopwoning";
  return tekst;
}

export default {
  maakBestandsnaam,
  maakSamenvatting,
  tekstVerdiener,
};
