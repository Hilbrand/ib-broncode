<template>
  <n-card title="Legenda" size="small">
    <n-space
      vertical
      v-if="!data.grafiek || Object.keys(data.grafiek).length == 0"
    >
      Beweeg de muis over de grafiek om de legenda te tonen.
    </n-space>
    <n-space vertical v-else>
      <div>
        <h4>Arbeidsinkomen (Salaris): &euro; {{ data.arbeidsInkomen }}</h4>
        <h4>{{ data.titel }}</h4>
      </div>
      <n-table :single-line="false" size="tiny" class="table">
        <tbody>
          <tr v-for="gd in data.grafiek" :key="gd.naam">
            <td><div class="dot" :style="'background-color:' + gd.color" /></td>
            <td>{{ gd.naam }}</td>
            <td v-if="gd.percentage" class="nr">{{ gd.percentage }}</td>
            <td class="nr">{{ gd.bedrag }}</td>
          </tr>
        </tbody>
      </n-table>

      <n-table :single-line="false" size="tiny" class="table">
        <tbody>
          <tr v-for="gd in data.totals" :key="gd.naam">
            <td>{{ gd.naam }}</td>
            <td v-if="gd.percentage" class="nr">{{ gd.percentage }}</td>
            <td class="nr">{{ gd.bedrag }}</td>
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
}
.dot {
  border-radius: 15px;
  width: 15px;
  height: 15px;
  margin: 5px;
}
</style>

<script>
export default {
  props: ["data"],
};
</script>
