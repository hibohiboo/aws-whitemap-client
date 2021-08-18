<template>
  <div class="wrapper">
    <div class="left-area"></div>
    <div class="main-area">
      <h1>{{ scenario.title }}</h1>
      <img
        src="https://d29r5tmujsb0y1.cloudfront.net/data/background-images/W8NO28NuAQgRsiZAYYMNmQ29O2z2/QGsdcK6dYrfmIPf3R3CL.jpg"
        width="800"
        height="600"
      />
      <div class="flex justify-content-between">
        <div>
          <Button label="前のシーン" icon="pi pi-caret-left" class="hidden" />
        </div>
        <div>
          <Button
            label="次のシーン"
            icon="pi pi-caret-right"
            class="flex m-2"
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
    const scenario = reactive({
      id: GLOBAL_SCENARIO_ID,
      title: "白地図と足跡",
      firstSceneId: "",
    });
    const sceneStore = useSceneStore();
    const openModal = () => {
      console.log("open");
      sceneStore.openCreateModal(GLOBAL_SCENARIO_ID);
    };
    return { scenario, openModal };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
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
</style>
