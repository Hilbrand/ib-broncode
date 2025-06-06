<template>
  <div class="grid">
    <div id="infoBar">
      <HuishoudenComponent :personen="gegevens.personen" />
      <WonenComponent :jaar="gegevens.visualisatie.jaar" :wonen="gegevens.wonen" />
      <VisualisatieInstellingComponent :instellingen="gegevens.visualisatie" />
    </div>
    <div>
      <nav>
        <a href="" :class="active('intro')" @click="onChange($event, 'intro')">Introductie</a>
        <a href="" :class="active('bi')" @click="onChange($event, 'bi')">Beschikbaar Inkomen</a>
        <a href="" :class="active('md')" @click="onChange($event, 'md')">Marginale Druk</a>
        <a href="" :class="active('bd')" @click="onChange($event, 'bd')">Belastingdruk</a>
      </nav>
      <div class="content">
        <IntroPagina v-if="gegevens.tab == 'intro'" />
        <div v-if="gegevens.tab == 'bi'">
          <n-h4 v-html="samenvattingTekst"></n-h4>
          <n-divider />
          <TabelComponent v-if="gegevens.tab == 'bi' && gegevens.visualisatie.type == 't'" :gegevens="gegevens" />
          <div v-else>
            <n-space> Deze grafiek toont het beschikbare inkomen uitgesplitst naar kortingen en toeslagen. </n-space>
            <div id="bi"></div>
          </div>
        </div>
        <div v-if="gegevens.tab == 'md'">
          <n-h4 v-html="samenvattingTekst"></n-h4>
          <n-divider />
          <n-space vertical>
            <n-space :wrap="false"
              >Deze grafiek toont de marginale druk bij extra loon van
              <n-radio-group v-model:value="gegevens.visualisatie.svt">
                <n-radio label="%" key="p" value="p" size="small" />
                <n-radio label="€" key="a" value="a" size="small" />
              </n-radio-group>
              <n-input-group>
                <n-input-number
                  v-if="gegevens.visualisatie.svt == 'p'"
                  v-model:value="gegevens.visualisatie.sv_p"
                  min="0"
                  max="100"
                  step="1"
                  size="tiny"
                  style="width: 100px"
                >
                  <template #suffix>%</template>
                </n-input-number>
                <n-input-number
                  v-if="gegevens.visualisatie.svt == 'a'"
                  v-model:value="gegevens.visualisatie.sv_abs"
                  min="0"
                  step="1"
                  size="tiny"
                  style="width: 100px"
                >
                  <template #prefix>&euro;</template>
                </n-input-number>
              </n-input-group>
            </n-space>
            <TabelComponent v-if="gegevens.tab == 'md' && gegevens.visualisatie.type == 't'" :gegevens="gegevens" />
            <div v-else id="md"></div>
          </n-space>
        </div>
        <div v-if="gegevens.tab == 'bd'">
          <n-h4 v-html="samenvattingTekst"></n-h4>
          <n-divider />
          <TabelComponent v-if="gegevens.tab == 'bd' && gegevens.visualisatie.type == 't'" :gegevens="gegevens" />
          <n-space v-else vertical>
            <div id="bd"></div>
          </n-space>
        </div>
      </div>
    </div>
    <n-scrollbar id="legenda" v-if="gegevens.tab != 'intro' && gegevens.visualisatie.type == 'g'">
      <Legenda :data="legendaData" />
    </n-scrollbar>
  </div>
</template>

<style scoped>
nav {
  padding: 10px 0;
}
nav > a {
  padding: 10px 0;
  text-decoration: none;
  color: var(--n-tab-text-color);
  margin: 0 15px;
  line-height: 1.5;
}
nav > a:hover,
nav > .active {
  color: #18a058;
  border-bottom: 2px solid #18a058;
}

@media (max-width: 800px) {
  nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.content {
  margin: 10px;
}

#infoBar {
  max-height: 100% !important;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 800px) {
  #infoBar {
    overflow-y: scroll;
    max-height: calc(100vh - 25px) !important;
  }
  .grid {
    grid-template-columns: 300px auto 400px;
    max-height: calc(100vh - 25px);
    overflow-y: hidden;
  }
}
</style>

<script>
import { ref, nextTick } from "vue";
import IntroPagina from "./IntroPagina.vue";
import HuishoudenComponent from "./HuishoudenComponent.vue";
import WonenComponent from "./WonenComponent.vue";
import VisualisatieInstellingComponent from "./VisualisatieInstellingComponent.vue";
import TabelComponent from "./TabelComponent.vue";
import Legenda from "./Legenda.vue";
import { JAAR, jsonNaarNavigatie, navigatieNaarJson } from "@/ts/navigatie";
import algemeen from "@/js/berekeningen/algemeen";
import stacked_chart from "@/js/grafieken/stacked_chart";
import { maakSamenvatting } from "@/ts/samenvatting";

export default {
  components: {
    HuishoudenComponent,
    WonenComponent,
    VisualisatieInstellingComponent,
    IntroPagina,
    TabelComponent,
    Legenda,
  },
  setup() {
    timer: null;
    tabsRef: ref(null);
    tabRef: ref("intro");
    tabel: ref(null);
    samenvattingTekst: ref("");
    layoutVertical: false;
  },
  data() {
    return {
      gegevens: {
        tab: "intro",
        // Personen
        personen: [],
        // Wonen
        wonen: {},
        // Visualisatie
        visualisatie: {
          type: "g",
          jaar: JAAR,
          periode: null,
          van_tot: [],
          stap: 100,
          arbeidsInkomen: 0,
          svt: "p",
          sv_abs: 1000,
          sv_p: 3,
        },
      },
      legendaData: { grafiek: {}, netto: {}, bruto: {} },
    };
  },
  mounted() {
    this.gegevens = navigatieNaarJson(this.$route.query);
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
        let queryGegevens = navigatieNaarJson(toQuery);

        if (queryGegevens.tab != "intro") {
          this.gegevens = queryGegevens;
        }
        this.chart();
      }
    );
  },
  watch: {
    gegevens: {
      deep: true,
      handler() {
        if (this.timer != null) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.replace(), 1000);
      },
    },
  },
  methods: {
    active(tab) {
      return this.gegevens?.tab === tab ? "active" : "";
    },
    resize() {
      if (document.getElementById("infoBar")) {
        document.getElementById("infoBar").style.maxHeight = document.documentElement.clientHeight + "px";
      }
      this.chart();
    },
    replace() {
      this.$router.replace({
        query: jsonNaarNavigatie(this.gegevens),
      });
    },
    onChange(event, key) {
      this.tabRef = ref(key);
      this.gegevens.tab = key;
      event.preventDefault();
    },
    tabUpdated(value) {
      this.tabRef = ref(value);
      this.gegevens.tab = value;
      preventDefault();
    },
    async chart() {
      if (this.gegevens.tab === "intro") {
        return;
      }
      this.samenvattingTekst = maakSamenvatting(this.gegevens);
      if (this.gegevens.visualisatie.type === "t") {
        return;
      }
      await nextTick();
      stacked_chart.makeChart(
        "#" + this.gegevens.tab,
        algemeen.berekenGrafiekData(this.gegevens),
        document.getElementById(this.gegevens.tab).offsetWidth,
        (d) => (this.legendaData = d)
      );
      await nextTick();
    },
  },
};
</script>
