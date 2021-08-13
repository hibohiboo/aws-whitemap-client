<template>
  <h1></h1>
  <Button
    v-if="state.isLoggedin"
    label="ルームスクリーンショット追加"
    icon="pi pi-external-link"
    @click="openCreateModal"
  />
  <RoomInputDialog />

  <Carousel
    :value="filterdRooms"
    :num-visible="3"
    :num-scroll="3"
    :responsive-options="responsiveOptions"
  >
    <template #header>
      <h2>ココフォリア・ユドナリウムのルーム集</h2>
      <p>ステキなルームを共有して、新しいシナリオや素材と出会いましょう。</p>
      <p>
        セッション記念、ルーム作りの参考、シナリオ探し、素材探し。沢山のルームが投稿されて、次のセッションが生まれたらいいなと思います。
      </p>
      <label
        >絞りこみ:
        <InputText v-model="q" />
      </label>
    </template>
    <template #item="slotProps">
      <div class="product-item">
        <div class="product-item-content">
          <div class="p-mb-3">
            <img
              loading="lazy"
              :src="`/uploads/${slotProps.data.uid}/${slotProps.data.roomId}.png`"
              :alt="slotProps.data.name"
              class="product-image"
              @click="
                () =>
                  openDisplayModal(
                    `/uploads/${slotProps.data.uid}/${slotProps.data.roomId}.png`,
                  )
              "
            />
          </div>
          <div>
            <h4 class="p-mb-1">{{ slotProps.data.title }}</h4>
            <div class="product-tags">
              <span :class="'product-badge status-'">
                <Tag
                  v-for="(item, index) in createTags(slotProps.data.tags)"
                  :key="`tag-${index.toString()}`"
                  :value="item"
                  style="margin-left: 10px; margin-bottom: 10px"
                  @click="() => (q = item)"
              /></span>
            </div>
            <div class="product-table">
              <table>
                <tr v-if="slotProps.data.scenarioTitle">
                  <th>シナリオ</th>
                  <td>
                    <a
                      v-if="slotProps.data.scenarioUrl"
                      :href="slotProps.data.scenarioUrl"
                      target="_blank"
                      >{{ slotProps.data.scenarioTitle }}</a
                    >
                    <span v-else>{{ slotProps.data.scenarioTitle }}</span>
                  </td>
                </tr>
                <tr
                  v-for="(item, index) in removeEmptyName(
                    slotProps.data.materials,
                  )"
                  :key="`material-${index.toString()}`"
                >
                  <th>利用素材</th>
                  <td>
                    <a v-if="item.url" :href="item.url" target="_blank">{{
                      item.name
                    }}</a>
                    <span v-else>{{ item.name }}</span>
                  </td>
                </tr>
              </table>
            </div>
            <div style="padding-bottom: 10px">
              <a
                :href="
                  createTweet(
                    slotProps.data.roomId,
                    slotProps.data.uid,
                    slotProps.data.title,
                  )
                "
                class="twitter-share-button"
                data-show-count="false"
                target="_blank"
                style="text-decoration: none"
                ><Button
                  icon="pi pi-twitter"
                  class="p-button-rounded p-button-primary"
              /></a>
            </div>

            <div class="car-buttons p-mt-5">
              <Button
                v-if="state.uid === slotProps.data.uid"
                icon="pi pi-cog"
                class="p-button-help p-button-rounded"
                label="編集"
                @click="() => openEditModal(slotProps.data)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Carousel>
  <Dialog
    v-model:visible="displayModal"
    :dismissable-mask="true"
    :modal="true"
    :show-header="false"
    :maximizable="true"
    content-class="p-0"
  >
    <img :src="displayImage" alt="preview" :style="{ width: '100%' }"
  /></Dialog>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import RoomInputDialog from '@/components/organisms/RoomInputDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { useRoomStore } from '@/stores/room';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';
import roomsStore from '@/stores/rooms';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

export default defineComponent({
  components: { RoomInputDialog, Carousel, Button, Tag, InputText, Dialog },
  name: 'Main',
  setup: () => {
    const query = decodeURI(location.search).replace('?', '');
    const q = ref(query || '');

    const { signin, state } = useAuthStore();
    const { openCreateModal, openEditModal } = useRoomStore();
    signin();
    const { rooms } = roomsStore();

    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '600px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    const displayModal = ref(false);
    const displayImage = ref('');
    const openDisplayModal = (img: string) => {
      displayImage.value = img;
      displayModal.value = true;
    };
    const removeEmptyName = (materials: { name: string; url: string }[]) =>
      materials.filter((i) => !!i.name);
    const filterdRooms = computed(() =>
      rooms.list.filter((i: { tags: string; title: string }) =>
        `${i.tags}${i.title}`.includes(q.value),
      ),
    );
    const createTweet = (roomId: string, uid: string, title: string) =>
      `https://twitter.com/intent/tweet?url=https://az-php-app.azurewebsites.net/room/${uid}/${roomId}?${encodeURI(
        encodeURI(title),
      )}`; // tweetの画面で1回デコードされるので、tweetの画面でもエンコードされた文字列であるように2回エンコードする
    const createTags = (tags: string) => tags.split(' ').filter((i) => !!i);
    return {
      openCreateModal,
      openEditModal,
      state,
      responsiveOptions,
      rooms,
      q,
      displayModal,
      displayImage,
      openDisplayModal,
      removeEmptyName,
      filterdRooms,
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
