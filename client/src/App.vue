<template>
  <Main />
  <img
    src="https://d29r5tmujsb0y1.cloudfront.net/data/background-images/W8NO28NuAQgRsiZAYYMNmQ29O2z2/QGsdcK6dYrfmIPf3R3CL.png"
  />
  <audio
    controls
    src="https://d29r5tmujsb0y1.cloudfront.net/data/bgms/W8NO28NuAQgRsiZAYYMNmQ29O2z2/oUu5AeRO56LgC0qGvuFO.mp3"
  >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "@/components/pages/Main.vue";

export default defineComponent({
  name: "App",
  components: {
    Main,
  },
});
</script>

<style></style>
