<template>
  <div class="flex flex-col items-start">
    <div class="flex justify-between p-3 w-full">
      <div class="flex flex-col text-white">
        <div class="flex items-center border-b-white border-b">
          <h1 class="text-4xl sm:text-6xl font-bold mr-2">Er</h1>
          <img
            class="
              h-7
              w-7
              sm:h-10 sm:w-10
              transform
              -translate-x-1
              translate-y-1
            "
            src="../../assets/eros_web.svg"
          />
        </div>
        <h1>Graphics Cards</h1>
      </div>

      <div class="flex flex-col space-y-2">
        <Dropdown
          :options="options"
          option-label="label"
          placeholder="Choose filter"
        />
        <Dropdown
          :options="store.retailers"
          :show-clear="true"
          placeholder="Choose retailer"
          optionLabel="name"
          optionValue="name"
          v-model="store.selectedRetailer"
        />
        <InputText
          v-model="filters.global.value"
          v-if="renderTable"
          placeholder="Keyword Search"
        />
        <div class="p-field-checkbox">
          <Checkbox
            class="h-5 w-5 text-indigo-500"
            name="showOnlyInStock"
            v-model="store.showOnlyInStock"
            :binary="true"
            id="showOnlyInStock"
          />
          <label class="ml-2 text-white" for="showOnlyInStock"
            >Only products in stock?</label
          >
        </div>
      </div>
    </div>
    <div class="m-5" v-if="renderTable">
      <DataTable
        :value="store.filteredGraphicsCards"
        :loading="!!!store.filteredGraphicsCards.length"
        v-model:filters="filters"
        :rowHover="true"
        @row-click="handleRowClicked"
      >
        <template #loading> Loading data. Please wait... </template>
        <Column
          field="name"
          sortable
          header="Product name"
          class="sm:w-3/5"
        ></Column>
        <Column field="price" sortable header="Price (SEK)"></Column>
        <Column field="inStock" sortable header="Stock status">
          <template #body="slotProps">
            <Chip
              class="text-white"
              :class="{
                'bg-green-600': slotProps.data.inStock,
                'bg-red-500': !slotProps.data.inStock,
              }"
            >
              {{
                slotProps.data.inStock
                  ? `In stock!`
                  : `Out of stock`
              }}
            </Chip>
          </template>
        </Column>
        <Column field="retailer.name" sortable header="Retailer">
        </Column>
      </DataTable>
    </div>
    <div v-else class="flex flex-col">
      <div
        class="
          bg-white
          rounded
          m-3
          shadow-md
          p-2
          flex flex-col
          space-y-2
          w-12/12
        "
        v-for="card in store.filteredGraphicsCards"
        :key="card.id"
      >
        <div class="flex flex-col">
          <h1>Product name</h1>
          <small>{{ card.name }}</small>
        </div>
        <Divider></Divider>
        <div class="flex flex-col">
          <h1>Price (SEK)</h1>
          <small>{{ card.price }}</small>
        </div>
        <Divider></Divider>
        <div class="flex flex-col">
          <h1>Stock status</h1>
          <div>
            <Chip
              class="text-white"
              :class="{
                'bg-green-600': card.inStock,
                'bg-red-500': !card.inStock,
              }"
            >
              {{
                card.inStock
                  ? `In stock!`
                  : `Out of stock`
              }}
            </Chip>
          </div>
        </div>
        <Divider></Divider>
        <div class="flex flex-col">
          <h1>Retailer</h1>
          <small>{{ card.retailer.name }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FILTER_OPTIONS, HEART_EYE_CAT, SAD_CAT } from "../../assets/constants";
import { useGraphicsCardsStore } from "./graphics-cards.store";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Chip from "primevue/chip";
import Divider from "primevue/divider";
import { FilterMatchMode } from "primevue/api";
export default defineComponent({
  setup() {
    const store = useGraphicsCardsStore();
    store.getGraphicsCards();
    store.getRetailers();
    const filters = ref({
      global: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
    });

    function handleRowClicked(event: any) {
      window.open(event.data.url, "_blank")?.focus();
    }

    const renderTable = window.innerWidth > 700;

    return {
      store,
      sadCat: SAD_CAT,
      happyCat: HEART_EYE_CAT,
      options: FILTER_OPTIONS,
      filters,
      handleRowClicked,
      renderTable,
    };
  },
  components: {
    Dropdown,
    InputText,
    Checkbox,
    DataTable,
    Column,
    Chip,
    Divider,
  },
});
</script>
