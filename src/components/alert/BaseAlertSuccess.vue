<script setup>
const props = defineProps({
  text: String,
  title: String,
});
</script>

<template>
  <v-alert
    class="alert"
    icon="$success"
    :text="props.text"
    :title="props.title"
    :type="props.type"
  ></v-alert>
</template>

<style>
.alert {
  transform: translateY(10px);
  animation: moveleft 0.15s linear forwards;
  background-color: rgb(34, 226, 34) !important;
  position: fixed;
  display: flex;
  color: #fff !important;
  align-items: center;
  justify-content: center;
  bottom: 15px;
  z-index: 99;
  right: 15px;
}

.alert::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 5px;
  background-color: rgb(157, 255, 162);
  animation: anim 3s linear forwards;
}

@keyframes anim {
  100% {
    width: 0;
  }
}

@keyframes moveleft {
  100% {
    transform: translateY(0);
  }
}
</style>