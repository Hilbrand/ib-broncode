<template>
  <div class="grid">
    <n-scrollbar id="infoBar">
      <n-card title="Huishouden" size="small">
        <n-space vertical>
          <n-space :wrap="false" justify="space-between">
            Stel aantal personen in:
            <n-select
              v-model:value="personen"
              :options="personOptions"
              :consistent-menu-width="false"
            />
          </n-space>

          <n-table :bordered="false" size="small" striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Leeftijd</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in persoonsdata" size="small">
                <td>{{ index + 1 }}</td>
                <td>
                  <n-select
                    v-model:value="persoonsdata[index]['leeftijd']"
                    :options="actieveLeeftijden(index)"
                    :consistent-menu-width="false"
                  />
                  <div
                    v-if="index != 0 && persoonsdata[index]['leeftijd'] == 'V'"
                  >
                    Bruto inkomen
                    <n-input-number
                      placeholder="Brutto inkomen p/j"
                      id="index+'bruto_inkomen'"
                      min="0"
                      step="1"
                      size="small"
                      v-model:value="persoonsdata[index]['bruto_inkomen']"
                    >
                      <template #prefix>&euro;</template>
                    </n-input-number>
                  </div>
                </td>
                <td>
                  <n-button
                    v-if="index != 0"
                    text
                    @click="verwijderPersoon(index)"
                    size="20"
                    class="deleteButton"
                  >
                    <n-icon size="20"
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                          fill="currentColor"
                        ></path></svg
                    ></n-icon>
                  </n-button>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-space>
      </n-card>
      <n-card title="Wonen" size="small">
        <label for="woning_type_huren"></label>
        <n-radio-group v-model:value="wonen.woning_type">
          <n-radio label="Huurwoning" key="huur" value="huur" size="small" />
          <n-radio label="Koopwoning" key="koop" value="koop" size="small" />
        </n-radio-group>
        <n-divider />
        <div v-if="wonen.woning_type == 'huur'" size="small">
          <n-space vertical>
            <n-space :wrap="false">
              <div style="white-space: nowrap">Rekenhuur p/m</div>
              <n-input-number
                placeholder="Rekenhuur p/m"
                id="huur"
                min="0"
                max="2000"
                step="1"
                size="small"
                v-model:value="wonen.huur"
              >
                <template #prefix>&euro;</template>
              </n-input-number>
            </n-space>
            <n-button-group>
              <n-button @click="setMaxHuur()" size="small"
                >Max. Huurgrens</n-button
              >
              <n-button @click="setAvgHuur()" size="small"
                >Gemiddele Huur</n-button
              >
            </n-button-group>
          </n-space>
        </div>
        <div v-else>
          <n-space vertical>
            <n-space :wrap="false">
              <div style="white-space: nowrap">WOZ waarde</div>
              <n-input-number
                placeholder="WOZ waarde"
                id="huur"
                min="0"
                step="1"
                size="small"
                v-model:value="wonen.woz"
              >
                <template #prefix>&euro;</template>
              </n-input-number>
            </n-space>
            <n-space :wrap="false">
              <div style="white-space: nowrap">Rente per Jaar</div>
              <n-input-number
                placeholder="WRente per Jaar"
                id="huur"
                min="0"
                step="1"
                size="small"
                v-model:value="wonen.rente"
              >
                <template #prefix>&euro;</template>
              </n-input-number>
            </n-space>
            <div>Berekende renteaftrek: &euro; {{ renteaftrek }}</div>
          </n-space>
        </div>
      </n-card>
      <n-card title="Grafiek Instellingen" size="small">
        <n-space vertical>
          <n-slider
            v-model:value="bruto_grenzen"
            range
            :step="100"
            :min="0"
            :max="200000"
          />
          <n-space :wrap="false">
            <n-input-number
              placeholder="Bruto Ondergrens"
              min="0"
              step="100"
              size="small"
              v-model:value="bruto_grenzen[0]"
            />
            <n-input-number
              placeholder="Bruto Bovengrens"
              min="0"
              step="100"
              size="small"
              v-model:value="bruto_grenzen[1]"
            />
          </n-space>
          <n-radio-group v-model:value="periode">
            <n-space :wrap="false">
              Bruto:
              <n-radio label="Jaarbasis" key="jaar" value="jaar" size="small" />
              <n-radio
                label="per Maand"
                key="maand"
                value="maand"
                size="small"
              />
            </n-space>
          </n-radio-group>
        </n-space>
      </n-card>
    </n-scrollbar>
    <n-tabs
      ref="tabsRef"
      type="line"
      style="padding: 0 10px"
      @update:value="tabUpdated"
      v-model:value="tab"
    >
      <n-tab-pane name="intro" tab="Introductie">
        <Intro />
      </n-tab-pane>
      <n-tab-pane
        name="beschikbaar_inkomen_grafiek"
        tab="Beschikbaar Inkomen"
        key="beschikbaar_inkomen_grafiek"
      >
        <n-space>
          Deze grafiek toont het beschikbare inkomen uitgesplitst naar kortingen
          en toeslagen.
        </n-space>
        <div id="beschikbaar_inkomen_grafiek"><svg></svg></div>
      </n-tab-pane>
      <n-tab-pane
        name="marginale_druk"
        tab="Marginale Druk"
        key="marginale_druk"
      >
        <n-space vertical>
          <n-space
            >Deze grafiek toont de marginale druk bij een salarisverhoging van
            <n-input-number
              v-model:value="salarisVerhoging"
              min="0"
              max="100"
              step="1"
              size="tiny"
              style="width: 100px"
            >
              <template #suffix>%</template></n-input-number
            ></n-space
          >
          <div id="marginale_druk"><svg></svg></div>
        </n-space>
      </n-tab-pane>
    </n-tabs>
    <n-scrollbar id="legenda" v-if="tab != 'intro'">
      <Legenda :data="legendaData" />
    </n-scrollbar>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 300px auto 400px;
}
.deleteButton {
  float: right;
}
</style>

