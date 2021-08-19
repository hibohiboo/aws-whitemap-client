<template>
  <Dialog
    header="背景画像一覧"
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
      <Toolbar class="p-mb-4">
        <template #left>
          <Button
            label="新規追加"
            icon="pi pi-plus"
            class="p-button-success p-mr-2"
            @click="openCreateModal"
          />
        </template>
      </Toolbar>
      <DataTable
        :value="list"
        responsiveLayout="scroll"
        @row-click="selectData"
      >
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
        <Column field="uid" header="" v-if="editMode">
          <template #body="slotProps">
            <Button
              v-if="state.uid === slotProps.data.uid"
              label="編集"
              icon="pi pi-external-link"
              @click="() => openEditModal(slotProps.data.id)"
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
import { useBackgrounImageStore } from "@/stores/materials";

import DataTable from "primevue/datatable";
import Column from "primevue/column";

import Tag from "primevue/tag";
import { useAuthStore } from "@/stores/auth";
import Toolbar from "primevue/toolbar";
import type { Material } from "@/domain/material/types";
import { useSceneStore } from "@/stores/scenes";

export default defineComponent({
  components: { Dialog, Button, InputText, DataTable, Column, Toolbar, Tag },
  name: "BgmInputDialog",

  setup: () => {
    const sceneStore = useSceneStore();
    const { state } = useAuthStore();
    const {
      materialList,
      closeListModal,
      fetchList,
      openEditModal,
      openCreateModal,
    } = useBackgrounImageStore();
    const list = ref([]) as any;
    const editMode = false;

    const fetch = async () => {
      list.value = await fetchList();
    };
    watch(materialList, () => {
      if (!materialList.displayModal) return;

      fetch();
    });
    fetch();

    const selectData = (event: { data: Material }) => {
      console.log("selectData", event);
      if (editMode) return;

      sceneStore.updateBgImage(event.data);
      materialList.displayModal = false;
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
