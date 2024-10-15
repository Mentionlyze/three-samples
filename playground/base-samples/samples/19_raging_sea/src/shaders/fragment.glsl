precision mediump float;

varying vec2 v_Uv;

void main() {
  gl_FragColor = vec4(v_Uv, 1.0, 1.0);
}