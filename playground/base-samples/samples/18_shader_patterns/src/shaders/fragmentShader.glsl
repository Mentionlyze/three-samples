precision mediump float;

uniform vec3 u_Color;

varying vec2 v_Uv;

void main() {
  float strength = mod(v_Uv.y * 10.0, 1.0);
  gl_FragColor = vec4(vec3(strength), 1.0);
}