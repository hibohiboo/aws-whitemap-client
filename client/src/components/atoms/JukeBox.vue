<template>
  <embed
    v-if="isMidi"
    type="audio/midi"
    width="150"
    height="40"
    :autostart="auto"
    loop="true"
    repeat="true"
  />
  <audio
    controls
    loop
    :autoplay="auto"
    style="width: 100%"
    :src="src"
    v-if="!isMidi"
  >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script lang="ts">
import { computed, defineComponent, toRef, toRefs } from "vue";
import MidiPlayer from "midi-player-js";

const playMidi = async (url: string) => {
  const file = await fetch(url, { method: "GET", mode: "cors" });
  if (!file) return;
  const buffer = await file.arrayBuffer();
  const Player = new MidiPlayer.Player((event: any) => console.log(event));

  // Load a MIDI file
  Player.loadArrayBuffer(buffer);
  Player.play();
};

export default defineComponent({
  name: "BGGridBox",
  props: {
    src: String,
    auto: Boolean,
  },
  setup: (props) => {
    const isMidi = computed(() => props.src?.includes(".mid"));
    if (props.auto && isMidi && props.src) {
      playMidi(props.src);
    }
    return {
      isMidi,
    };
  },
});
</script>
