<template>
  <n-card title="Huishouden" size="small">
    <n-space vertical>
      <n-space :wrap="false" justify="space-between">
        Stel aantal personen in:
        <n-select
          v-model:value="aantalPersonen"
          :options="personOptions"
          :consistent-menu-width="false"
        />
      </n-space>

      <n-table :bordered="false" size="small" striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Leeftijd</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in gegevens" :key="p" size="small">
            <td>{{ index + 1 }}</td>
            <td>
              <n-select
                v-model:value="gegevens[index]['leeftijd']"
                :options="actieveLeeftijden(index)"
                :consistent-menu-width="false"
              />
              <div v-if="inkomenNietEersteVolwassene(index)">
                Bruto inkomen
                <n-input-number
                  placeholder="Brutto inkomen p/j"
                  id="index+'bruto_inkomen'"
                  min="0"
                  step="1"
                  size="small"
                  v-model:value="gegevens[index]['bruto_inkomen']"
                >
                  <template #prefix>&euro;</template>
                </n-input-number>
              </div>
            </td>
            <td>
              <n-button
                v-if="index != 0"
                text
                @click="verwijderPersoon(index)"
                size="20"
                class="deleteButton"
              >
                <n-icon size="20"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </n-icon>
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-space>
  </n-card>
</template>

<script>
import belasting_data from "@/js/belasting/belasting_data";

const MAX_PERSONEN = 8;

const personOptions = [];
for (let i = 1; i <= MAX_PERSONEN; i++) {
  personOptions.push({ label: i, value: i });
}
const leeftijdenData = [];
for (const [k, v] of Object.entries(belasting_data.LEEFTIJDEN)) {
  leeftijdenData.push({ label: v, value: k });
}

export default {
  setup() {
    return {
      personOptions,
    };
  },
  props: ["personen"],
  data() {
    return {
      gegevens: [],
      aantalPersonen: 1,
    };
  },
  watch: {
    personen(newPersonen, oldPersonen) {
      this.gegevens = this.personen;
      this.aantalPersonen = this.personen.length;
    },
    aantalPersonen(newGegevens, oldGegevens) {
      let current = this.gegevens;

      if (current.length == newGegevens) {
        return;
      }
      if (oldGegevens > newGegevens) {
        for (let i = 0; i < oldGegevens - newGegevens; i++) {
          current.pop();
        }
      } else if (newGegevens > oldGegevens) {
        for (let i = 0; i < newGegevens - oldGegevens; i++) {
          // moet altijd geldige waarde hebben, dus initaliseer met 'V'
          current.push({ leeftijd: "V", bruto_inkomen: 0 });
        }
      }
    },
  },
  methods: {
    actieveLeeftijden(index) {
      if (index == 0) {
        return [
          { value: "V", label: belasting_data.LEEFTIJDEN.V },
          { value: "AOW", label: belasting_data.LEEFTIJDEN.AOW },
        ];
      } else {
        return leeftijdenData;
      }
    },
    inkomenNietEersteVolwassene(index) {
      if (index == 0) {
        return false;
      }
      let leeftijd = this.gegevens[index]["leeftijd"];

      return leeftijd == "V" || leeftijd == "AOW";
    },
    verwijderPersoon(index) {
      this.gegevens.splice(index, 1);
      this.aantalPersonen--;
    },
  },
};
</script>
