<template>
  <n-button @click="downloadCsv">
        Export CSV (original data)
      </n-button>
  <n-data-table 
    ref="tableRef"
    :columns="kolommen"
    :data="data"
    :pagination="pagination"
    :bordered="false"
    :render-cell="renderCell" />
</template>

<script setup lang="ts">
import { computed, mounded, ref, watch } from "vue";
import type { DataTableColumns, DataTableInst } from "naive-ui";
import { type InvoerGegevensType, TabType } from "../ts/types";
import { mdHuurKolommen, biHuurKolommen } from "../js/tabellen/tabel_kolommen";
import { JAAR, jsonToNavigatie, navigatieToJson } from "../ts/navigatie";
import algemeen from "../js/berekeningen/algemeen";

const props = defineProps({
  gegevens: ref<InvoerGegevensType>()
})

const pagination: boolean = true;
const tableRef = ref<DataTableInst>();
const data = ref();

const downloadCsv = () =>
      tableRef.value?.downloadCsv({ keepOriginalData: true, fileName: 'data-table' })

const kolommen = computed<DataTableColumns>(() =>
  props.gegevens.tab === TabType.BI ? biHuurKolommen() : mdHuurKolommen()
);

function renderCell(value: string | number) {
  return value.toLocaleString();
}

// mounded(() => {
//   data.value = algemeen.berekenTabelData(navigatieToJson(this.$route.query)).series;
// });

watch(() => props.gegevens, (val, oldVal)=> {
  console.log("this.gegevens:", val)
  // await nextTick();
  data.value = algemeen.berekenTabelData(val).series;
}, {deep:true});
</script>
