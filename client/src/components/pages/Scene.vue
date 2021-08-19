<template>
  <div class="wrapper">
    <div class="left-area"></div>
    <div class="main-area">
      <h1>{{ scenario.title }}</h1>
      <div class="scene-area">
        <div class="scene-title">{{ scene.title }}</div>
        <img
          src="https://d29r5tmujsb0y1.cloudfront.net/data/background-images/W8NO28NuAQgRsiZAYYMNmQ29O2z2/QGsdcK6dYrfmIPf3R3CL.jpg"
          width="800"
        />
        />
      </div>
      <div class="flex justify-content-between">
        <div>
          <Button label="前のシーン" icon="pi pi-caret-left" class="hidden" />
        </div>
        <div>
          <Button
            label="次のシーン"
            icon="pi pi-caret-right"
            class="flex m-2 next-button"
            iconPos="right"
          />
          <Button
            label="次のシーン"
            icon="pi pi-caret-right"
            class="flex m-2"
            iconPos="right"
          />
        </div>
      </div>
    </div>
    <div class="right-area">
      <h2>シーン情報</h2>
      <div>
        <Button
          label="次のシーンを追加"
          icon="pi pi-plus"
          class="flex m-2"
          @click="openModal"
        />
        <Button
          label="このシーンを編集"
          icon="pi pi-pencil"
          class="flex m-2"
          @click="editModal"
        />
      </div>
      <audio
        controls
        loop
        src="https://d29r5tmujsb0y1.cloudfront.net/data/bgms/W8NO28NuAQgRsiZAYYMNmQ29O2z2/oUu5AeRO56LgC0qGvuFO.mp3"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, reactive } from "vue";
import BackgroundImageInputDialog from "@/components/organisms/material/BackgroundImageInputDialog.vue";
import BgmInputDialog from "@/components/organisms/material/BgmInputDialog.vue";
import { useAuthStore } from "@/stores/auth";
import { useSceneStore } from "@/stores/scenes";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import BGGridBox from "../atoms/BGGridBox.vue";
import { GLOBAL_SCENARIO_ID } from "@/domain/scenario/constants";
import { useRoute } from "vue-router";

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
    const route = useRoute();
    const scenario = reactive({
      id: GLOBAL_SCENARIO_ID,
      title: "白地図と足跡",
      firstSceneId: "",
    });
    const { id } = route.params;
    const sceneStore = useSceneStore();
    if (!id || typeof id !== "string") {
      location.href = "/whitemap/";
      return;
    }
    sceneStore.fetchScene(id);
    const openModal = () => {
      sceneStore.openCreateModal(GLOBAL_SCENARIO_ID);
    };
    const editModal = () => {
      sceneStore.openEditModal({ ...sceneStore.scene });
    };
    return { scenario, openModal, editModal, scene: sceneStore.scene };
  },
});
</script>

<style lang="scss" scoped>
$mincho: "游明朝", YuMincho, "Hiragino Mincho ProN W3", "ヒラギノ明朝 ProN W3",
  "Hiragino Mincho ProN", "HG明朝E", "ＭＳ Ｐ明朝", "ＭＳ 明朝", serif;
.main-area {
  position: relative;
}
.scene- {
  &area {
    img {
      width: 100%;
    }
  }
  &title {
    font-family: $mincho;
    font-size: 1.3rem;

    line-height: 1.5;
    position: absolute;
    margin: 10px;
    padding: 5px 10px;
    background-color: var(--surface-ground);
  }
}
.next-button {
  font-family: $mincho;
  font-weight: bold;
  font-size: 1.3rem;
}
@media screen and (min-width: 800px) {
  .wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .left-area {
    width: 100px;
  }
  .main-area {
    width: 800px;
  }
  .right-area {
    padding: 10px;
  }

  .scene- {
    &area {
      width: 800px;
      height: 600px;
    }
  }
}
</style>
