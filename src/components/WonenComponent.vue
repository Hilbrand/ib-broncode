<template>
  <n-card title="Wonen" size="small">
    <label for="wt_huren"></label>
    <n-radio-group v-model:value="gegevens.woning_type">
      <n-radio label="Huurwoning" key="huur" value="huur" size="small" />
      <n-radio label="Koopwoning" key="koop" value="koop" size="small" />
    </n-radio-group>
    <n-divider />
    <div v-if="gegevens.woning_type == 'huur'" size="small">
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
            v-model:value="gegevens.huur"
          >
            <template #prefix>&euro;</template>
          </n-input-number>
        </n-space>
        <n-button-group>
          <n-button @click="setMaxHuur()" size="small">Max. Huurgrens</n-button>
          <n-button @click="setAvgHuur()" size="small">Gemiddele Huur</n-button>
        </n-button-group>
      </n-space>
    </div>
    <div v-else>
      <n-space vertical>
        <n-space :wrap="false">
          <div style="white-space: nowrap">WOZ waarde</div>
          <n-input-number placeholder="WOZ waarde" id="huur" min="0" step="1" size="small" v-model:value="gegevens.woz">
            <template #prefix>&euro;</template>
          </n-input-number>
        </n-space>
        <n-space :wrap="false">
          <div style="white-space: nowrap">Rente per Jaar</div>
          <n-input-number
            placeholder="Rente per Jaar"
            id="huur"
            min="0"
            step="1"
            size="small"
            v-model:value="gegevens.rente"
          >
            <template #prefix>&euro;</template>
          </n-input-number>
        </n-space>
        <div>Berekende renteaftrek: &euro; {{ renteaftrek }}</div>
        <div>Eigenwoningforfait: &euro; {{ eigenwoningforfait }}</div>
      </n-space>
    </div>
  </n-card>
</template>

<script>
import belasting_data from "@/js/belasting/belasting_data";
import hra from "@/js/belasting/hypotheekrente_aftrek";

export default {
  props: ["jaar", "wonen"],
  data() {
    return {
      gegevens: {
        woning_type: "huur",
        huur: 0,
        woz: 0,
        rente: 0,
      },
    };
  },
  computed: {
    renteaftrek() {
      if (this.gegevens.woning_type == "koop") {
        return -hra.hypotheekRenteAftrek(this.jaar, this.gegevens.rente, this.gegevens.woz);
      } else {
        return "";
      }
    },
    eigenwoningforfait() {
      if (this.gegevens.woning_type == "koop") {
        return hra.eigenwoningforfait(this.jaar, this.gegevens.woz);
      } else {
        return "";
      }
    },
  },
  watch: {
    wonen(newWonen, oldWonen) {
      this.gegevens = newWonen;
    },
  },
  methods: {
    setMaxHuur(event) {
      this.gegevens.huur = belasting_data.HT[this.jaar].MaxHuur;
    },
    setAvgHuur(event) {
      this.gegevens.huur = belasting_data.AVG_HUUR;
    },
  },
};
</script>
