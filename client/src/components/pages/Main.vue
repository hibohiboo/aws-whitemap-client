<template>
  <h1></h1>
  <BGGridBox style="width: 100vw; height: 100vh" />
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
    label="編集"
    icon="pi pi-external-link"
    @click="() => openBGEditModal('QGsdcK6dYrfmIPf3R3CL')"
  />
  <Button
    v-if="state.isLoggedin"
    label="bgm編集"
    icon="pi pi-external-link"
    @click="() => openBGMEditModal('oUu5AeRO56LgC0qGvuFO')"
  />

  <BackgroundImageInputDialog />
  <BgmInputDialog />
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import BackgroundImageInputDialog from "@/components/organisms/material/BackgroundImageInputDialog.vue";
import BgmInputDialog from "@/components/organisms/material/BgmInputDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { useBackgrounImageStore, useBgmStore } from "@/stores/materials";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import BGGridBox from "../atoms/BGGridBox.vue";
export default defineComponent({
  components: {
    BackgroundImageInputDialog,
    BgmInputDialog,
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
.custom-skeleton {
  border: 1px solid var(--surface-d);
  border-radius: 4px;

  ul {
    list-style: none;
  }
}
.product-item {
  .product-item-content {
    border: 1px solid var(--surface-d);
    border-radius: 3px;
    margin: 0.3rem;
    text-align: center;
    padding: 2rem 0;
  }

  .product-image {
    width: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
  .product-badge {
    margin: 10px;
  }
  .product-tags {
    padding-bottom: 10px;
    cursor: pointer;
  }
  .product-table {
    display: flex;
    justify-content: center;
    margin: 10px;
    table {
      border: solid 2px #000;
      border-collapse: collapse;
      td,
      th {
        border: solid 1px #000;
        padding: 5px;
      }
    }
  }
}
</style>
