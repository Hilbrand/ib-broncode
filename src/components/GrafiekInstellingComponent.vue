<template>
  <n-card title="Grafiek Instellingen" size="small">
    <n-space vertical>
      Gegevens Jaar:
      <n-select
        v-model:value="grafiek.jaar"
        :options="jaren"
        :consistent-menu-width="false"
      />
      <n-slider
        v-model:value="grafiek.van_tot"
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
          v-model:value="grafiek.van_tot[0]"
        />
        <n-input-number
          placeholder="Bruto Bovengrens"
          min="0"
          step="100"
          size="small"
          v-model:value="grafiek.van_tot[1]"
        />
      </n-input-group>
      <n-radio-group v-model:value="grafiek.periode">
        <n-space :wrap="false">
          Bruto:
          <n-radio label="Jaarbasis" key="jaar" value="jaar" size="small" />
          <n-radio label="per Maand" key="maand" value="maand" size="small" />
        </n-space>
      </n-radio-group>
      <br />
      Vul jaar inkomen in of klik op de grafiek om een inkomensberekening te
      doen:
      <n-slider
        v-model:value="grafiek.arbeidsInkomen"
        :step="100"
        :min="grafiek.van_tot[0]"
        :max="grafiek.van_tot[1]"
      />
      <n-input-number
        placeholder="Arbeidsinkomen"
        min="0"
        step="1"
        size="small"
        v-model:value="grafiek.arbeidsInkomen"
      >
        <template #prefix>&euro;</template>
      </n-input-number>
    </n-space>
  </n-card>
</template>

<script>
import gegevens from "@/js/berekeningen/gegevens";

const jaren = [];
for (const jaar of gegevens.JAREN) {
  jaren.push({ label: jaar, value: jaar });
}

export default {
  props: ["grafiekInstellingen"],
  setup() {
    return {
      jaren,
    };
  },
  data() {
    return {
      grafiek: {
        periode: null,
        van_tot: [],
        arbeidsInkomen: 0,
        jaar: gegevens.JAAR,
        svt: "p",
        sv_abs: 1000,
        sv_p: 3,
      },
    };
  },
  watch: {
    grafiekInstellingen(newGrafiekInstellingen, oldGrafiekInstellingen) {
      this.grafiek = newGrafiekInstellingen;
    },
  },
};
</script>
