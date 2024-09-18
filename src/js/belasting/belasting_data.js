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
  Bron data overgenomen uit JavaScript van proefberekening toeslagen van Belastingdienst website:
  https://www.belastingdienst.nl/common/js/iah/proefberekening_toeslagen.js
*/

const TABEL = {
  PD2025: {
    // Kindgebonden budget
    TslgTP: 7.1,
    DrempelinkomenKGB: 28406,
    VerhoogdDrempelInkomen: 9138,
    Tslg: 7.1,
    VH12Plus: 703,
    VH16Plus: 936,
    VHgeenTP: 3390,
    // Zorgtoeslag
    Drempel: 28405.68,
    BDA: 0.137,
    BDMT: 0.137,
    MaxAlleen: 1555,
    MaxPartner: 2974,
  },
  2024: {
    // Kindgebonden budget
    TslgTP: 6.75,
    DrempelinkomenKGB: 26819,
    VerhoogdDrempelInkomen: 9030,
    Tslg: 6.75,
    VH12Plus: 694,
    VH16Plus: 924,
    VHgeenTP: 3480,
    // Zorgtoeslag
    SP: 1987,
    Drempel: 26819,
    TDA: 1.879,
    BDA: 0.1367,
    TDMT: 4.256,
    BDMT: 0.1367,
    MaxAlleen: 1483, //  1987(SP) - 0.01879 (TDA) * 26819(Drempel)
    MaxPartner: 2833, // 1987 * 2 - 4.256 (TDMT) * 26819
  },
  2023: {
    // Kindgebonden budget
    TslgTP: 6.75,
    DrempelinkomenKGB: 25070,
    VerhoogdDrempelInkomen: 18327,
    Tslg: 6.75,
    VH12Plus: 267,
    VH16Plus: 476,
    VHgeenTP: 3848,
    // Zorgtoeslag
    SP: 1889,
    Drempel: 25070,
    TDA: 0.123,
    BDA: 0.1364,
    TDMT: 2.378,
    BDMT: 0.1364,
    MaxAlleen: 1858, // 1889 - 0.00123 * 25070
    MaxPartner: 3181, // 1889 * 2 - 2.378 * 25070
  },
};

// Huurtoeslag

const HT = {
  PD2025: {
    MaxHuur: 911.33,
    AftopA: 694.57,
    AftopB: 744.38,
    KwKrtGrns: 485.32,
  },
  2024: {
    MaxHuur: 879.66,
    AftopA: 650.43,
    AftopB: 697.07,
    KwKrtGrns: 454.47,
  },
  2023: {
    MaxHuur: 808.06,
    AftopA: 647.19,
    AftopB: 693.6,
    KwKrtGrns: 452.2,
  },
};

// Huurtoeslag

const HTBP = {
  PD2025: {
    EPH: {
      "Factor a": 4.4982254096873e-7,
      "Factor b": 0.000372288232,
      MinInkGr: 22700,
      TaakStBedr: -37.72,
      // normhuur - 2,27
      MinNrmHr: 240.24,
    },
    EPHAOW: {
      "Factor a": 4.4842822975847e-7,
      "Factor b": 0.000403939096,
      MinInkGr: 22700,
      TaakStBedr: -37.14,
      MinNrmHr: 240.24,
    },
    MPH: {
      "Factor a": 3.0501823004512e-7,
      "Factor b": -0.00145759164,
      MinInkGr: 30450,
      TaakStBedr: -37.14,
      // normhuur - 4,54
      MinNrmHr: 238.43,
    },
    MPHAOW: {
      "Factor a": 3.0323657788089e-7,
      "Factor b": -0.001403340332,
      MinInkGr: 30450,
      TaakStBedr: -37.14,
      MinNrmHr: 238.43,
    },
  },
  2024: {
    EPH: {
      "Factor a": 4.1337e-7,
      "Factor b": 0.002393492603,
      MinInkGr: 20700,
      TaakStBedr: -34.67,
      MinNrmHr: 226.67,
    },
    EPHAOW: {
      "Factor a": 5.59775e-7,
      "Factor b": -0.002120192534,
      MinInkGr: 22025,
      TaakStBedr: -34.67,
      MinNrmHr: 224.85,
    },
    MPH: {
      "Factor a": 2.4449e-7,
      "Factor b": 0.001807837711,
      MinInkGr: 26975,
      TaakStBedr: -34.67,
      MinNrmHr: 226.67,
    },
    MPHAOW: {
      "Factor a": 3.63503e-7,
      "Factor b": -0.003053924481,
      MinInkGr: 29325,
      TaakStBedr: -34.67,
      MinNrmHr: 223.04,
    },
  },
  2023: {
    EPH: {
      "Factor a": 0.000000474433,
      "Factor b": 0.002448638402,
      MinInkGr: 19375,
      TaakStBedr: 0,
      MinNrmHr: 225.54,
    },
    EPHAOW: {
      "Factor a": 0.000000671404,
      "Factor b": -0.002850602044,
      MinInkGr: 20500,
      TaakStBedr: 0,
      MinNrmHr: 223.72,
    },
    MPH: {
      "Factor a": 0.000000279402,
      "Factor b": 0.001893212113,
      MinInkGr: 25225,
      TaakStBedr: 0,
      MinNrmHr: 225.54,
    },
    MPHAOW: {
      "Factor a": 0.000000430722,
      "Factor b": -0.003611907743,
      MinInkGr: 27275,
      TaakStBedr: 0,
      MinNrmHr: 221.91,
    },
  },
};

