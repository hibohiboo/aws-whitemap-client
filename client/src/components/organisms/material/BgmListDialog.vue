<template>
  <Dialog
    header="BGM一覧"
    :modal="true"
    v-model:visible="materialList.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '70vw' }"
    :draggable="true"
    :keepInViewPort="true"
    :minX="0"
    :minY="0"
  >
    <div>
      <DataTable
        :value="list"
        responsiveLayout="scroll"
        @row-click="selectData"
        v-model:filters="filters"
      >
        <template #header>
          <div class="flex justify-content-between">
            <div>
              <Button
                label="新規追加"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openCreateModal"
              />
              <a href="/whitemap/infos/agreement.html" target="_blank">
                利用規約
              </a>
            </div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="検索" />
            </span>
          </div>
        </template>
        <Column field="name" header="名前"></Column>
        <Column field="url" header="">
          <template #body="slotProps">
            <audio controls loop :src="slotProps.data.url">
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </template>
        </Column>
        <Column field="tags" header="タグ">
          <template #body="{ data }">
            <Tag
              v-for="(t, i) in data.tags.split(' ')"
              :key="`${t}${i}`"
              :class="'m-1 cursor-pointer'"
              :value="t"
              @click="(e) => updateFilter(t, e)"
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
        <Column field="uid" header="" v-if="editMode">
          <template #body="slotProps">
            <Button
              v-if="state.uid === slotProps.data.uid"
              label="編集"
              icon="pi pi-external-link"
              @click="
                () => {
                  openEditModal(slotProps.data.id);
                  materialList.displayModal = false;
                }
              "
            />
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
import { useBgmStore } from "@/stores/materials";

import DataTable from "primevue/datatable";
import Column from "primevue/column";

import Tag from "primevue/tag";
import { useAuthStore } from "@/stores/auth";
import Toolbar from "primevue/toolbar";
import type { Material } from "@/domain/material/types";
import { useSceneStore } from "@/stores/scenes";
import { FilterMatchMode } from "primevue/api";

export default defineComponent({
  components: { Dialog, Button, InputText, DataTable, Column, Toolbar, Tag },
  name: "BgmListDialog",

  setup: () => {
    const sceneStore = useSceneStore();
    const { state } = useAuthStore();
    const {
      materialList,
      closeListModal,
      fetchList,
      openEditModal,
      openCreateModal,
    } = useBgmStore();
    const list = ref([]) as any;
    const editMode = true;

    const fetch = async () => {
      list.value = await fetchList();
    };
    watch(materialList, () => {
      if (!materialList.displayModal) return;

      fetch();
    });
    fetch();

    const selectData = (event: { data: Material }) => {
      // console.log("selectData", event);
      // if (editMode) return;

      sceneStore.updateBgm(event.data);
      materialList.displayModal = false;
    };
    const filters = reactive({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const updateFilter = (tag: string, e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      filters.global.value = tag as any;
    };
    return {
      materialList,
      closeListModal,
      openEditModal,
      list,
      state,
      openCreateModal,
      editMode,
      selectData,
      filters,
      updateFilter,
    };
  },
});
</script>

<style lang="scss" scoped></style>
