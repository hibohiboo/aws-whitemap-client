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
    controlslist="nodownload"
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
import { computed, defineComponent } from 'vue';
// import MidiPlayer from "midi-player-js";
// import Soundfont from "soundfont-player";
// const ac = new AudioContext();
// const instrument = await Soundfont.instrument(ac, "acoustic_grand_piano");
// const Player = new MidiPlayer.Player((event: any) => {
//   if (event.name == "Note on") {
//     instrument.play(event.noteName, ac.currentTime, {
//       gain: event.velocity / 100,
//     });
//   }
// });
// const playMidi = async (url: string) => {
//   const file = await fetch(url, { method: "GET", mode: "cors" });
//   if (!file) return;
//   const buffer = await file.arrayBuffer();

//   // Load a MIDI file
//   await Player.loadArrayBuffer(buffer);
//   Player.playLoop();
// };

// load時間が長い、、ので、
// package.jsonから削除
//     "midi-player-js": "^2.0.14",
//     "soundfont-player": "^0.12.0",

export default defineComponent({
  name: 'BGGridBox',
  props: {
    src: String,
    auto: Boolean,
  },
  setup: (props) => {
    const isMidi = computed(() => props.src && /\.mid$/.test(props.src));
    if (props.auto && isMidi && props.src) {
      // playMidi(props.src);
    }
    return {
      isMidi,
    };
  },
});
</script>
