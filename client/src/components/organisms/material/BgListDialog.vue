<template>
  <Dialog
    header="背景画像一覧"
    :modal="true"
    v-model:visible="materialList.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keepInViewPort="true"
    :minX="0"
    :minY="0"
  >
    <div>
      <DataTable :value="list" responsiveLayout="scroll">
        <Column field="name" header="名前"></Column>
        <Column field="url" header="">
          <template #body="slotProps">
            <img
              :src="slotProps.data.url"
              :alt="slotProps.data.name"
              width="200"
              loading="lazy"
            />
          </template>
        </Column>
        <Column field="tags" header="タグ">
          <template #body="{ data }">
            <Tag
              v-for="(t, i) in data.tags.split(' ')"
              :key="`${t}${i}`"
              :class="'m-1'"
              :value="t"
            />
          </template>
        </Column>
        <Column field="materialSite" header="配布サイト">
          <template #body="slotProps">
            <a :href="slotProps.data.materialSiteUrl" target="_blank">
              {{ slotProps.data.materialSiteName }}</a
            >
          </template>
        </Column>
        <Column field="license" header="規約">
          <template #body="slotProps">
            <a :href="slotProps.data.licenseUrl" target="_blank">
              {{ slotProps.data.licenseName }}</a
            >
          </template>
        </Column>
      </DataTable>
    </div>
    <template #footer>
      <Button
        label="キャンセル"
        icon="pi pi-times"
        @click="closeListModal"
        class="p-button-text"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, watchEffect } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useBackgrounImageStore } from "@/stores/materials";

import DataTable from "primevue/datatable";
import Column from "primevue/column";

import Tag from "primevue/tag";
export default defineComponent({
  components: { Dialog, Button, InputText, DataTable, Column, Tag },
  name: "BgmInputDialog",

  setup: () => {
    const { materialList, closeListModal, fetchList } =
      useBackgrounImageStore();
    const list = ref([]) as any;

    const fetch = async () => {
      list.value = await fetchList();
    };
    fetch();
    return {
      materialList,
      closeListModal,
      list,
    };
  },
});
</script>

<style lang="scss" scoped></style>
