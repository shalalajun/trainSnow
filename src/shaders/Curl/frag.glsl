uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 uLight;
varying vec3 vWorldPostion;
varying vec3 vNormal;

void main()
{
    float dash = sin(vUv.x * 25.0 + time*3.0);
    if(dash < 0.99) discard;

    float dist = length(uLight - vPosition);
    vec3 lightDir = normalize(uLight - vWorldPostion);
    float diffuse = max(0.0,dot(vNormal, lightDir));
    gl_FragColor = vec4(1.0,1.0,1.0,0.5);
}