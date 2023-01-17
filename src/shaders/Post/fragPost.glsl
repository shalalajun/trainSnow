uniform sampler2D tDiffuse;
uniform sampler2D overRayTexture;
varying vec2 vUv;

vec3 overlay(vec3 base, vec3 blend) {
    return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(base, vec3(0.5)));
}

void main()
{
    vec4 brushColor = texture2D(overRayTexture, vUv); 
    vec4 color = texture2D(tDiffuse, vUv);

    vec3 overRayCol = overlay(color.rgb, brushColor.rgb); 
    vec3 finCol = mix(overRayCol, vec3(0.0,1.0,1.0), brushColor.a);
    //vec3 color = vec3(1.0,0.0,1.0);
    gl_FragColor = vec4(overRayCol * 0.5 + 0.5,1.0);
}
