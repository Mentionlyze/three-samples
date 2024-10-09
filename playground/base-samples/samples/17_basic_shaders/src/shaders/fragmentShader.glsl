precision mediump float;

uniform vec3 u_Color;
uniform sampler2D u_Texture;

varying vec4 v_Position;
varying float v_Random;
varying vec2 v_Uv;
varying float v_Elevation;

void main() {
    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
    // gl_FragColor = v_Position;
    // gl_FragColor = vec4(1.0, v_Random, 1.0, 1.0);
    // gl_FragColor = vec4(u_Color, 1.0);
    vec4 textureColor = texture2D(u_Texture, v_Uv);
    textureColor.rgb *= (v_Elevation + 0.2);
    // gl_FragColor =  textureColor;
    gl_FragColor = vec4(v_Uv, 1.0, 1.0);
}