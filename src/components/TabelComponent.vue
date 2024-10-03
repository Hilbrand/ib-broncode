<template>
  <n-button @click="downloadCsv">Exporteer CSV</n-button>
  <n-divider />
  <div style="overflow-x:scroll">
  <n-data-table
    ref="tableRef"
    :columns="kolommen"
    :data="data"
    :pagination="pagination"
    :bordered="false"
    :render-cell="renderCell"
    row-class-name="rowClassName"
  />
  </div>
</template>

<style>
.rowClassName {
  white-space: nowrap
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { DataTableColumns, DataTableInst } from "naive-ui";
import { type InvoerGegevensType, TabType } from "../ts/types";
import { mdHuurKolommen, biHuurKolommen } from "../js/tabellen/tabel_kolommen";
import algemeen from "../js/berekeningen/algemeen";

const props = defineProps<{
  gegevens: InvoerGegevensType,
}>();

const pagination: boolean = true;
const tableRef = ref<DataTableInst>();
const data = ref();

const downloadCsv = () => tableRef.value?.downloadCsv({ keepOriginalData: true, fileName: "data-table" });

const kolommen = computed<DataTableColumns>(() =>
  props.gegevens.tab === TabType.BI ? biHuurKolommen() : mdHuurKolommen()
);

let timer: NodeJS.Timeout =  null;

function renderCell(value: string | number) {
  return value?.toLocaleString();
}

onMounted(() => {
  data.value = algemeen.berekenTabelData(props.gegevens).series;
});

watch(
  () => props.gegevens,
  (val, oldVal) => {
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => replace(val), 1000);
  },
  { deep: true }
);

function replace(val) {
  data.value = algemeen.berekenTabelData(val).series;
}
</script>