// Inkomsten afhankelijk combinatie korting

const IACK = {
  // https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen
  PD2025: {
    H: {
      MinAInk: 6146,
      InkKorting: 0.1145,
      MaxInkAfKrt: 2986,
    },
    HAOW: {
      MinAInk: 5548,
      InkKorting: 0.059,
      MaxInkAfKrt: 1389,
    },
  },
  2024: {
    H: {
      MinAInk: 6074,
      InkKorting: 0.1145,
      MaxInkAfKrt: 2950,
    },
    // 2024 nog gegevens van 2023
    HAOW: {
      MinAInk: 5548,
      InkKorting: 0.059,
      MaxInkAfKrt: 1389,
    },
  },
  2023: {
    H: {
      MinAInk: 5548,
      InkKorting: 0.1145,
      MaxInkAfKrt: 2694,
    },
    HAOW: {
      MinAInk: 5548,
      InkKorting: 0.059,
      MaxInkAfKrt: 1389,
    },
  },
};

// Maximum Kindgebonden budget

const MAXKGB = {
  PD2025: {
    1: 2512,
    2: 5024,
    3: 7536,
    4: 10048,
    5: 12560,
    6: 15072,
    7: 17584,
    8: 20096,
  },
  2024: {
    1: 2436,
    2: 4872,
    3: 7308,
    4: 9744,
    5: 12180,
    6: 14616,
    7: 17052,
    8: 19488,
  },
  2023: {
    1: 1653,
    2: 3185,
    3: 4717,
    4: 6249,
    5: 7781,
    6: 9313,
    7: 10845,
    8: 12377,
  },
};

// Kinderbijslag per kwartaal

const KBS = {
  PD2025: {
    K05: 291.7,
    K611: 354.24,
    K1217: 416.75,
  },
  // Kinderbijslag 2024 is vanaf 1 juli 2024
  2024: {
    K05: 281.69,
    K611: 342.05,
    K1217: 402.41,
  },
  2023: {
    K05: 261.7,
    K611: 317.77,
    K1217: 373.85,
  },
};

// Eigenwoningforfait

const EWF = {
  PD2025: {
    kSchuldFactor: 0.8001,
    ewf: [
      {
        woz: { van: 0, tm: 12500 },
        factor: 0,
      },
      {
        woz: { van: 12500, tm: 25000 },
        factor: 0.001,
      },
      {
        woz: { van: 25000, tm: 50000 },
        factor: 0.002,
      },
      {
        woz: { van: 50000, tm: 75000 },
        factor: 0.0025,
      },
      {
        woz: { van: 75000, tm: 1330000 },
        factor: 0.0035,
      },
      {
        woz: { van: 1200000, tm: Number.MAX_VALUE },
        minimum: 4200,
        factor: 0.0235,
      },
    ],
  },
  2024: {
    kSchuldFactor: 0.8001,
    ewf: [
      {
        woz: { van: 0, tm: 12500 },
        factor: 0,
      },
      {
        woz: { van: 12500, tm: 25000 },
        factor: 0.001,
      },
      {
        woz: { van: 25000, tm: 50000 },
        factor: 0.002,
      },
      {
        woz: { van: 50000, tm: 75000 },
        factor: 0.0025,
      },
      {
        woz: { van: 75000, tm: 1310000 },
        factor: 0.0035,
      },
      {
        woz: { van: 1200000, tm: Number.MAX_VALUE },
        minimum: 4200,
        factor: 0.0235,
      },
    ],
  },
  2023: {
    kSchuldFactor: 0.8333,
    ewf: [
      {
        woz: { van: 0, tm: 12500 },
        factor: 0,
      },
      {
        woz: { van: 12500, tm: 25000 },
        factor: 0.001,
      },
      {
        woz: { van: 25000, tm: 50000 },
        factor: 0.002,
      },
      {
        woz: { van: 50000, tm: 75000 },
        factor: 0.0025,
      },
      {
        woz: { van: 75000, tm: 1200000 },
        factor: 0.0035,
      },
      {
        woz: { van: 1200000, tm: Number.MAX_VALUE },
        minimum: 4200,
        factor: 0.0235,
      },
    ],
  },
};

