<template>
  <n-card title="Legenda" size="small">
    <n-space vertical>
      <p>{{ data.titel }}</p>
      <n-table :single-line="false" size="tiny" class="table">
        <tbody>
          <tr v-for="gd in data.grafiek">
            <td><div class="dot" :style="'background-color:' + gd.color" /></td>
            <td>{{ gd.naam }}</td>
            <td v-if="gd.percentage" class="nr">{{ gd.percentage }}</td>
            <td class="nr">{{ gd.bedrag }}</td>
          </tr>
        </tbody>
      </n-table>

      <n-table :single-line="false" size="tiny" class="table">
        <tbody>
          <tr v-for="gd in data.totals">
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
  data() {
    return {
      columns: this.data.columns,
    };
  },
  mounted() {
    console.log(this.data.grafiek);
  },
};
</script>
