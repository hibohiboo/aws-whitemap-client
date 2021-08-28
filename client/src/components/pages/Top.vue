<template>
  <router-link to="/scene">シーン</router-link>
  <img
    src="https://d1fffsi9eo19ed.cloudfront.net/data/background-images/W8NO28NuAQgRsiZAYYMNmQ29O2z2/QGsdcK6dYrfmIPf3R3CL.png"
    width="800"
    height="600"
  />
  <audio
    controls
    autoplay
    loop
    src="https://d1fffsi9eo19ed.cloudfront.net/data/bgms/W8NO28NuAQgRsiZAYYMNmQ29O2z2/oUu5AeRO56LgC0qGvuFO.mp3"
  >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";

export default defineComponent({
  components: {},
  name: "Main",
  setup: () => {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
