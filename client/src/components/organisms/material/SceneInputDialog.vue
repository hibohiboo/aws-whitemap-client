<template>
  <Dialog
    :header="title"
    :modal="true"
    v-model:visible="sceneDialog.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keep-in-view-port="true"
    :min-x="0"
    :min-y="0"
  >
    <div>
      <h5>タイトル※必須</h5>
      <InputText type="text" v-model="sceneDialog.title" />
      <h5>タイトルルビ</h5>
      <InputText type="text" v-model="sceneDialog.titleRuby" />
      <h5>描写</h5>
      <Textarea v-model="sceneDialog.description" :auto-resize="true" />
      <h5>画像</h5>
      <div>
        <Button
          label="画像をアップロード"
          icon="pi pi-pencil"
          class="m-2"
          @click="openBgDireactModal"
        />
        <Button
          label="画像を一覧から選択"
          icon="pi pi-pencil"
          class="m-2"
          @click="bgStore.openListModal"
        />
        <img
          v-if="sceneDialog.bg"
          :src="sceneDialog.bg.url"
          :alt="sceneDialog.bg.name"
          width="200"
        />
      </div>
      <h5>BGM</h5>
      <div class="flex align-items-center">
        <Button
          label="BGMを選択"
          icon="pi pi-pencil"
          class="m-2"
          @click="bgmStore.openListModal"
        />
        <span v-if="sceneDialog.bgm">{{ sceneDialog.bgm.name }}</span>
      </div>
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
import { computed, defineComponent } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { useSceneStore } from '@/stores/scenes';
import { useBackgrounImageStore, useBgmStore } from '@/stores/materials';
// Diralog の draggable、keepInViewPort、minX、minYについては型では必須となっているが、実装ではデフォルト値がある。デフォルト値を設定。

export default defineComponent({
  components: { Dialog, Button, InputText, Textarea },
  name: 'SceneInputDialog',

  setup: () => {
    const { sceneDialog, state, upsert, closeModal } = useSceneStore();
    const bgStore = useBackgrounImageStore();
    const bgmStore = useBgmStore();
    const title = computed(() =>
      sceneDialog.isUpdate ? '編集' : '新しいシーンを登録',
    );
    const openBgDireactModal = () => {
      bgStore.openDirectModal(sceneDialog.id, sceneDialog.title);
    };

    return {
      closeModal,
      title,
      sceneDialog,
      state,
      upsert,
      bgStore,
      bgmStore,
      openBgDireactModal,
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
