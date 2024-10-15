uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 v_Uv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(modelPosition.x) * 0.2;
  modelPosition.y += cos(modelPosition.z) * 0.2;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  v_Uv = uv;
}