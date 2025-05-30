<template>
  <n-card title="Huishouden" size="small">
    <n-space vertical>
      <n-space :wrap="false" justify="space-between">
        Stel aantal personen in:
        <n-select v-model:value="aantalPersonen" :options="personOptions" :consistent-menu-width="false" />
      </n-space>

      <n-table :bordered="false" size="small" striped>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Leeftijd</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in personenGegevens" :key="p" size="small">
            <td>{{ index + 1 }}</td>
            <td>
              <n-select
                v-model:value="personenGegevens[index]['leeftijd']"
                :options="actieveLeeftijden(index)"
                :consistent-menu-width="false"
              />
              <div v-if="inkomenNietEersteVolwassene(index)">
                <n-radio-group v-model:value="personenGegevens[index].inkomen_type">
                  <n-radio label="Bruto inkomen p/j" key="bruto" value="bruto" size="small" />
                  <n-radio label="Percentage van eerste inkomen" key="percentage" value="percentage" size="small" />
                </n-radio-group>
                <n-input-number
                  v-if="personenGegevens[index].inkomen_type === 'bruto'"
                  placeholder="Bruto inkomen p/j"
                  :input-props="{id:index+'bruto_inkomen'}"
                  min="0"
                  step="1"
                  size="small"
                  v-model:value="personenGegevens[index]['bruto_inkomen']"
                >
                  <template #prefix>&euro;</template>
                </n-input-number>
                <n-input-number
                  v-if="personenGegevens[index].inkomen_type === 'percentage'"
                  placeholder="Percentage van eerste inkomen"
                  :input-props="{id:index+'percentage'}"
                  min="0"
                  step="1"
                  size="small"
                  v-model:value="personenGegevens[index]['percentage']"
                >
                  <template #suffix>%</template>
                </n-input-number>
              </div>
              <div v-if="inkomenEersteVolwassene(index)">
                <label :for="index+'franchise'">Pensioen Franchise</label>
                <n-input-number
                  placeholder="Pensioen Franchise"
                  :input-props="{id:index+'franchise'}"
                  min="0"
                  step="1"
                  size="small"
                  v-model:value="personenGegevens[index]['pensioenFranchise']"
                >
                  <template #prefix>&euro;</template>
                </n-input-number>
                <label :for="index+'premiePercentage'">Pensioenpremie Percentage</label>
                <n-input-number
                  placeholder="Pensioenpremie Percentage"
                  :input-props="{id:index+'premiePercentage'}"
                  min="0"
                  max="100"
                  step="0.01"
                  size="small"
                  v-model:value="personenGegevens[index]['pensioenPremiePercentage']"
                >
                  <template #suffix>%</template>
                </n-input-number>
              </div>
            </td>
            <td>
              <n-button v-if="index != 0" text @click="verwijderPersoon(index)" size="20" class="deleteButton">
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
      personenGegevens: [],
      aantalPersonen: 1,
    };
  },
  watch: {
    personen(newPersonen, oldPersonen) {
      this.personenGegevens = this.personen;
      this.aantalPersonen = this.personen.length;
    },
    aantalPersonen(newGegevens, oldGegevens) {
      let current = this.personenGegevens;

      if (current.length == newGegevens) {
        return;
      }
      if (oldGegevens > newGegevens) {
        for (let i = 0; i < oldGegevens - newGegevens; i++) {
          current.pop();
        }
      } else if (newGegevens > oldGegevens) {
        for (let i = 0; i < newGegevens - oldGegevens; i++) {
          // moet altijd geldige waarde hebben, dus initialiseer met 'V'
          current.push({
            leeftijd: "V",
            inkomen_type: "bruto",
            bruto_inkomen: 0,
            pensioenFranchise: 0,
            pensioenPremiePercentage: 0,
          });
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
    volwassene(index) {
      let leeftijd = this.personenGegevens[index]["leeftijd"];

      return leeftijd == "V" || leeftijd == "AOW";
    },
    inkomenEersteVolwassene(index) {
      return index === 0 && this.volwassene(index);
    },
    inkomenNietEersteVolwassene(index) {
      return index !== 0 && this.volwassene(index);
    },
    verwijderPersoon(index) {
      this.personenGegevens.splice(index, 1);
      this.aantalPersonen--;
    },
  },
};
</script>
