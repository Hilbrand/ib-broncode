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
Bron data overgenomen uit JavaScript van proefberekeing toeslagen van Belastingdienst website: 
  https://www.belastingdienst.nl/common/js/iah/proefberekening_toeslagen.js
*/

const TABEL = {
  2023: {
    Aanvraagdatum: "01-09-2022",
    HT: true,
    KGB: true,
    KOT: true,
    ZT: true,
    UitbetGrns: 24,
    HTjaar: "2023",
    HDCP: "Ja",
    Garage: false,
    Onderhuur: false,
    VrijHT65enkel: 33748,
    VrijHT65gez: 67496,
    TslgTP: 6.75,
    DrempelinkomenKGB: 25070,
    VerhoogdDrempelInkomen: 18327,
    Tslg: 6.75,
    OHGA: 0,
    IGTA: 0,
    IGUA: 0,
    OHGB: 0,
    IGTB: 0,
    IGUB: 0,
    VSVB: 0,
    WTOS: true,
    VH12Plus: 267,
    VH16Plus: 476,
    VHgeenTP: 3848,
    MaxUPDOKC: 8.97,
    MaxUPDOGO: 6.73,
    MaxUPBOKC: 7.72,
    MaxUPBOGO: 6.73,
    MaxUren: 230,
    WrkgvrBdr: "Nee",
    Middelen: "Nee",
    ETP: "Nee",
    OM: "Nee",
    WLF: "Ja",
    RepWlfT: "Ja",
    SP: 1889,
    Drempel: 25070,
    TDA: 0.123,
    BDA: 13.64,
    TDMT: 2.378,
    BDMT: 13.64,
    MxInk1: 38520,
    MxInk2: 48224,
    VrijZTKGB65enkel: 127582,
    VrijZTKGB65gez: 161329,
    ZT_norm_geldig: "ja",
  },
  2022: {
    Aanvraagdatum: "01-09-2021",
    HT: true,
    KGB: true,
    KOT: true,
    ZT: true,
    UitbetGrns: 24,
    HTjaar: "2022",
    HDCP: "Ja",
    Garage: false,
    Onderhuur: false,
    VrijHT65enkel: 31747,
    VrijHT65gez: 63494,
    TslgTP: 6.75,
    DrempelinkomenKGB: 22356,
    VerhoogdDrempelInkomen: 17240,
    Tslg: 6.75,
    OHGA: 0,
    IGTA: 0,
    IGUA: 0,
    OHGB: 0,
    IGTB: 0,
    IGUB: 0,
    VSVB: 0,
    WTOS: true,
    VH12Plus: 251,
    VH16Plus: 447,
    VHgeenTP: 3285,
    MaxUPDOKC: 8.5,
    MaxUPDOGO: 6.52,
    MaxUPBOKC: 7.31,
    MaxUPBOGO: 6.52,
    MaxUren: 230,
    WrkgvrBdr: "Nee",
    Middelen: "Nee",
    ETP: "Nee",
    OM: "Nee",
    WLF: "Ja",
    RepWlfT: "Ja",
    SP: 1749,
    Drempel: 22356,
    TDA: 1.848,
    BDA: 13.61,
    TDMT: 4.225,
    BDMT: 13.61,
    MxInk1: 31998,
    MxInk2: 40944,
    VrijZTKGB65enkel: 120020,
    VrijZTKGB65gez: 151767,
    ZT_norm_geldig: "Ja",
  },
};

//  Huurtoeslag

const HT = {
  2023: {
    HTjaar: "2023",
    MxSK: "48",
    MaxHuur: 808.06,
    GK: "",
    AftopA: 647.19,
    AftopB: 693.6,
    KwKrtGrns: 452.2,
    VrKndInk: 5432,
    OHKort: "",
    HTB: "F",
    MxRubr: 12,
    TslTmAftop: 65,
    TslBovenAftop: 40,
  },
  2022: {
    HTjaar: "2022",
    MxSK: "48",
    MaxHuur: 763.47,
    GK: "",
    AftopA: 633.25,
    AftopB: 678.66,
    KwKrtGrns: 442.46,
    VrKndInk: 5110,
    OHKort: "",
    HTB: "F",
    MxRubr: 12,
    TslTmAftop: 65,
    TslBovenAftop: 40,
  },
};

