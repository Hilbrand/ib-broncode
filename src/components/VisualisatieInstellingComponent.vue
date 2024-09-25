<template>
  <n-card title="Visualisatie Instellingen" size="small">
    <n-space vertical>
      Belasting Jaar:
      <n-space>
        <n-select
          v-model:value="visualisatie.jaar"
          :options="jaren"
          :consistent-menu-width="false"
          style="flex-grow: 1"
        />
      </n-space>
      <n-slider v-model:value="visualisatie.van_tot" range :step="100" :min="0" :max="200000" />
      <n-input-group>
        <n-input-number
          placeholder="Bruto Ondergrens"
          min="0"
          step="100"
          size="small"
          v-model:value="visualisatie.van_tot[0]"
        />
        <n-input-number
          placeholder="Bruto Bovengrens"
          min="0"
          step="100"
          size="small"
          v-model:value="visualisatie.van_tot[1]"
        />
      </n-input-group>
    </n-space>
    <n-space vertical>
      <n-radio-group v-model:value="visualisatie.periode">
        <n-space :wrap="false">
          Bruto:
          <n-radio label="Jaarbasis" key="jaar" value="jaar" size="small" />
          <n-radio label="per Maand" key="maand" value="maand" size="small" />
        </n-space>
      </n-radio-group>
    </n-space>
    <br />
    <n-space vertical>
      <n-radio-group v-model:value="visualisatie.type">
        <n-space :wrap="false">
          <n-radio label="Grafiek" key="grafiek" value="g" size="small" />
          <n-radio label="Tabel" key="tabel" value="t" size="small" />
        </n-space>
      </n-radio-group>
    </n-space>
    <br />
    <n-space v-if="visualisatie.type === 'g'" vertical>
      Vul jaar inkomen in of klik op de grafiek om een inkomensberekening te doen:
      <n-slider
        v-model:value="visualisatie.arbeidsInkomen"
        :step="100"
        :min="visualisatie.van_tot[0]"
        :max="visualisatie.van_tot[1]"
      />
      <n-input-number
        placeholder="Arbeidsinkomen"
        min="0"
        step="1"
        size="small"
        v-model:value="visualisatie.arbeidsInkomen"
      >
        <template #prefix>&euro;</template>
      </n-input-number>
    </n-space>
    <n-space v-if="visualisatie.type === 't'" vertical>
      Stappen
      <n-input-number
        placeholder="Stappen van inkomen"
        min="0"
        step="100"
        size="small"
        v-model:value="visualisatie.stap"
      >
        <template #prefix>&euro;</template>
      </n-input-number>
    </n-space>
  </n-card>
</template>

<script>
import { JAAR, JAREN } from "@/ts/navigatie";

const jaren = JAREN;

export default {
  props: ["instellingen"],
  setup() {
    return {
      jaren,
    };
  },
  data() {
    return {
      visualisatie: {
        type: "g",
        jaar: JAAR,
        periode: null,
        van_tot: [],
        arbeidsInkomen: 0,
        stap: 100,
        svt: "p",
        sv_abs: 1000,
        sv_p: 3,
      },
    };
  },
  watch: {
    instellingen(newInstellingen, oldInstellingen) {
      this.visualisatie = newInstellingen;
    },
  },
};
</script>
