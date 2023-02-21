<template>
  <n-card title="Grafiek Instellingen" size="small">
    <n-space vertical>
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
    </n-space>
  </n-card>
</template>

<script>
export default {
  props: ["grafiekInstellingen"],
  data() {
    return {
      grafiek: {
        periode: null,
        van_tot: [],
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
