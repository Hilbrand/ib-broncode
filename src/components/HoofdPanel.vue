<template>
  <div class="grid">
    <div id="infoBar">
      <HuishoudenComponent :personen="gegevens.personen" />
      <WonenComponent :jaar="gegevens.grafiek.jaar" :wonen="gegevens.wonen" />
      <GrafiekInstellingComponent :grafiekInstellingen="gegevens.grafiek" />
    </div>
    <n-tabs ref="tabsRef" type="line" style="padding: 0 10px" @update:value="tabUpdated" v-model:value="gegevens.tab">
      <n-tab-pane name="intro" tab="Introductie">
        <IntroBluemink v-if="$route.path == '/bluemink'" />
        <IntroPagina v-else />
      </n-tab-pane>
      <n-tab-pane name="bi" tab="Beschikbaar Inkomen" key="bi">
        <n-space> Deze grafiek toont het beschikbare inkomen uitgesplitst naar kortingen en toeslagen. </n-space>
        <div id="bi"></div>
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
          <div id="md"></div>
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="bd" tab="Belastingdruk" key="bd">
        <n-space vertical>
          <div id="bd"></div>
        </n-space>
      </n-tab-pane>
    </n-tabs>
    <n-scrollbar id="legenda" v-if="gegevens.tab != 'intro'">
      <Legenda :data="legendaData" />
    </n-scrollbar>
  </div>
</template>

<style>
#infoBar {
  max-height: 100% !important;
}
.grid {
  display: grid;
}

@media (min-width: 1280px) {
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
import IntroBluemink from "./IntroBluemink.vue";
import HuishoudenComponent from "./HuishoudenComponent.vue";
import WonenComponent from "./WonenComponent.vue";
import GrafiekInstellingComponent from "./GrafiekInstellingComponent.vue";
import Legenda from "./Legenda.vue";
import gegevens from "@/js/berekeningen/gegevens";
import algemeen from "@/js/berekeningen/algemeen";
import stacked_chart from "@/js/grafieken/stacked_chart";

export default {
  components: {
    HuishoudenComponent,
    WonenComponent,
    GrafiekInstellingComponent,
    IntroPagina,
    Legenda,
    IntroBluemink,
  },
  data() {
    return {
      tabsRef: ref(null),
      tabRef: ref("intro"),
      gegevens: {
        tab: "intro",
        // Personen
        personen: [],
        // Wonen
        wonen: {},
        // Visualisatie
        grafiek: {
          jaar: gegevens.JAAR,
          periode: null,
          van_tot: [],
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
    this.gegevens = gegevens.navigatieToJson(this.$route.query);
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
        let queryGegevens = gegevens.navigatieToJson(toQuery);

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
        this.$router.replace({
          query: gegevens.jsonToNavigatie(this.gegevens),
        });
      },
    },
  },
  methods: {
    resize() {
      if (document.getElementById("infoBar")) {
        document.getElementById("infoBar").style.maxHeight = document.documentElement.clientHeight + "px";
      }
      this.chart();
    },
    tabUpdated(value) {
      this.tabRef = ref(value);
      this.gegevens.tab = value;
    },
    async chart() {
      if (this.gegevens.tab == "intro") {
        return;
      }
      await nextTick();

      stacked_chart.makeChart(
        "#" + this.gegevens.tab,
        algemeen.berekenGrafiekData(
          this.$route.path,
          this.gegevens.tab,
          this.gegevens.grafiek,
          this.gegevens.personen,
          this.gegevens.wonen
        ),
        document.getElementById(this.gegevens.tab).offsetWidth,
        (d) => (this.legendaData = d)
      );
    },
  },
};
</script>
