<template>
  <svg
    class="hand-drawn-box"
    width="100px"
    height="35px"
    viewBox="0 0 100 35"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    xmlns:serif="http://www.serif.com/"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
  >
    <rect
      id="Artboard1"
      x="0"
      y="0"
      width="100"
      height="35"
      style="fill:none;"
    />
    <path
      d="M69.35,1.236C69.35,1.236 2.657,3.633 1.628,19.034C1.017,28.161 36.807,34.494 55.14,33.833C74.477,33.135 102.313,29.762 98.422,19.234C92.175,2.335 24.861,3.181 24.861,3.181"
      style="fill:none;stroke:black;stroke-width:1px;"
    />
  </svg>
</template>

<script>
export default {
  name: "HandDrawnBox"
};
</script>

<style lang="css">
svg.hand-drawn-box {
  position: absolute;
  width: 100px;
  height: 35px;
  left: -7px;
  top: 10px;
  /* transform: scale(0.7); */
}
</style>
