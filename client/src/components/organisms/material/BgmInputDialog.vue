<template>
  <Dialog
    :header="title"
    :modal="true"
    v-model:visible="material.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keep-in-view-port="true"
    :min-x="0"
    :min-y="0"
  >
    <div>
      <h5>タイトル※必須</h5>
      <InputText type="text" v-model="material.name" />

      <h5>音楽</h5>
      <FileUpload
        name="bgm"
        accept="audio/*"
        :max-file-size="5000000"
        :file-limit="1"
        choose-label="音楽を選択してください"
        :show-upload-button="false"
        :show-cancel-button="false"
        @select="selected"
      >
        <template #empty>
          <p>ここに音楽をドラッグアンドドロップ(最大5Mbyte)</p>
        </template>
      </FileUpload>
      <h5>タグ</h5>
      <div>スペース区切りで複数入力</div>
      <InputText type="text" v-model="material.tags" />
      <h5>素材サイト名</h5>
      <InputText type="text" v-model="material.materialSiteName" />
      <h5>素材サイトURL</h5>
      <InputText type="text" v-model="material.materialSiteUrl" />
      <h5>利用規約</h5>
      <InputText type="text" v-model="material.licenseName" />
      <h5>利用規約URL</h5>
      <InputText type="text" v-model="material.licenseUrl" />
    </div>
    <template #footer>
      <Button
        label="キャンセル"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button
        label="登録"
        icon="pi pi-check"
        @click="upsertMaterial"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useBgmStore } from '@/stores/materials';
import FileUpload from 'primevue/fileupload';

// Diralog の draggable、keepInViewPort、minX、minYについては型では必須となっているが、実装ではデフォルト値がある。デフォルト値を設定。

export default defineComponent({
  components: { Dialog, Button, InputText, FileUpload },
  name: 'BgmInputDialog',

  setup: () => {
    const { material, state, upsertMaterial, closeModal } = useBgmStore();
    const title = material.isUpdate ? '編集' : '登録';

    const selected = (e: { originalEvent: Event; files: File[] }) => {
      if (!e.files.length) return;
      material.file = e.files[0];
    };

    return {
      closeModal,
      title,
      material,
      state,
      upsertMaterial,
      selected,
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
