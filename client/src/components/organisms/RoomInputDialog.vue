<template>
  <Dialog
    :header="title"
    :modal="true"
    v-model:visible="room.displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :style="{ width: '50vw' }"
    :draggable="true"
    :keepInViewPort="true"
    :minX="0"
    :minY="0"
  >
    <div>
      <h5>タイトル※必須</h5>
      <InputText type="text" v-model="room.title" />

      <h5>ルーム画像</h5>
      <div>png画像をアップロードしてください。</div>
      <FileUpload
        name="demo"
        :url="`/roomUpload/${state.uid}/${room.roomId}`"
        :auto="true"
        accept="image/png"
        :max-file-size="1000000"
        choose-label="画像を選択してください"
        :show-upload-button="false"
        :show-cancel-button="false"
        @upload="uploaded"
        @error="
          (e) => {
            console.log('error', e);
            alert('アップロードに失敗しました');
          }
        "
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
      <h5>タグ</h5>
      <div>スペース区切りで複数入力</div>
      <InputText type="text" v-model="room.tags" />
      <h5>シナリオ名</h5>
      <InputText type="text" v-model="room.scenarioTitle" />
      <h5>シナリオURL</h5>
      <InputText type="text" v-model="room.scenarioUrl" />
      <h5>利用素材</h5>
      <div
        v-for="(item, index) in room.materials"
        :key="index"
        class="flex"
        style="padding-top: 2rem"
      >
        <span class="p-float-label">
          <InputText
            :id="`material-name-${index}`"
            type="text"
            v-model="item.name"
          />
          <label :for="`material-name-${index}`">素材サイト</label>
        </span>
        <span class="p-float-label">
          <InputText
            :id="`material-url-${index}`"
            type="text"
            v-model="item.url"
          />
          <label :for="`material-url-${index}`">サイトURL</label>
        </span>
      </div>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button label="登録" icon="pi pi-check" @click="createRoom" autofocus />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useRoomStore } from "@/stores/room";
import FileUpload from "primevue/fileupload";

// Diralog の draggable、keepInViewPort、minX、minYについては型では必須となっているが、実装ではデフォルト値がある。デフォルト値を設定。

export default defineComponent({
  components: { Dialog, Button, InputText, FileUpload },
  name: "RoomInputDialog",

  setup: () => {
    const { room, state, createRoom, closeModal } = useRoomStore();
    const title = room.isUpdate ? "編集" : "登録";

    const uploaded = () => {
      alert("画像のアップロードに成功しました");
    };

    return {
      closeModal,
      title,
      room,
      state,
      createRoom,
      uploaded,
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
