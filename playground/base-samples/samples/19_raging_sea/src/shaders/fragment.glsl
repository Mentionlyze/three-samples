precision mediump float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultipler;

varying vec2 v_Uv;
varying float v_Elevation;

void main() {
  float elevation = (v_Elevation + uColorOffset) * uColorMultipler;

  vec3 color = mix(uDepthColor, uSurfaceColor, elevation);
  gl_FragColor = vec4(color, 0.5);
}
