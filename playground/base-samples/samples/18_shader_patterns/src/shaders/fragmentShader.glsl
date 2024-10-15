#define PI 3.1415926535897932384626433832795
precision mediump float;

uniform vec3 u_Color;

varying vec2 v_Uv;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) - sin(rotation) * (uv.y - mid.y) + mid.x,
    sin(rotation) * (uv.x - mid.x) + cos(rotation) * (uv.y - mid.y) + mid.y
  );
}

void main() {
  // Pattern 1
  // gl_FragColor = vec4(v_Uv, 1.0, 1.0);

  // Pattern 2
  // gl_FragColor = vec4(v_Uv, 0.5, 1.0);

  // Pattern 3
  // float strength = v_Uv.x;

  // Pattern 4
  // float strength = v_Uv.y;

  // Pattern 5
  // float strength = 1.0 - v_Uv.y;

  // Pattern 6
  // float strength = v_Uv.y * 10.0;

  // Pattern 7
  // float strength = mod(v_Uv.y * 10.0, 1.0);

  // Pattern 8
  // float strength = mod(v_Uv.y * 10.0, 1.0);
  // strength = step(0.8, strength);

  // Pattern 9
  // float strength_X = step(0.8, mod(v_Uv.x * 10.0, 1.0));
  // float strength_Y = step(0.8, mod(v_Uv.y * 10.0, 1.0));
  // float strength = strength_X + strength_Y;

  // Pattern 10
  // float strength_X = step(0.8, mod(v_Uv.x * 10.0, 1.0));
  // float strength_Y = step(0.8, mod(v_Uv.y * 10.0, 1.0));
  // float strength = strength_X * strength_Y;

  // Pattern 10
  // float strength_X = step(0.4, mod(v_Uv.x * 10.0, 1.0));
  // strength_X *= step(0.8, mod(v_Uv.y * 10.0 + 0.2, 1.0));
  // float strength_Y = step(0.4, mod(v_Uv.y * 10.0, 1.0));
  // strength_Y *= step(0.8, mod(v_Uv.x * 10.0 + 0.2, 1.0));
  // float strength = strength_X + strength_Y;

  // Pattern 11
  // float strength = abs(v_Uv.x - 0.5);

  // Pattern 12
  // float strength = min(abs(v_Uv.x - 0.5), abs(v_Uv.y - 0.5));

  // Pattern 13
  // float strength = max(abs(v_Uv.x - 0.5), abs(v_Uv.y - 0.5));

  // Pattern 14
  // float strength = max(abs(v_Uv.x - 0.5), abs(v_Uv.y - 0.5));
  // strength = step(0.2, strength);

  // Pattern 15
  // float square_X = step(0.2, max(abs(v_Uv.x - 0.5), abs(v_Uv.y - 0.5)));
  // float square_Y = 1.0 - step(0.25, max(abs(v_Uv.x - 0.5), abs(v_Uv.y - 0.5)));
  // float strength = square_X * square_Y;

  // Pattern 16
  // float strength = floor(v_Uv.x * 10.0) / 10.0;

  // Pattern 17
  // float strength = floor(v_Uv.x * 10.0) / 10.0;
  // strength *= floor(v_Uv.y * 10.0) / 10.0;

  // Pattern 18
  // float strength = distance(v_Uv, vec2(0.5));

  // Pattern 19
  // float strength = 1.0 - distance(v_Uv, vec2(0.5));

  // Pattern 20
  // float strength = 0.015 / distance(v_Uv, vec2(0.5));

  // Pattern 21
  float strength = 0.015 / distance(v_Uv, vec2(0.5));

  gl_FragColor = vec4(vec3(strength), 1.0);
}