<script>
import { ref, nextTick } from "vue";
import Intro from "./Intro.vue";
import Legenda from "./Legenda.vue";
import algemeen from "@/js/berekeningen/algemeen";
import hra from "@/js/belasting/hypotheekrente_aftrek";
import belasting_data from "@/js/belasting/belasting_data";
import stacked_chart from "@/js/grafieken/stacked_chart";
import { BeschikbaarInkomenLegenda } from "@/js/grafieken/BeschikbaarInkomenLegenda";
import { MarginaleDrukLegenda } from "@/js/grafieken/MarginaleDrukLegenda";

const MAX_PERSONEN = 5;
const MAX_HUUR = belasting_data.HT["2023"].MaxHuur;
const AVG_HUUR = 600;
const AVG_WOZ = 315000;
const AVG_RENTE = AVG_WOZ * 0.0428;

const personOptions = [];
for (let i = 1; i <= MAX_PERSONEN; i++) {
  personOptions.push({ label: i, value: i });
}
const leeftijdenData = [];
for (const [k, v] of Object.entries(belasting_data.LEEFTIJDEN)) {
  leeftijdenData.push({ label: v, value: k });
}

export default {
  components: {
    Intro,
    Legenda,
  },
  data() {
    return {
      // Visualisatie
      tabsRef: ref(null),
      tabRef: ref("intro"),
      tab: "intro",
      periode: "jaar",
      salarisVerhoging: 3,
      bruto_grenzen: [10000, 100000],

      // Personen
      leeftijden: leeftijdenData,
      personOptions: personOptions,
      personen: 1,
      persoonsdata: [{ leeftijd: "V" }],

      // Wonen
      wonen: {
        woning_type: "huur",
        huur: AVG_HUUR,
        woz: AVG_WOZ,
        rente: AVG_RENTE,
      },
      toeslagenpartner: false,

      // Legenda
      legendaData: { grafiek: {}, netto: {}, bruto: {} },
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
  },
  created() {},
  computed: {
    renteaftrek() {
      if (this.wonen.woning_type == "koop") {
        return -hra.hypotheekRenteAftrek(this.wonen.rente, this.wonen.woz);
      }
    },
  },
  watch: {
    periode(newPeriode, oldPeriode) {
      this.chart();
    },
    salarisVerhoging(newSalarisVerhoging, oldSalarisVerhoging) {
      this.chart();
    },
    personen(newPersonen, oldPersonen) {
      if (this.persoonsdata.length == newPersonen) {
        return;
      }
      if (oldPersonen > newPersonen) {
        for (var i = 0; i < oldPersonen - newPersonen; i++) {
          this.persoonsdata.pop();
        }
      } else if (newPersonen > oldPersonen) {
        for (var i = 0; i < newPersonen - oldPersonen; i++) {
          this.persoonsdata.push({ leeftijd: "", bruto_inkomen: 0 });
        }
      }
      this.chart();
    },
    persoonsdata: {
      deep: true,
      handler() {
        this.chart();
      },
    },
    wonen: {
      deep: true,
      handler() {
        this.chart();
      },
    },
    bruto_grenzen: {
      deep: true,
      handler() {
        if (this.bruto_grenzen[0] > this.bruto_grenzen[1]) {
          this.bruto_grenzen[0] = this.bruto_grenzen[1];
        }
        this.chart();
      },
    },
  },
  methods: {
    resize() {
      //if (document.getElementById('infoBar')) {
      document.getElementById("infoBar").style.maxHeight =
        document.documentElement.clientHeight + "px";
      //}
      this.chart(false);
    },
    tabUpdated(value) {
      this.tabRef = ref(value);
      this.tab = value;
      nextTick(() => this.chart(false));
    },
    actieveLeeftijden(index) {
      if (index == 0) {
        return [{ value: "V", label: belasting_data.LEEFTIJDEN.V }];
      } else {
        return leeftijdenData;
      }
    },
    verwijderPersoon(index) {
      this.persoonsdata.splice(index, 1);
      this.personen--;
    },
    setMaxHuur(event) {
      this.wonen.huur = MAX_HUUR;
    },
    setAvgHuur(event) {
      this.wonen.huur = AVG_HUUR;
    },
    async chart(selectChart = true) {
      if (this.tab == "intro" && selectChart) {
        this.tab = "beschikbaar_inkomen_grafiek";
        nextTick(() => this.chart());
        return;
      }
      if (this.tab == "intro" && !selectChart) {
        return;
      }
      await nextTick();
      const beschikbaarInkomen = this.tab == "beschikbaar_inkomen_grafiek";

      stacked_chart.makeChart(
        "#" + this.tab,
        algemeen.berekenGrafiekData(
          this.tab,
          {
            periode: this.periode,
            ondergrens: this.bruto_grenzen[0],
            bovengrens: this.bruto_grenzen[1],
            salarisVerhoging: this.salarisVerhoging,
          },
          this.persoonsdata,
          this.wonen
        ),
        document.getElementById(this.tab).offsetWidth,
        beschikbaarInkomen
          ? new BeschikbaarInkomenLegenda()
          : new MarginaleDrukLegenda(),
        (d) => (this.legendaData = d)
      );
    },
  },
};
</script>
