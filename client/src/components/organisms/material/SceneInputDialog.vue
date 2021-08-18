<template>
  <Dialog
    :header="title"
    :modal="true"
    v-model:visible="scene.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keepInViewPort="true"
    :minX="0"
    :minY="0"
  >
    <div>
      <h5>タイトル※必須</h5>
      <InputText type="text" v-model="scene.title" />
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
import { defineComponent } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useSceneStore } from "@/stores/scenes";
import FileUpload from "primevue/fileupload";

// Diralog の draggable、keepInViewPort、minX、minYについては型では必須となっているが、実装ではデフォルト値がある。デフォルト値を設定。

export default defineComponent({
  components: { Dialog, Button, InputText, FileUpload },
  name: "SceneInputDialog",

  setup: () => {
    const { scene, state, upsert, closeModal } = useSceneStore();
    const title = scene.isUpdate ? "編集" : "新しいシーンを登録";

    return {
      closeModal,
      title,
      scene,
      state,
      upsert,
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
