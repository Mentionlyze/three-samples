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

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
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
  // float strength = random(v_Uv);

  // Pattern 19
  // vec2 gridUv = vec2(
  //   floor(v_Uv.x * 10.0) / 10.0,
  //   floor(v_Uv.y * 10.0) / 10.0
  // );
  // float strength = random(gridUv);

  // Pattern 20
  // float strength = length(v_Uv);

  // Pattern 21
  // float strength = distance(v_Uv, vec2(0.5));

  // Pattern 22
  // float strength = 1.0 - distance(v_Uv, vec2(0.5));

  // Pattern 23
  // float strength = 0.015 / distance(v_Uv, vec2(0.5));

  // Pattern 24
  // vec2 lightUv = vec2(
  //   v_Uv.x * 0.1 + 0.45, 
  //   v_Uv.y  * 0.5 + 0.25
  // );
  // float strength = 0.015 / distance(lightUv, vec2(0.5));

  // Pattern 25
  // vec2 lightUv_X = vec2(
  //   v_Uv.x * 0.1 + 0.45, 
  //   v_Uv.y  * 0.5 + 0.25
  // );
  // float strength_X = 0.015 / distance(lightUv_X, vec2(0.5));
  // vec2 lightUv_Y = vec2(
  //   v_Uv.x * 0.5 + 0.25,
  //   v_Uv.y * 0.1 + 0.45
  // );
  // float strength_Y = 0.015 / distance(lightUv_Y, vec2(0.5));
  // float strength = strength_X * strength_Y;

  // Pattern 26
  // vec2 rotateUv = rotate(v_Uv, PI * 0.25, vec2(0.5));
  // vec2 lightUv_X = vec2(
  //   rotateUv.x * 0.1 + 0.45,
  //   rotateUv.y * 0.5 + 0.25
  // );
  // float strength_X = 0.015 / distance(lightUv_X, vec2(0.5));
  // vec2 lightUv_Y = vec2(
  //   rotateUv.x * 0.5 + 0.25,
  //   rotateUv.y * 0.1 + 0.45
  // );
  // float strength_Y = 0.015 / distance(lightUv_Y, vec2(0.5));
  // float strength = strength_X * strength_Y;

  // Pattern 27
  // float strength = abs(distance(v_Uv, vec2(0.5)) - 0.25);

  // Pattern 28
  // float strength = 1.0 - step(0.01, abs(distance(v_Uv, vec2(0.5)) - 0.25));

  // Pattern 29
  // vec2 wavedUv = vec2(
  //   v_Uv.x,
  //   v_Uv.y + sin(v_Uv.x * 30.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // Pattern 30
  // vec2 wavedUv = vec2(
  //   v_Uv.x + sin(v_Uv.y * 30.0) / 10.0,
  //   v_Uv.y + sin(v_Uv.x * 30.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // Pattern 31
  // vec2 wavedUv = vec2(
  //   v_Uv.x + sin(v_Uv.y * 100.0) / 10.0,
  //   v_Uv.y + sin(v_Uv.x * 100.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // Pattern 32
  // float strength = atan(v_Uv.x - 0.5, v_Uv.y - 0.5);

  // Pattern 33
  // float angle = atan(v_Uv.x - 0.5, v_Uv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // angle *= 10.0;
  // angle = mod(angle, 1.0);
  // float strength = angle;

  // Pattern 34
  // float angle = atan(v_Uv.x - 0.5, v_Uv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = sin(angle * 80.0);

  // Pattern 35
  // float angle = atan(v_Uv.x - 0.5, v_Uv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float sinusoid = sin(angle * 100.0);
  // float radius = 0.25 + sinusoid * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(v_Uv, vec2(0.5)) - radius));

  // Pattern 36
  // float strength = cnoise(v_Uv * 10.0);

  // Pattern 37
  // float strength = step(0.0, cnoise(v_Uv * 10.0));

  // Pattern 38
  // float strength = 1.0 - abs(cnoise(v_Uv * 10.0));

  // Pattern 38
  float strength = step(0.9, sin(cnoise(v_Uv * 10.0) * 20.0));

  strength = clamp(strength, 0.0, 1.0);

  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(v_Uv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(mixedColor, 1.0);
}
