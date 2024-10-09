uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix; 
uniform vec2 u_Fraquency;
uniform float u_Time;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying vec4 v_Position;
varying float v_Random;
varying vec2 v_Uv;
varying float v_Elevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // modelPosition.z += aRandom * 0.1;

  float elevation = sin(modelPosition.x * u_Fraquency.x - u_Time) * 0.1;
  elevation += sin(modelPosition.y * u_Fraquency.y - u_Time) * 0.1;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  v_Position = projectionPosition;
  v_Random = aRandom;
  v_Uv = uv;
  v_Elevation = elevation;
}