const HTBP = {
  2023: {
    EPH: {
      "Factor a": 0.000000474433,
      "Factor b": 0.002448638402,
      MinInkGr: 19375,
      DoelGrpGr: 0,
      TaakStBedr: 0,
      MinNrmHr: 225.54,
    },
    EPHAOW: {
      "Factor a": 0.000000671404,
      "Factor b": -0.002850602044,
      MinInkGr: 20500,
      DoelGrpGr: 0,
      TaakStBedr: 0,
      MinNrmHr: 223.72,
    },
    MPH: {
      "Factor a": 0.000000279402,
      "Factor b": 0.001893212113,
      MinInkGr: 25225,
      DoelGrpGr: 0,
      TaakStBedr: 0,
      MinNrmHr: 225.54,
    },
    MPHAOW: {
      "Factor a": 0.000000430722,
      "Factor b": -0.003611907743,
      MinInkGr: 27275,
      DoelGrpGr: 0,
      TaakStBedr: 0,
      MinNrmHr: 221.91,
    },
  },
  2022: {
    EPH: {
      "Factor a": 0.000000596879,
      "Factor b": 0.002363459319,
      MinInkGr: 17350,
      DoelGrpGr: 0,
      TaakStBedr: 16.94,
      MinNrmHr: 220.68,
    },
    EPHAOW: {
      "Factor a": 0.000000800848,
      "Factor b": -0.003802527235,
      MinInkGr: 19075,
      DoelGrpGr: 0,
      TaakStBedr: 16.94,
      MinNrmHr: 218.86,
    },
    MPH: {
      "Factor a": 0.000000342858,
      "Factor b": 0.002093692299,
      MinInkGr: 22500,
      DoelGrpGr: 0,
      TaakStBedr: 16.94,
      MinNrmHr: 220.68,
    },
    MPHAOW: {
      "Factor a": 0.000000499095,
      "Factor b": -0.004173489348,
      MinInkGr: 25450,
      DoelGrpGr: 0,
      TaakStBedr: 16.94,
      MinNrmHr: 217.05,
    },
  },
};

// Inkomsten afhankelijk combinatie korting

const IACK = {
  2023: {
    H: {
      MinAInk: 5548,
      InkKorting: 0.1145,
      MaxAInk: 29076,
      MaxInkAfKrt: 2694,
    },
    HAOW: {
      MinAInk: 5548,
      InkKorting: 0.059,
      MaxAInk: 29076,
      MaxInkAfKrt: 1389,
    },
  },
};

// Maximum Kindergebonden budget

const MAXKGB = {
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
  2022: {
    1: 1220,
    2: 2326,
    3: 3327,
    4: 4328,
    5: 5329,
    6: 6330,
    7: 7331,
    8: 8332,
  },
};

// Kinderopvang toeslag

