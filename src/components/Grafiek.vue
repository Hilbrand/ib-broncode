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
              <tr v-for="(p, index) in gegevens.personen" size="small">
                <td>{{ index + 1 }}</td>
                <td>
                  <n-select
                    v-model:value="gegevens.personen[index]['leeftijd']"
                    :options="actieveLeeftijden(index)"
                    :consistent-menu-width="false"
                  />
                  <div v-if="inkomenNietEersteVolwassene(index)">
                    Bruto inkomen
                    <n-input-number
                      placeholder="Brutto inkomen p/j"
                      id="index+'bruto_inkomen'"
                      min="0"
                      step="1"
                      size="small"
                      v-model:value="gegevens.personen[index]['bruto_inkomen']"
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
                        ></path>
                      </svg>
                    </n-icon>
                  </n-button>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-space>
      </n-card>
      <n-card title="Wonen" size="small">
        <label for="wt_huren"></label>
        <n-radio-group v-model:value="gegevens.wonen.woning_type">
          <n-radio label="Huurwoning" key="huur" value="huur" size="small" />
          <n-radio label="Koopwoning" key="koop" value="koop" size="small" />
        </n-radio-group>
        <n-divider />
        <div v-if="gegevens.wonen.woning_type == 'huur'" size="small">
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
                v-model:value="gegevens.wonen.huur"
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
                v-model:value="gegevens.wonen.woz"
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
                v-model:value="gegevens.wonen.rente"
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
            v-model:value="gegevens.grafiek.van_tot"
            range
            :step="100"
            :min="0"
            :max="200000"
          />
          <n-input-group>
            <n-input-number
              placeholder="Bruto Ondergrens"
              min="0"
              step="100"
              size="small"
              v-model:value="gegevens.grafiek.van_tot[0]"
            />
            <n-input-number
              placeholder="Bruto Bovengrens"
              min="0"
              step="100"
              size="small"
              v-model:value="gegevens.grafiek.van_tot[1]"
            />
          </n-input-group>
          <n-radio-group v-model:value="gegevens.grafiek.periode">
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
      v-model:value="gegevens.tab"
    >
      <n-tab-pane name="intro" tab="Introductie">
        <Intro />
      </n-tab-pane>
      <n-tab-pane name="bi" tab="Beschikbaar Inkomen" key="bi">
        <n-space>
          Deze grafiek toont het beschikbare inkomen uitgesplitst naar kortingen
          en toeslagen.
        </n-space>
        <div id="bi"><svg></svg></div>
      </n-tab-pane>
      <n-tab-pane name="md" tab="Marginale Druk" key="md">
        <n-space vertical>
          <n-space :wrap="false"
            >Deze grafiek toont de marginale druk bij een salarisverhoging van
            <n-radio-group v-model:value="gegevens.grafiek.svt">
              <n-radio label="%" key="p" value="p" size="small" />
              <n-radio label="€" key="a" value="a" size="small" />
            </n-radio-group>
            <n-input-group>
              <n-input-number
                v-if="gegevens.grafiek.svt == 'p'"
                v-model:value="gegevens.grafiek.sv_p"
                min="0"
                max="100"
                step="1"
                size="tiny"
                style="width: 100px"
              >
                <template #suffix>%</template></n-input-number
              >
              <n-input-number
                v-if="gegevens.grafiek.svt == 'a'"
                v-model:value="gegevens.grafiek.sv_abs"
                min="0"
                step="1"
                size="tiny"
                style="width: 100px"
              >
                <template #prefix>€</template></n-input-number
              >
            </n-input-group>
          </n-space>
          <div id="md"><svg></svg></div>
        </n-space>
      </n-tab-pane>
    </n-tabs>
    <n-scrollbar id="legenda" v-if="gegevens.tab != 'intro'">
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
import gegevens from "@/js/berekeningen/gegevens";
import algemeen from "@/js/berekeningen/algemeen";
import hra from "@/js/belasting/hypotheekrente_aftrek";
import belasting_data from "@/js/belasting/belasting_data";
import stacked_chart from "@/js/grafieken/stacked_chart";
import { BeschikbaarInkomenLegenda } from "@/js/grafieken/BeschikbaarInkomenLegenda";
import { MarginaleDrukLegenda } from "@/js/grafieken/MarginaleDrukLegenda";

