<template>
  <n-card title="Legenda" size="small">
    <n-space vertical v-if="!data.grafiek || Object.keys(data.grafiek).length == 0">
      Beweeg de muis over de grafiek om de legenda te tonen.
    </n-space>
    <n-space vertical v-else>
      <div>
        <h4>Arbeidsinkomen (Salaris): &euro; {{ data.arbeidsInkomen }}</h4>
        <h4>{{ data.titel }}</h4>
      </div>
      <n-table :single-line="false" size="tiny" class="table">
        <tbody>
          <tr v-for="(gd, idx) in data.grafiek" :key="gd.naam">
            <td><div class="dot" :style="'background-color:' + gd.color" /></td>
            <td>{{ gd.naam }}</td>
            <td v-if="gd.percentage" class="nr">{{ gd.percentage }}</td>
            <td class="nr nr2">{{ gd.bedrag }}</td>
          </tr>
          <tr v-for="(gd, idx) in data.totals" :key="gd.naam">
            <td colspan="2" class="tekst" :class="streep(idx)">{{ gd.naam }}</td>
            <td v-if="gd.percentage" class="nr" :class="streep(idx)">{{ gd.percentage }}</td>
            <td class="nr" :class="streep(idx)">{{ gd.bedrag }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-space>
  </n-card>
</template>

<style scoped>
.table {
  font-family: "courier new";
  font-weight: 500;
}
.nr {
  width: 70px;
  text-align: right;
}
.dot {
  border-radius: 15px;
  width: 15px;
  height: 15px;
  margin: 5px;
}
.tekst {
  padding-left: 7px;
}
.streep {
  border-top: 1px solid black;
}
</style>

<script>
export default {
  props: ["data"],
  methods: {
    streep(idx) {
      return idx === 0 ? "streep" : undefined;
    },
  },
};
</script>
