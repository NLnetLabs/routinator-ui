<template>
  <svg
    class="em-arrow"
    width="100px"
    height="50px"
    viewBox="0 0 100 50"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    xmlns:serif="http://www.serif.com/"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
  >
    <g transform="matrix(1,0,0,1,-125.492,0)">
      <g
        id="exact-match"
        transform="matrix(0.83657,0,0,0.680116,99.3041,-7.95757)"
      >
        <rect
          x="31.303"
          y="11.7"
          width="119.536"
          height="73.517"
          style="fill:none;"
        />
        <g transform="matrix(0.806349,0,0,0.991842,9.92155,-30.671)">
          <g transform="matrix(-1.10166,0,0,0.828788,446.056,-195.614)">
            <path
              d="M345.511,330.883C345.511,330.883 356.79,332.114 364.389,341.14C372.135,350.34 372.637,373.179 372.637,373.179L378.635,361.827"
              style="fill:none;stroke:black;stroke-width:1.52px;"
            />
          </g>
          <g transform="matrix(-1,0,0,1,412.173,-250)">
            <path
              d="M376.636,363.672L367.55,355.057"
              style="fill:none;stroke:black;stroke-width:1.48px;"
            />
          </g>
        </g>
        <g transform="matrix(1.60154,0,0,1.96995,-537.931,-611.373)">
          <text
            x="379.043px"
            y="332.122px"
            style="font-family:'BradleyHandITCTT-Bold', 'Bradley Hand';font-weight:700;font-size:12px;"
          >
            exact
          </text>
          <text
            x="379.043px"
            y="344.122px"
            style="font-family:'BradleyHandITCTT-Bold', 'Bradley Hand';font-weight:700;font-size:12px;"
          >
            Match
          </text>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "EmArrow"
};
</script>

<style lang="css" scoped>
svg.em-arrow {
  position: absolute;
  z-index: 10;
  height: 50px;
  width: 100px;
  margin-left: 77px;
  margin-top: -57px;
}
</style>