// Algemene Heffingskorting

const AHK = {
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2024
  PD2025: {
    V: [
      {
        inkomen: { van: 0, tot: 28407 },
        maximaal: 3068,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 28407, tot: 76816 },
        maximaal: 3068,
        afbouwpunt: 28406,
        afbouwfactor: 0.06338,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 28407 },
        maximaal: 1536,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 28407, tot: 76816 },
        maximaal: 1536,
        afbouwpunt: 28406,
        afbouwfactor: 0.03173,
      },
    ],
  },
  2024: {
    V: [
      {
        inkomen: { van: 0, tot: 24813 },
        maximaal: 3362,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 24813, tot: 75518 },
        maximaal: 3362,
        afbouwpunt: 24812,
        afbouwfactor: 0.0663,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 24813 },
        maximaal: 1735,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 24813, tot: 75518 },
        maximaal: 1735,
        afbouwpunt: 24813,
        afbouwfactor: 0.03421,
      },
    ],
  },
  2023: {
    V: [
      {
        inkomen: { van: 0, tot: 22661 },
        maximaal: 3070,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 22661, tot: 73031 },
        maximaal: 3070,
        afbouwpunt: 22660,
        afbouwfactor: 0.06095,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 22661 },
        maximaal: 1583,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 22661, tot: 73031 },
        maximaal: 1583,
        afbouwpunt: 22660,
        afbouwfactor: 0.03141,
      },
    ],
  },
};

// Arbeidskorting

