<template>
  <div class="grid-wrapper"><slot /></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BGGridBox",
});
</script>

<style lang="scss" scoped>
$lineColor: lime;
$lineGap: 50px;
$lineWidth: 1px;

// https://zenn.dev/bissy/articles/2e721ad5291c33c83541
// 透明を $lineGap -1px まで続けて $lineGap めに $lineColor の色になる垂直のグラデーション
.grid-wrapper {
  background-image: linear-gradient(
      0deg,
      transparent ($lineGap - $lineWidth),
      $lineColor $lineGap
    ),
    linear-gradient(
      90deg,
      transparent ($lineGap - $lineWidth),
      $lineColor $lineGap
    );
  background-size: $lineGap $lineGap;
}
</style>
