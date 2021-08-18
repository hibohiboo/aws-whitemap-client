<template>
  <BGGridBox class="outer-wrapper">
    <div class="outer-main-area"><router-view></router-view></div>
    <div class="outer-edit-area">
      <Button
        v-if="state.isLoggedin"
        label="背景素材追加"
        icon="pi pi-external-link"
        @click="openBGCreateModal"
      />
      <Button
        v-if="state.isLoggedin"
        label="BGM素材追加"
        icon="pi pi-external-link"
        @click="openBGMCreateModal"
      />
      <Button
        v-if="state.isLoggedin"
        label="背景素材編集"
        icon="pi pi-external-link"
        @click="() => openBGEditModal('QGsdcK6dYrfmIPf3R3CL')"
      />
      <Button
        v-if="state.isLoggedin"
        label="BGM素材編集"
        icon="pi pi-external-link"
        @click="() => openBGMEditModal('oUu5AeRO56LgC0qGvuFO')"
      />
    </div>
  </BGGridBox>
  <SceneInputDialog />
  <BackgroundImageInputDialog />
  <BgmInputDialog />
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import BackgroundImageInputDialog from "@/components/organisms/material/BackgroundImageInputDialog.vue";
import BgmInputDialog from "@/components/organisms/material/BgmInputDialog.vue";
import SceneInputDialog from "@/components/organisms/material/SceneInputDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { useBackgrounImageStore, useBgmStore } from "@/stores/materials";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import BGGridBox from "../../atoms/BGGridBox.vue";

export default defineComponent({
  components: {
    BackgroundImageInputDialog,
    BgmInputDialog,
    SceneInputDialog,
    Button,
    Tag,
    InputText,
    Dialog,
    BGGridBox,
  },
  name: "Main",
  setup: () => {
    const query = decodeURI(location.search).replace("?", "");
    const q = ref(query || "");

    const { signin, state } = useAuthStore();
    const bgImageStore = useBackgrounImageStore();
    const bgmStore = useBgmStore();

    signin();

    const removeEmptyName = (materials: { name: string; url: string }[]) =>
      materials.filter((i) => !!i.name);

    const createTweet = (roomId: string, uid: string, title: string) =>
      `https://twitter.com/intent/tweet?url=https://az-php-app.azurewebsites.net/room/${uid}/${roomId}?${encodeURI(
        encodeURI(title),
      )}`; // tweetの画面で1回デコードされるので、tweetの画面でもエンコードされた文字列であるように2回エンコードする
    const createTags = (tags: string) => tags.split(" ").filter((i) => !!i);
    return {
      openBGCreateModal: bgImageStore.openCreateModal,
      openBGEditModal: bgImageStore.openEditModal,
      openBGMCreateModal: bgmStore.openCreateModal,
      openBGMEditModal: bgmStore.openEditModal,
      state,
      q,
      removeEmptyName,
      createTags,
      createTweet,
    };
  },
});
</script>

<style lang="scss" scoped>
$editWidth: 250px;

.outer-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
}
.outer-main-area {
  border: solid 1px #fff;
  width: calc(100% - #{$editWidth});
}
.outer-edit-area {
  padding: 10px;
  width: $editWidth;
  border: solid 1px #fff;
}
</style>