const MAX_PERSONEN = 8;

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
  props: ["route"],
  data() {
    return {
      tabsRef: ref(null),
      tabRef: ref("intro"),
      gegevens: {
        tab: "intro",
        // Personen
        personen: [],
        // Wonen
        wonen: {
          wt: "huur",
          huur: 0,
          woz: 0,
          rente: 0,
        },
        // Visualisatie
        grafiek: {
          periode: null,
          van_tot: [],
          svt: "p",
          sv_abs: 1000,
          sv_p: 3,
        },
      },

      // Personen
      leeftijden: leeftijdenData,
      personOptions: personOptions,
      personen: 1,
      // Legenda
      sv_abs: 1000,
      sv_p: 3,
      legendaData: { grafiek: {}, netto: {}, bruto: {} },
    };
  },
  mounted() {
    this.gegevens = gegevens.navigatieToJson(this.$route.query);
    this.personen = this.gegevens.personen.length;
    this.resize();
    window.addEventListener("resize", this.resize);
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
  },
  created() {
    this.$watch(
      () => this.$route.query,
      (toQuery, previousQuery) => {
        this.gegevens = gegevens.navigatieToJson(toQuery);
        this.chart(false);
      }
    );
  },
  computed: {
    renteaftrek() {
      if (this.gegevens.wonen.woning_type == "koop") {
        return -hra.hypotheekRenteAftrek(
          this.gegevens.wonen.rente,
          this.gegevens.wonen.woz
        );
      } else {
        return "";
      }
    },
  },
  watch: {
    gegevens: {
      deep: true,
      handler() {
        this.$router.replace({
          query: gegevens.jsonToNavigatie(this.gegevens),
        });
      },
    },
    personen(newPersonen, oldPersonen) {
      let current = this.gegevens.personen;
      if (current.length == newPersonen) {
        return;
      }
      if (oldPersonen > newPersonen) {
        for (let i = 0; i < oldPersonen - newPersonen; i++) {
          current.pop();
        }
      } else if (newPersonen > oldPersonen) {
        for (let i = 0; i < newPersonen - oldPersonen; i++) {
          // moet altijd geldige waarde hebben, dus initaliseer met 'V'
          current.push({ leeftijd: "V", bruto_inkomen: 0 });
        }
      }
    },
  },
  methods: {
    resize() {
      if (document.getElementById("infoBar")) {
        document.getElementById("infoBar").style.maxHeight =
          document.documentElement.clientHeight + "px";
      }
      this.chart(false);
    },
    tabUpdated(value) {
      this.tabRef = ref(value);
      this.gegevens.tab = value;
    },
    actieveLeeftijden(index) {
      if (index == 0) {
        return [
          { value: "V", label: belasting_data.LEEFTIJDEN.V },
          { value: "AOW", label: belasting_data.LEEFTIJDEN.AOW },
        ];
      } else {
        return leeftijdenData;
      }
    },
    inkomenNietEersteVolwassene(index) {
      if (index == 0) {
        return false;
      }
      let leeftijd = this.gegevens.personen[index]["leeftijd"];

      return leeftijd == "V" || leeftijd == "AOW";
    },
    verwijderPersoon(index) {
      this.gegevens.personen.splice(index, 1);
      this.personen--;
    },
    setMaxHuur(event) {
      this.gegevens.wonen.huur = belasting_data.MAX_HUUR;
    },
    setAvgHuur(event) {
      this.gegevens.wonen.huur = belasting_data.AVG_HUUR;
    },
    async chart(selectChart = true) {
      if (this.gegevens.tab == "intro" && selectChart) {
        this.gegevens.tab = "bi";
        nextTick(() => this.chart());
        return;
      }
      if (this.gegevens.tab == "intro" && !selectChart) {
        return;
      }
      await nextTick();
      const beschikbaarInkomen = this.gegevens.tab == "bi";

      stacked_chart.makeChart(
        "#" + this.gegevens.tab,
        algemeen.berekenGrafiekData(
          this.gegevens.tab,
          this.gegevens.grafiek,
          this.gegevens.personen,
          this.gegevens.wonen
        ),
        document.getElementById(this.gegevens.tab).offsetWidth,
        beschikbaarInkomen
          ? new BeschikbaarInkomenLegenda()
          : new MarginaleDrukLegenda(),
        (d) => (this.legendaData = d)
      );
    },
  },
};
</script>
