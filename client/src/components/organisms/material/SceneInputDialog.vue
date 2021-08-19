<template>
  <Dialog
    :header="title"
    :modal="true"
    v-model:visible="sceneDialog.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keepInViewPort="true"
    :minX="0"
    :minY="0"
  >
    <div>
      <h5>タイトル※必須</h5>
      <InputText type="text" v-model="sceneDialog.title" />
      <h5>画像</h5>
      <Button
        label="画像を選択"
        icon="pi pi-pencil"
        class="flex m-2"
        @click="openListModal"
      />
    </div>
    <template #footer>
      <Button
        label="キャンセル"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button label="登録" icon="pi pi-check" @click="upsert" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useSceneStore } from "@/stores/scenes";
import FileUpload from "primevue/fileupload";
import { useBackgrounImageStore } from "@/stores/materials";
// Diralog の draggable、keepInViewPort、minX、minYについては型では必須となっているが、実装ではデフォルト値がある。デフォルト値を設定。

export default defineComponent({
  components: { Dialog, Button, InputText, FileUpload },
  name: "SceneInputDialog",

  setup: () => {
    const { sceneDialog, state, upsert, closeModal } = useSceneStore();
    const { openListModal } = useBackgrounImageStore();
    const title = computed(() =>
      sceneDialog.isUpdate ? "編集" : "新しいシーンを登録",
    );

    return {
      closeModal,
      title,
      sceneDialog,
      state,
      upsert,
      openListModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-skeleton {
  border: 1px solid var(--surface-d);
  border-radius: 4px;

  ul {
    list-style: none;
  }
}
</style>
