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
  PD2026: {
    // Kindgebonden budget
    // https://www.rijksfinancien.nl/memorie-van-toelichting/2027/OWB/XV
    TslgTP: 8.05,
    DrempelinkomenKGB: 30910,
    VerhoogdDrempelInkomen: 9650, // 40.560
    Kind1: 2653,
    kindVolgend: 2653,
    VH12Plus: 729,
    VH16Plus: 976,
    VHgeenTP: 3505,
    // afbouwpercentage voor ouders met een toetsingsinkomen
    afhInk: 61917,
    //afbouwfactor: 0.9005, // factor is: 0.0995,
    // Zorgtoeslag
    Drempel: 29736,
    BDA: 0.1373,
    BDMT: 0.1373,
    MaxAlleen: 1631, //  2119(SP) - 0.01912 (TDA) * 29736(Drempel)
    MaxPartner: 3123, // 2119 * 2 - 0.04289 (TDMT) * 29736
  },
  2026: {
    // Kindgebonden budget
    TslgTP: 7.6,
    DrempelinkomenKGB: 29736,
    VerhoogdDrempelInkomen: 9405,
    Kind1: 2580,
    kindVolgend: 2580,
    VH12Plus: 724,
    VH16Plus: 964,
    VHgeenTP: 3416,
    // Zorgtoeslag
    Drempel: 29736,
    BDA: 0.1373,
    BDMT: 0.1373,
    MaxAlleen: 1631, //  2119(SP) - 0.01912 (TDA) * 29736(Drempel)
    MaxPartner: 3123, // 2119 * 2 - 0.04289 (TDMT) * 29736
  },
  2025: {
    // Kindgebonden budget
    TslgTP: 7.1,
    DrempelinkomenKGB: 28406,
    VerhoogdDrempelInkomen: 9138,
    Kind1: 2511,
    kindVolgend: 2511,
    VH12Plus: 703,
    VH16Plus: 936,
    VHgeenTP: 3389,
    // Zorgtoeslag
    Drempel: 28406,
    BDA: 0.137,
    BDMT: 0.137,
    MaxAlleen: 1555,
    MaxPartner: 2974,
  },
  PD2025: {
    // Kindgebonden budget
    TslgTP: 7.1,
    DrempelinkomenKGB: 28406,
    VerhoogdDrempelInkomen: 9138,
    Kind1: 2512,
    kindVolgend: 2512,
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
    Kind1: 2436,
    kindVolgend: 2436,
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
    Kind1: 1653,
    kindVolgend: 1532,
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
  PD2026: {
    MaxHuur: 932.93,
    AftopA: 713.02,
    AftopB: 764.14,
    KwKrtGrns: 498.2,
    AfbPercEPH: 0.27,
    AfbPercMPH: 0.22,
  },
  2026: {
    MaxHuur: 932.93,
    AftopA: 713.02,
    AftopB: 764.14,
    KwKrtGrns: 498.2,
    AfbPercEPH: 0.27,
    AfbPercMPH: 0.22,
  },
  2025: {
    MaxHuur: 900.07,
    AftopA: 682.96,
    AftopB: 731.93,
    KwKrtGrns: 477.2,
  },
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
  PD2026: {
    EPH: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 23425,
      TaakStBedr: -48.15,
      MinNrmHr: 250.67,
    },
    EPHAOW: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 23425,
      TaakStBedr: -48.15,
      MinNrmHr: 250.67,
    },
    MPH: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 31500,
      TaakStBedr: -48.15,
      MinNrmHr: 248.86,
    },
    MPHAOW: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 31500,
      TaakStBedr: -48.15,
      MinNrmHr: 248.86,
    },
  },
  2026: {
    EPH: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 23425,
      TaakStBedr: -48.15,
      MinNrmHr: 250.67,
    },
    EPHAOW: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 23425,
      TaakStBedr: -48.15,
      MinNrmHr: 250.67,
    },
    MPH: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 31500,
      TaakStBedr: -48.15,
      MinNrmHr: 248.86,
    },
    MPHAOW: {
      "Factor a": 0,
      "Factor b": 0,
      MinInkGr: 31500,
      TaakStBedr: -48.15,
      MinNrmHr: 248.86,
    },
  },
  2025: {
    EPH: {
      "Factor a": 4.38698e-7,
      "Factor b": 0.000446392665,
      MinInkGr: 22700,
      TaakStBedr: -37.14,
      MinNrmHr: 236.19,
    },
    EPHAOW: {
      "Factor a": 4.38698e-7,
      "Factor b": 0.000446392665,
      MinInkGr: 22700,
      TaakStBedr: -37.14,
      MinNrmHr: 236.19,
    },
    MPH: {
      "Factor a": 2.98184e-7,
      "Factor b": -0.001382497146,
      MinInkGr: 30450,
      TaakStBedr: -37.14,
      MinNrmHr: 234.38,
    },
    MPHAOW: {
      "Factor a": 2.98184e-7,
      "Factor b": -0.001382497146,
      MinInkGr: 30450,
      TaakStBedr: -37.14,
      MinNrmHr: 234.38,
    },
  },
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
      TaakStBedr: -37.72,
      MinNrmHr: 226.67,
    },
    EPHAOW: {
      "Factor a": 5.59775e-7,
      "Factor b": -0.002120192534,
      MinInkGr: 22025,
      TaakStBedr: -37.72,
      MinNrmHr: 224.85,
    },
    MPH: {
      "Factor a": 2.4449e-7,
      "Factor b": 0.001807837711,
      MinInkGr: 26975,
      TaakStBedr: -37.72,
      MinNrmHr: 226.67,
    },
    MPHAOW: {
      "Factor a": 3.63503e-7,
      "Factor b": -0.003053924481,
      MinInkGr: 29325,
      TaakStBedr: -37.72,
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
// https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/inkomensafhankelijke_combikorting/inkomensafhankelijke-combinatiekorting-2025
const IACK = {
  PD2026: {
    H: {
      MinAInk: 6086,
      InkKorting: 0.1145,
      MaxInkAfKrt: 2918,
    },
    HAOW: {
      MinAInk: 6086,
      InkKorting: 0.0572,
      MaxInkAfKrt: 1513,
    },
  },
  2026: {
    H: {
      MinAInk: 6239,
      InkKorting: 0.1145,
      MaxInkAfKrt: 3032,
    },
    HAOW: {
      MinAInk: 6239,
      InkKorting: 0.0572,
      MaxInkAfKrt: 1513,
    },
  },
  2025: {
    H: {
      MinAInk: 6146,
      InkKorting: 0.1145,
      MaxInkAfKrt: 2986,
    },
    HAOW: {
      MinAInk: 5548,
      InkKorting: 0.0573,
      MaxInkAfKrt: 1495,
    },
  },
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

// Kinderbijslag per kwartaal
// https://www.svb.nl/nl/kinderbijslag/bedragen-betaaldagen/bedragen-kinderbijslag
const KBS = {
  PD2026: {
    K05: 291.49,
    K611: 353.95,
    K1217: 416.41,
  },
  2026: {
    K05: 291.49,
    K611: 353.95,
    K1217: 416.41,
  },
  2025: {
    K05: 286.45,
    K611: 347.83,
    K1217: 409.21,
  },
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
// https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait
const EWF = {
  PD2026: {
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
        woz: { van: 75000, tm: 1360000 },
        factor: 0.0035,
      },
      {
        woz: { van: 1360000, tm: Number.MAX_VALUE },
        minimum: 4725,
        factor: 0.0235,
      },
    ],
  },
  2026: {
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
        woz: { van: 75000, tm: 1350000 },
        factor: 0.0035,
      },
      {
        woz: { van: 1350000, tm: Number.MAX_VALUE },
        minimum: 4725,
        factor: 0.0235,
      },
    ],
  },
  2025: {
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
        woz: { van: 1330000, tm: Number.MAX_VALUE },
        minimum: 4655,
        factor: 0.0235,
      },
    ],
  },
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
        woz: { van: 1330000, tm: Number.MAX_VALUE },
        minimum: 4655,
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
  // https://www.rijksfinancien.nl/sites/default/files/bestanden/belastingplan-2027/pakket-belastingplan-2027/fiscale-sleuteltabel-2027.pdf
  PD2026: {
    V: [
      {
        inkomen: { van: 0, tot: 30910 },
        maximaal: 3153,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 30910, tot: 78426 },
        maximaal: 3153,
        afbouwpunt: 30910,
        afbouwfactor: 0.06398,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 30910 },
        maximaal: 1576,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 30910, tot: 78426 },
        maximaal: 1576,
        afbouwpunt: 30910,
        afbouwfactor: 0.03195,
      },
    ],
  },
  2026: {
    V: [
      {
        inkomen: { tot: 29736 },
        maximaal: 3115,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { tot: 78426 },
        maximaal: 3115,
        afbouwpunt: 29736,
        afbouwfactor: 0.06398,
      },
    ],
    AOW: [
      {
        inkomen: { tot: 29736 },
        maximaal: 1556,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { tot: 78426 },
        maximaal: 1556,
        afbouwpunt: 29736,
        afbouwfactor: 0.03195,
      },
    ],
  },
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2025
  2025: {
    V: [
      {
        inkomen: { van: 0, tot: 28407 },
        maximaal: 3068,
        afbouwpunt: 0,
        afbouwfactor: 0,
      },
      {
        inkomen: { van: 28407, tot: 76818 },
        maximaal: 3068,
        afbouwpunt: 28406,
        afbouwfactor: 0.06337,
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
        inkomen: { van: 28407, tot: 76818 },
        maximaal: 1536,
        afbouwpunt: 28406,
        afbouwfactor: 0.0317,
      },
    ],
  },
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
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2024
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
  // https://www.rijksfinancien.nl/sites/default/files/bestanden/belastingplan-2027/pakket-belastingplan-2027/fiscale-sleuteltabel-2027.pdf
  PD2026: {
    V: [
      {
        inkomen: { tot: 11965 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08324,
      },
      {
        inkomen: { tot: 25845 },
        grens: 1182,
        afbouwpunt: 11965,
        afbouwfactor: 0.31009,
      },
      {
        inkomen: { tot: 45592 },
        grens: 5540,
        afbouwpunt: 25845,
        afbouwfactor: 0.0195,
      },
      {
        inkomen: { tot: 132920 },
        grens: 5929,
        afbouwpunt: 47834,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { tot: 11965 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04156,
      },
      {
        inkomen: { tot: 25845 },
        grens: 591,
        afbouwpunt: 11965,
        afbouwfactor: 0.15483,
      },
      {
        inkomen: { tot: 45592 },
        grens: 2770,
        afbouwpunt: 25845,
        afbouwfactor: 0.00974,
      },
      {
        inkomen: { tot: 132920 },
        grens: 2964,
        afbouwpunt: 47834,
        afbouwfactor: -0.0325,
      },
    ],
  },
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026
  2026: {
    V: [
      {
        inkomen: { tot: 11965 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08324,
      },
      {
        inkomen: { tot: 25845 },
        grens: 996,
        afbouwpunt: 11965,
        afbouwfactor: 0.31009,
      },
      {
        inkomen: { tot: 45592 },
        grens: 5300,
        afbouwpunt: 25845,
        afbouwfactor: 0.0195,
      },
      {
        inkomen: { tot: 132920 },
        grens: 5685,
        afbouwpunt: 45592,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { tot: 11965 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04156,
      },
      {
        inkomen: { tot: 25845 },
        grens: 498,
        afbouwpunt: 11965,
        afbouwfactor: 0.15483,
      },
      {
        inkomen: { tot: 45592 },
        grens: 2647,
        afbouwpunt: 25845,
        afbouwfactor: 0.00974,
      },
      {
        inkomen: { tot: 132920 },
        grens: 2840,
        afbouwpunt: 45592,
        afbouwfactor: -0.0325,
      },
    ],
  },
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2025
  2025: {
    V: [
      {
        inkomen: { tot: 12169 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.08053,
      },
      {
        inkomen: { tot: 26288 },
        grens: 980,
        afbouwpunt: 12169,
        afbouwfactor: 0.3003,
      },
      {
        inkomen: { tot: 43071 },
        grens: 5220,
        afbouwpunt: 26288,
        afbouwfactor: 0.02258,
      },
      {
        inkomen: { tot: 129078 },
        grens: 5599,
        afbouwpunt: 43071,
        afbouwfactor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { tot: 12169 },
        grens: 0,
        afbouwpunt: 0,
        afbouwfactor: 0.04029,
      },
      {
        inkomen: { tot: 26288 },
        grens: 491,
        afbouwpunt: 12169,
        afbouwfactor: 0.15023,
      },
      {
        inkomen: { tot: 43071 },
        grens: 2612,
        afbouwpunt: 26288,
        afbouwfactor: 0.0113,
      },
      {
        inkomen: { tot: 129078 },
        grens: 2802,
        afbouwpunt: 43071,
        afbouwfactor: -0.03257,
      },
    ],
  },
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
        grens: 980,
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
  // https://open.overheid.nl/documenten/dbc8b701-05db-4f38-a3fb-ea0747e34d40/file
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2024
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
  // https://www.rijksfinancien.nl/sites/default/files/bestanden/belastingplan-2027/pakket-belastingplan-2027/fiscale-sleuteltabel-2027.pdf
  PD2026: {
    V: [
      {
        // 2e schrijf
        tot: 39247,
        // 8.17 + AOW 17.9 + Anw 0.1 + Wlz 9.65
        percentage: 0.3623,
      },
      {
        // 3e schrijf
        vanaf: 39247,
        tot: 78426,
        percentage: 0.3816,
      },
      {
        // 4e schijf
        vanaf: 78426,
        percentage: 0.495,
      },
    ],
    AOW: [
      {
        tot: 41637,
        // 8.17 +  Anw 0.1 + Wlz 9.65
        percentage: 0.1785,
      },
      {
        vanaf: 41637,
        tot: 78426,
        percentage: 0.3756,
      },
      {
        vanaf: 78426,
        percentage: 0.495,
      },
    ],
  },
  2026: {
    // https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen
    V: [
      {
        // 2e schrijf
        tot: 38883,
        // 8.17 + AOW 17.9 + Anw 0.1 + Wlz 9.65
        percentage: 0.3575,
      },
      {
        // 3e schrijf
        vanaf: 38883,
        tot: 78426,
        percentage: 0.3756,
      },
      {
        // 4e schijf
        vanaf: 78426,
        percentage: 0.495,
      },
    ],
    AOW: [
      {
        tot: 41123,
        // 8.17 +  Anw 0.1 + Wlz 9.65
        percentage: 0.1785,
      },
      {
        vanaf: 41123,
        tot: 78426,
        percentage: 0.3756,
      },
      {
        vanaf: 78426,
        percentage: 0.495,
      },
    ],
  },
  2025: {
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
        tot: 76817,
        percentage: 0.3748,
      },
      {
        // 4e schijf
        vanaf: 76817,
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
        vanaf: 76817,
        percentage: 0.495,
      },
    ],
  },
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
        vanaf: 76817,
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

// Wet minimum loon

const WML = {
  PD2026: 31530.76, // + 7.5%
  2026: 29330.94, // 14,71 per/uur
  2025: 28712.82,
  PD2025: 28712.82,
  2024: 27235.38,
  2023: 23940,
};

const BALKENENDENORM = 223000;
const AVG_HUUR = {
  PD2026: 772,
  2026: 750,
  2025: 710,
  PD2025: 710,
  2024: 674,
  2023: 600,
};
// https://www.cbs.nl/nl-nl/nieuws/2025/25/gemiddelde-woz-waarde-woningen-5-procent-hoger
const AVG_WOZ = 398000;
const AVG_RENTE = AVG_WOZ * 0.0369;

export default {
  TABEL: TABEL,
  HT: HT,
  HTBP: HTBP,
  IACK: IACK,
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
  WML,
};
// https://www.rijksfinancien.nl/belastingplan-2027