const AK = {
  // https://open.overheid.nl/documenten/dbc8b701-05db-4f38-a3fb-ea0747e34d40/file
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2024
  PD2025: {
    V: [
      {
        inkomen: { van: 0, tot: 12170 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08053,
      },
      {
        inkomen: { van: 12170, tot: 26289 },
        grens: 968,
        afbouwpunt: 12169,
        afbouwfactor: 0.3003,
      },
      {
        inkomen: { van: 26289, tot: 43072 },
        grens: 5220,
        afbouwpunt: 26288,
        afbouwfactor: 0.02258,
      },
      {
        inkomen: { van: 43072, tot: 124935 },
        grens: 5599,
        afbouwpunt: 43071,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 12170 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04035,
      },
      {
        inkomen: { van: 12170, tot: 26289 },
        grens: 491,
        afbouwpunt: 12169,
        afbouwfactor: 0.15022,
      },
      {
        inkomen: { van: 26289, tot: 42072 },
        grens: 2612,
        afbouwpunt: 26288,
        afbouwfactor: 0.01132,
      },
      {
        inkomen: { van: 42072, tot: 124935 },
        grens: 2802,
        afbouwpunt: 42071,
        afbouwfactor: -0.03258,
      },
    ],
  },
  2024: {
    V: [
      {
        inkomen: { van: 0, tot: 11491 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08245,
      },
      {
        inkomen: { van: 11491, tot: 24821 },
        grens: 968,
        afbouwpunt: 11490,
        afbouwfactor: 0.31433,
      },
      {
        inkomen: { van: 24821, tot: 39958 },
        grens: 5158,
        afbouwpunt: 24820,
        afbouwfactor: 0.02471,
      },
      {
        inkomen: { van: 39958, tot: 124935 },
        grens: 5532,
        afbouwpunt: 39957,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 11491 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04346,
      },
      {
        inkomen: { van: 11491, tot: 24821 },
        grens: 501,
        afbouwpunt: 11490,
        afbouwfactor: 0.16214,
      },
      {
        inkomen: { van: 24821, tot: 39958 },
        grens: 2662,
        afbouwpunt: 24820,
        afbouwfactor: 0.01275,
      },
      {
        inkomen: { van: 39958, tot: 124935 },
        grens: 2854,
        afbouwpunt: 39957,
        afbouwfactor: -0.03358,
      },
    ],
  },
  2023: {
    V: [
      {
        inkomen: { van: 0, tot: 10741 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08231,
      },
      {
        inkomen: { van: 10741, tot: 23201 },
        grens: 884,
        afbouwpunt: 10740,
        afbouwfactor: 0.29861,
      },
      {
        inkomen: { van: 23201, tot: 37691 },
        grens: 4605,
        afbouwpunt: 23200,
        afbouwfactor: 0.03085,
      },
      {
        inkomen: { van: 37691, tot: 115295 },
        grens: 5052,
        afbouwpunt: 37690,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 10728 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04241,
      },
      {
        inkomen: { van: 10728, tot: 23201 },
        grens: 457,
        afbouwpunt: 10727,
        afbouwfactor: 0.15388,
      },
      {
        inkomen: { van: 23201, tot: 37691 },
        grens: 2374,
        afbouwpunt: 23200,
        afbouwfactor: 0.01589,
      },
      {
        inkomen: { van: 37691, tot: 115295 },
        grens: 2604,
        afbouwpunt: 37690,
        afbouwfactor: -0.03355,
      },
    ],
  },
};

// AOW 1e schijf is inkomstenbelasting + volksverzekering premie.

const IB = {
  PD2025: {
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen
    V: [
      {
        // 2e schrijf
        tot: 38441,
        // 8.17 + AOW 17.9 + Anw 0.1 + Wlz 9.65
        percentage: 0.3582,
      },
      {
        // 3e schrijf
        vanaf: 38441,
        tot: 76816,
        percentage: 0.3748,
      },
      {
        // 4e schijf
        vanaf: 76816,
        percentage: 0.495,
      },
    ],
    AOW: [
      {
        tot: 40502,
        // 8.17 +  Anw 0.1 + Wlz 9.65
        percentage: 0.1792,
      },
      {
        vanaf: 40502,
        tot: 76817,
        percentage: 0.3748,
      },
      {
        vanaf: 76816,
        percentage: 0.495,
      },
    ],
  },
  2024: {
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen
    V: [
      {
        tot: 75518,
        // 9.32 + AOW 17.9 + Anw 0.1 + Wlz 9.65
        percentage: 0.3697,
      },
      {
        vanaf: 75518,
        percentage: 0.495,
      },
    ],
    AOW: [
      {
        tot: 40021,
        // 9.32 + Anw 0.1 + Wlz 9.65
        percentage: 0.1907,
      },
      {
        vanaf: 40021,
        tot: 75518,
        percentage: 0.3697,
      },
      {
        vanaf: 75518,
        percentage: 0.495,
      },
    ],
  },
  2023: {
    V: [
      {
        tot: 73031,
        percentage: 0.3693,
      },
      {
        vanaf: 73031,
        percentage: 0.495,
      },
    ],
    AOW: [
      {
        tot: 38703,
        percentage: 0.1903,
      },
      {
        vanaf: 38703,
        tot: 73031,
        percentage: 0.3693,
      },
      {
        vanaf: 73031,
        percentage: 0.495,
      },
    ],
  },
};

const LEEFTIJDEN = {
  K05: "Kind 0 t/m 5 Jaar",
  K611: "Kind 6 t/m 11 Jaar",
  K1215: "Kind 12 t/m 15 jaar",
  K1617: "16 of 17 jaar",
  V: "Volwassene",
  AOW: "AOW Leeftijd",
};

const BALKENENDENORM = 223000;
const AVG_HUUR = 600;
const AVG_WOZ = 315000;
const AVG_RENTE = AVG_WOZ * 0.0428;

export default {
  TABEL: TABEL,
  HT: HT,
  HTBP: HTBP,
  IACK: IACK,
  MAXKGB: MAXKGB,
  KBS: KBS,
  EWF: EWF,
  AHK: AHK,
  AK: AK,
  IB,
  LEEFTIJDEN: LEEFTIJDEN,
  BALKENENDENORM: BALKENENDENORM,
  AVG_HUUR,
  AVG_WOZ,
  AVG_RENTE,
};
