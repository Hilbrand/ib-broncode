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

import functies from "../functies";
import { BerekenResultaatType, InvoerGegevensType, WoningType } from "../types";

export class VergelijkBerekening {
  gegevens: InvoerGegevensType;

  constructor(gegevens: InvoerGegevensType) {
    this.gegevens = gegevens;
  }

  delta(getal1: number | undefined, getal2: number | undefined): number {
    const Δ = getal2 - getal1;

    return isNaN(Δ) ? 0 : Δ;
  }

  vergelijk(berekening1: BerekenResultaatType, berekening2: BerekenResultaatType): BerekenResultaatType {
    const Δbrutoloon = this.delta(berekening1.brutoloon, berekening2.brutoloon);
    const ΔibBox1 = this.delta(berekening2.ibBox1, berekening1.ibBox1);

    const ΔhraMax = this.delta(berekening1.hraMax, berekening2.hraMax);

    const Δak = this.delta(berekening1.ak, berekening2.ak);
    const ΔakMax = this.delta(berekening1.akMax, berekening2.akMax);

    const Δiack = this.delta(berekening1.iack, berekening2.iack);
    const ΔiackMax = this.delta(berekening1.iackMax, berekening2.iackMax);

    const Δahk = this.delta(berekening1.ahk, berekening2.ahk);
    const ΔahkMax = this.delta(berekening1.ahkMax, berekening2.ahkMax);
    const Δnvzk = this.delta(berekening2.nvzk, berekening1.nvzk);

    const Δzt = this.delta(berekening1.zt, berekening2.zt);
    const Δwonen = this.delta(berekening1.wonen, berekening2.wonen);
    const Δkb = this.delta(berekening1.kb, berekening2.kb);
    const Δkgb = this.delta(berekening1.kgb, berekening2.kgb);

    const Δnettoloon = berekening2.nettoloon - berekening1.nettoloon;
    const ΔnettoInkomen = this.delta(berekening1.nettoInkomen, berekening2.nettoInkomen);
    const Δhuurtoeslag = this.gegevens.wonen.woning_type === WoningType.HUUR ? Δwonen : 0;

    const ΔnettoArbeidsinkomen = Δnettoloon + (Δzt + Δhuurtoeslag + Δkb + Δkgb);

    const ΔnettoloonBelasting = this.delta(berekening1.nettoloonBelasting, berekening2.nettoloonBelasting);
    // Als toonNegatieveGetallen dan trek positieve kortingen van loonbelasting af omdat inverse geen positieve
    // bedragen toont wordt dit verrekend met de te betalen belasting. In de legenda zijn positieve
    // bedragen ook niet te zien. Maar wel als de tabel wordt getoond.
    const ΔnettoloonBelastingGrafiek = functies.negatiefIsNul(
      ΔnettoloonBelasting +
        functies.positiefIsNul(Δahk) +
        functies.positiefIsNul(Δak) +
        functies.positiefIsNul(Δiack) +
        functies.positiefIsNul(Δnvzk)
    );

    return {
      brutoloon: Δbrutoloon,
      arbeidsinkomen: this.delta(berekening1.arbeidsinkomen, berekening2.arbeidsinkomen),
      toetsingsInkomen: this.delta(berekening1.toetsingsInkomen, berekening2.toetsingsInkomen),
      pensioenPremie: this.delta(berekening2.pensioenPremie, berekening1.pensioenPremie),
      ibBox1: ΔibBox1,
      nettoloonBelasting: 0 + -ΔnettoloonBelasting,
      nettoloonBelastingGrafiek: 0 + -ΔnettoloonBelastingGrafiek,
      nettoInkomen: ΔnettoInkomen,
      nettoArbeidsinkomen: ΔnettoArbeidsinkomen,
      nettoloon: Δnettoloon,

      hraMax: ΔhraMax,
      ak: Δak,
      akMax: ΔakMax,
      iack: Δiack,
      iackMax: ΔiackMax,
      // effectieve ahk
      ahk: Δahk - functies.positiefIsNul(Δnvzk),
      ahkMax: ΔahkMax,
      nvzk: Δnvzk,

      zt: Δzt,
      woningType: berekening1.woningType,
      wonen: Δwonen,
      kb: Δkb,
      kgb: Δkgb,
    } as BerekenResultaatType;
  }
}
