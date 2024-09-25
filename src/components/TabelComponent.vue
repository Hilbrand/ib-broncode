<template>
  <n-button @click="downloadCsv">Exporteer CSV</n-button>
  <n-divider />
  <div style="overflow-x: scroll">
    <n-data-table
      ref="tableRef"
      :columns="kolommen"
      :data="data"
      :pagination="pagination"
      :bordered="false"
      :render-cell="renderCell"
    />
  </div>
</template>

<style>
.n-data-table-td {
  white-space: nowrap;
}
.n-data-table-th__title {
  white-space: nowrap !important;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { DataTableColumns, DataTableInst } from "naive-ui";
import { type InvoerGegevensType, WoningType, TabType } from "../ts/types";
import {
  mdHuurKolommen,
  mdKoopKolommen,
  biHuurKolommen,
  biKoopKolommen,
  bdKolommen,
} from "../js/tabellen/tabel_kolommen";
import algemeen from "../js/berekeningen/algemeen";
import { maakBestandsnaam } from "../ts/samenvatting";

const props = defineProps<{
  gegevens: InvoerGegevensType;
}>();

const pagination: boolean = true;
const tableRef = ref<DataTableInst>();
const data = ref();

const downloadCsv = () =>
  tableRef.value?.downloadCsv({ keepOriginalData: true, fileName: maakBestandsnaam(props.gegevens) });

const kolommen = computed<DataTableColumns>(() => {
  const huur = props.gegevens.wonen.woning_type === WoningType.HUUR;
  if (props.gegevens.tab === TabType.BI) {
    return huur ? biHuurKolommen() : biKoopKolommen();
  } else if (props.gegevens.tab === TabType.MD) {
    return huur ? mdHuurKolommen() : mdKoopKolommen();
  } else {
    return bdKolommen();
  }
});

let timer: NodeJS.Timeout = null;

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
