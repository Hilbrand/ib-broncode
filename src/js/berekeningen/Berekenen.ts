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
import functies from "../functies.js";
import hra from "../belasting/hypotheekrente_aftrek.js";
import iack from "../belasting/inkomensafhankelijke_combinatiekorting";
import inkomen from "../belasting/inkomen";
import kbs from "../belasting/kinderbijslag";
import kgb from "../belasting/kindgebonden_budget";
import {
  BerekenInvoerType,
  BerekenResultaatType,
  GrafiekType,
  LeeftijdType,
  PeriodeType,
  PersoonType,
  WonenType,
  WoningType,
} from "../../types";
import { Legenda } from "../grafieken/Legenda";

export class Berekenen {
  vis: GrafiekType;
  personen: PersoonType[];
  wonen: WonenType;
  algemeneGegevens: BerekenInvoerType;
  factor: number;
  legenda: any;

  constructor(vis: GrafiekType, personen: PersoonType[], wonen: WonenType) {
    this.vis = vis;
    this.personen = personen;
    this.wonen = wonen;
    this.algemeneGegevens = this.berekenAlgemeneGegevens(
      vis.jaar,
      personen,
      wonen
    );
    this.factor = functies.factorBerekening(vis.periode);
  }

  getLegenda(): Legenda {
    if (this.legenda === undefined) {
      this.legenda = this.createLegenda();
    }
    return this.legenda;
  }

  createLegenda(): Legenda {}

  getYDomain(): number[] {
    return [0, this.vis.van_tot[1]];
  }

  getAlgemeneGegevens(): BerekenInvoerType {
    return this.algemeneGegevens;
  }

  getFactor(): number {
    return this.factor;
  }

  berekenAlgemeneGegevens(
    jaar: number,
    personen: PersoonType[],
    wonen: WonenType
  ): BerekenInvoerType {
    let toeslagenpartner = functies.toeslagenPartner(personen);
    let aow = functies.aow(personen);
    let huren = functies.isHuur(wonen);

    return {
      toeslagenpartner: toeslagenpartner,
      aow: aow,
      iacbInkomen: iack.bepaalLaagsteArbeidsInkomenAnderen(personen),
      kinderbijslag: kbs.kinderbijslag(jaar, personen),
      maxKindgebondenBudget: kgb.maxKindgebondenBudget(
        jaar,
        personen,
        toeslagenpartner
      ),
      //nk: inkomen.nettoKortingenInkomens(personen),
      huren: huren,
      hypotheekRenteAftrek: huren
        ? 0
        : hra.hypotheekRenteAftrek(jaar, wonen.rente, wonen.woz),
    };
  }

  /**
   *
   * @param arbeidsInkomen jaar arbeidsinkomen
   */
  bereken(arbeidsInkomen: number): BerekenResultaatType {
    return null;
  }

  afronden(getal: number, factor: number): number {
    return +(getal * factor).toFixed(2);
  }

  /**
   * Zet de gegevens om in het formaat dat de grafiek gebruikt.
   *
   * @param {*} alles map object waarin de berekende gegevens moeten worden opgeslagen
   * @param {*} gegevens gegevens die moeten worden opgeslagen
   * @param {number} id id waaronder deze gegevens in het alles object moeten worden opgeslagen
   */
  verzamelGrafiekSeries(alles, gegevens, id: number) {}
}
