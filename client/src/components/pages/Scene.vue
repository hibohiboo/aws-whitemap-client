<template>
  <div class="wrapper">
    <div class="left-area"></div>
    <div class="main-area">
      <h1>{{ scenario.title }}</h1>
      <div class="scene-area">
        <div class="scene-title">{{ scene.title }}</div>
        <div class="scene-img-name" v-if="scene.bg">
          <div>{{ scene.bg.name }}</div>
          <a
            class="scene-img-site"
            :href="scene.bg.materialSiteUrl"
            target="_blank"
            >{{ scene.bg.materialSiteName }}</a
          >
        </div>
        <div class="scene-bgm-name" v-if="scene.bgm">
          <div>♪{{ scene.bgm.name }}</div>
          <a
            class="scene-bgm-site"
            :href="scene.bgm.materialSiteUrl"
            target="_blank"
            >{{ scene.bgm.materialSiteName }}</a
          >
        </div>
        <img v-if="scene.bg" :src="scene.bg.url" width="800" />
      </div>
      <div class="flex justify-content-between">
        <div>
          <Button label="前のシーン" icon="pi pi-caret-left" class="hidden" />
        </div>
        <div>
          <router-link
            :to="`/scene/${item.to_id}`"
            v-for="item in scene.nexts"
            :key="item.to_id"
            class="no-underline"
          >
            <Button
              :label="item.to_name"
              icon="pi pi-caret-right"
              class="flex m-2 next-button"
              iconPos="right"
          /></router-link>
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
          v-if="state.uid === scene.uid"
        />
      </div>
      <table v-if="scene.bg">
        <tr>
          <th>画像</th>
          <td>{{ scene.bg.name }}</td>
        </tr>
        <tr>
          <th>素材サイト</th>
          <td>
            <a :href="scene.bg.materialSiteUrl" target="_blank">{{
              scene.bg.materialSiteName
            }}</a>
          </td>
        </tr>
        <tr>
          <th>利用規約</th>
          <td>
            <a :href="scene.bg.licenseUrl" target="_blank">{{
              scene.bg.licenseName
            }}</a>
          </td>
        </tr>
      </table>

      <table v-if="scene.bgm">
        <tr>
          <th>BGM</th>
          <td>{{ scene.bgm.name }}</td>
        </tr>
        <tr>
          <th>素材サイト</th>
          <td>
            <a :href="scene.bgm.materialSiteUrl" target="_blank">{{
              scene.bgm.materialSiteName
            }}</a>
          </td>
        </tr>
        <tr>
          <th>利用規約</th>
          <td>
            <a :href="scene.bgm.licenseUrl" target="_blank">{{
              scene.bgm.licenseName
            }}</a>
          </td>
        </tr>
      </table>

      <JukeBox
        v-if="scene.bgm && scene.bgm.url"
        :auto="true"
        :src="scene.bgm.url"
      />
      <div>
        <h5>足跡</h5>
        <div v-for="asiato in history" :key="asiato.created_at">
          <router-link :to="`/scene/${asiato.id}`" class="no-underline"
            >{{ asiato.name }}
            <span style="font-size: 0.6rem">{{
              asiato.created_at
            }}</span></router-link
          >
        </div>
      </div>
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
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import JukeBox from "@/components/atoms/JukeBox.vue";
import { asiatoRepository } from "@/domain/asiato/repository";
import format from "date-fns/format";
import addHours from "date-fns/addHours";

export default defineComponent({
  components: {
    BackgroundImageInputDialog,
    JukeBox,
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
    const { state } = useAuthStore();
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
    const asiatoList = ref(asiatoRepository.getList());

    const updateAsiatoList = async () => {
      asiatoList.value = await asiatoRepository.insert(
        asiatoList.value,
        sceneStore.scene.uid,
        sceneStore.scene.id,
        sceneStore.scene.title,
      );
    };

    const openModal = () => {
      sceneStore.openCreateModal(GLOBAL_SCENARIO_ID, id);
    };
    const editModal = () => {
      sceneStore.openEditModal({ ...sceneStore.scene });
    };
    onBeforeRouteUpdate((to, from) => {
      console.log("scene", sceneStore.scene);
      console.log("route", `to:${to}, from:${from}, id: ${id}`);
      if (!to.params.id || typeof to.params.id !== "string") {
        return;
      }

      sceneStore.fetchScene(to.params.id).then(updateAsiatoList);
    });

    sceneStore.fetchScene(id).then(updateAsiatoList);
    const history = computed(() =>
      asiatoList.value.map((a) => ({
        name: a.scene_name,
        id: a.scene_id,
        created_at: format(
          addHours(new Date(a.created_at), 9),
          "yyyy-MM-dd HH:mm:ss",
        ),
      })),
    );
    return {
      scenario,
      openModal,
      editModal,
      scene: sceneStore.scene,
      state,
      history,
    };
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

  &img-name {
    display: none;
  }
  &bgm-name {
    display: none;
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
      overflow: hidden;
    }
    &img-name {
      display: block;
      z-index: 1;
      font-size: 1.3rem;

      line-height: 1.5;
      position: absolute;
      top: 600px;
      margin: 10px;
      padding: 5px 10px;
      text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000,
        -1px -1px 0 #000;
      a {
        text-decoration: none;
        font-size: 1rem;
      }
    }
    &bgm-name {
      display: block;
      text-align: right;
      z-index: 1;
      font-size: 1.3rem;

      line-height: 1.5;
      position: absolute;
      white-space: nowrap;
      top: 600px;
      left: 290px;
      width: 500px;
      margin: 10px;
      padding: 5px 10px;
      text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000,
        -1px -1px 0 #000;
      a {
        text-decoration: none;
        font-size: 1rem;
      }
    }
  }
}
</style>