const KOTT = {
  2023: [
    {
      inkomen: { van: 0, tm: 21278 },
      kinderopvangtoeslag: { eersteKind: 96, tweedeEvKind: 96 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 21279, tm: 22695 },
      kinderopvangtoeslag: { eersteKind: 96, tweedeEvKind: 96 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 22696, tm: 24110 },
      kinderopvangtoeslag: { eersteKind: 96, tweedeEvKind: 96 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 24111, tm: 25528 },
      kinderopvangtoeslag: { eersteKind: 96, tweedeEvKind: 96 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 25529, tm: 26944 },
      kinderopvangtoeslag: { eersteKind: 96, tweedeEvKind: 96 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 26945, tm: 28362 },
      kinderopvangtoeslag: { eersteKind: 95.5, tweedeEvKind: 95.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 28363, tm: 29778 },
      kinderopvangtoeslag: { eersteKind: 94.4, tweedeEvKind: 95.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 29779, tm: 31191 },
      kinderopvangtoeslag: { eersteKind: 93.4, tweedeEvKind: 95.2 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 31192, tm: 32715 },
      kinderopvangtoeslag: { eersteKind: 92.5, tweedeEvKind: 95 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 32716, tm: 34236 },
      kinderopvangtoeslag: { eersteKind: 91.9, tweedeEvKind: 94.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 34237, tm: 35762 },
      kinderopvangtoeslag: { eersteKind: 90.9, tweedeEvKind: 94.7 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 35763, tm: 37283 },
      kinderopvangtoeslag: { eersteKind: 90.4, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 37284, tm: 38811 },
      kinderopvangtoeslag: { eersteKind: 89.5, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 38812, tm: 40334 },
      kinderopvangtoeslag: { eersteKind: 88.7, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 40335, tm: 41894 },
      kinderopvangtoeslag: { eersteKind: 88.1, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 41895, tm: 43456 },
      kinderopvangtoeslag: { eersteKind: 87.3, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 43457, tm: 45018 },
      kinderopvangtoeslag: { eersteKind: 86.6, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 45019, tm: 46580 },
      kinderopvangtoeslag: { eersteKind: 85.9, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 46581, tm: 48145 },
      kinderopvangtoeslag: { eersteKind: 85, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 48146, tm: 49706 },
      kinderopvangtoeslag: { eersteKind: 84.5, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 49707, tm: 51267 },
      kinderopvangtoeslag: { eersteKind: 83.7, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 51268, tm: 52830 },
      kinderopvangtoeslag: { eersteKind: 83, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 52831, tm: 54537 },
      kinderopvangtoeslag: { eersteKind: 82.1, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 54538, tm: 57885 },
      kinderopvangtoeslag: { eersteKind: 80.6, tweedeEvKind: 94.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 57886, tm: 61231 },
      kinderopvangtoeslag: { eersteKind: 79.8, tweedeEvKind: 94.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 61232, tm: 64579 },
      kinderopvangtoeslag: { eersteKind: 78.7, tweedeEvKind: 93.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 64580, tm: 67929 },
      kinderopvangtoeslag: { eersteKind: 76.4, tweedeEvKind: 93.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 67930, tm: 71275 },
      kinderopvangtoeslag: { eersteKind: 74.1, tweedeEvKind: 92.8 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 71276, tm: 74625 },
      kinderopvangtoeslag: { eersteKind: 71.9, tweedeEvKind: 92.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 74626, tm: 77972 },
      kinderopvangtoeslag: { eersteKind: 69.4, tweedeEvKind: 91.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 77973, tm: 81320 },
      kinderopvangtoeslag: { eersteKind: 67.1, tweedeEvKind: 91.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 81321, tm: 84669 },
      kinderopvangtoeslag: { eersteKind: 64.9, tweedeEvKind: 90.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 84670, tm: 88015 },
      kinderopvangtoeslag: { eersteKind: 62.5, tweedeEvKind: 89.8 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 88016, tm: 91367 },
      kinderopvangtoeslag: { eersteKind: 60.3, tweedeEvKind: 89.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 91368, tm: 94714 },
      kinderopvangtoeslag: { eersteKind: 57.8, tweedeEvKind: 89.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 94715, tm: 98060 },
      kinderopvangtoeslag: { eersteKind: 55.5, tweedeEvKind: 88.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 98061, tm: 101408 },
      kinderopvangtoeslag: { eersteKind: 53.3, tweedeEvKind: 88 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 101409, tm: 104822 },
      kinderopvangtoeslag: { eersteKind: 50.9, tweedeEvKind: 87.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 104823, tm: 108252 },
      kinderopvangtoeslag: { eersteKind: 48.8, tweedeEvKind: 86.8 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 108253, tm: 111680 },
      kinderopvangtoeslag: { eersteKind: 46.7, tweedeEvKind: 86.3 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 111681, tm: 115109 },
      kinderopvangtoeslag: { eersteKind: 44.6, tweedeEvKind: 85.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 115110, tm: 118535 },
      kinderopvangtoeslag: { eersteKind: 42.4, tweedeEvKind: 85.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 118536, tm: 121965 },
      kinderopvangtoeslag: { eersteKind: 40.5, tweedeEvKind: 84.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 121966, tm: 125395 },
      kinderopvangtoeslag: { eersteKind: 38.6, tweedeEvKind: 84.3 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 125396, tm: 128825 },
      kinderopvangtoeslag: { eersteKind: 36.7, tweedeEvKind: 83.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 128826, tm: 132250 },
      kinderopvangtoeslag: { eersteKind: 34.7, tweedeEvKind: 83.3 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 132251, tm: 135678 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 82.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 135679, tm: 139109 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 82.2 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 139110, tm: 142536 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 81.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 142537, tm: 145965 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 80.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 145966, tm: 149392 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 80.3 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 149393, tm: 152822 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 79.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 152823, tm: 156254 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 78.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 156255, tm: 159680 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 78 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 159681, tm: 163109 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 77.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 163110, tm: 166535 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 76.6 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 166536, tm: 169966 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 75.8 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 169967, tm: 173396 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 75.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 173397, tm: 176824 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 74.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 176825, tm: 180252 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 73.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 180253, tm: 183677 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 72.9 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 183678, tm: 187109 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 72.2 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 187110, tm: 190536 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 71.4 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 190537, tm: 193966 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 70.7 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 193967, tm: 197395 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 70.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 197396, tm: 200822 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 69.3 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 200823, tm: 204252 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 68.5 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 204253, tm: 207679 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 68 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
    {
      inkomen: { van: 207680, tm: 99999999 },
      kinderopvangtoeslag: { eersteKind: 33.3, tweedeEvKind: 67.1 },
      extraToeslag: { eersteKind: 0, tweedeEvKind: 0 },
    },
  ],
};

// Kinderbijslag per kwartaal

const KBS = {
  2023: {
    K05: 269.76,
    K611: 327.56,
    K1217: 385.37,
  },
};

// Eigenwoningforfait

const EWF = {
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
  2023: {
    V: [
      {
        inkomen: { van: 0, tot: 22661 },
        minimum: 3070,
        minus: 0,
        factor: 0,
      },
      {
        inkomen: { van: 22661, tot: 73031 },
        minimum: 3070,
        minus: 22660,
        factor: -0.06095,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 22661 },
        minimum: 1583,
        minus: 0,
        factor: 0,
      },
      {
        inkomen: { van: 22661, tot: 73031 },
        minimum: 1583,
        minus: 22660,
        factor: -0.03141,
      },
    ],
  },
};

// Arbeidskorting

const AK = {
  2023: {
    V: [
      {
        inkomen: { van: 0, tot: 10741 },
        minimum: 0,
        minus: 0,
        factor: 0.08231,
      },
      {
        inkomen: { van: 10741, tot: 23201 },
        minimum: 884,
        minus: 10740,
        factor: 0.29861,
      },
      {
        inkomen: { van: 23201, tot: 37691 },
        minimum: 4605,
        minus: 23200,
        factor: 0.03085,
      },
      {
        inkomen: { van: 37691, tot: 115295 },
        minimum: 5052,
        minus: 37690,
        factor: -0.0651,
      },
    ],
    AOW: [
      {
        inkomen: { van: 0, tot: 10728 },
        minimum: 0,
        minus: 0,
        factor: 0.04241,
      },
      {
        inkomen: { van: 10728, tot: 23201 },
        minimum: 457,
        minus: 10727,
        factor: 0.15388,
      },
      {
        inkomen: { van: 23201, tot: 37691 },
        minimum: 2374,
        minus: 23200,
        factor: 0.01589,
      },
      {
        inkomen: { van: 37691, tot: 115295 },
        minimum: 2604,
        minus: 37690,
        factor: -0.03355,
      },
    ],
  },
};

const IB = {
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

const JAAR = 2023;
const BALKENENDENORM = 223000;
const AVG_HUUR = 600;
const AVG_WOZ = 315000;
const MAX_HUUR = HT[JAAR].MaxHuur;
const AVG_RENTE = AVG_WOZ * 0.0428;

export default {
  TABEL: TABEL,
  HT: HT,
  HTBP: HTBP,
  IACK: IACK,
  MAXKGB: MAXKGB,
  KOTT: KOTT,
  KBS: KBS,
  EWF: EWF,
  AHK: AHK,
  AK: AK,
  IB,
  LEEFTIJDEN: LEEFTIJDEN,
  JAAR: JAAR,
  BALKENENDENORM: BALKENENDENORM,
  AVG_HUUR,
  AVG_WOZ,
  AVG_RENTE,
  MAX_HUUR,
};
