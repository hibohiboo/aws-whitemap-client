<template>
  <h1></h1>
  <Button
    v-if="state.isLoggedin"
    label="背景素材追加"
    icon="pi pi-external-link"
    @click="openCreateModal"
  />
  <Button
    v-if="state.isLoggedin"
    label="編集"
    icon="pi pi-external-link"
    @click="() => openEditModal('QGsdcK6dYrfmIPf3R3CL')"
  />
  <BackgroundImageInputDialog />
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import BackgroundImageInputDialog from "@/components/organisms/material/BackgroundImageInputDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { useBackgrounImageStore } from "@/stores/materials";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";

export default defineComponent({
  components: {
    BackgroundImageInputDialog,
    Button,
    Tag,
    InputText,
    Dialog,
  },
  name: "Main",
  setup: () => {
    const query = decodeURI(location.search).replace("?", "");
    const q = ref(query || "");

    const { signin, state } = useAuthStore();
    const { openCreateModal, openEditModal } = useBackgrounImageStore();
    signin();

    const removeEmptyName = (materials: { name: string; url: string }[]) =>
      materials.filter((i) => !!i.name);

    const createTweet = (roomId: string, uid: string, title: string) =>
      `https://twitter.com/intent/tweet?url=https://az-php-app.azurewebsites.net/room/${uid}/${roomId}?${encodeURI(
        encodeURI(title),
      )}`; // tweetの画面で1回デコードされるので、tweetの画面でもエンコードされた文字列であるように2回エンコードする
    const createTags = (tags: string) => tags.split(" ").filter((i) => !!i);
    return {
      openCreateModal,
      openEditModal,
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
