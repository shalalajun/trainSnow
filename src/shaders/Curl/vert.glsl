varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPostion;
varying vec3 vNormal;

void main()
{
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    vWorldPostion = (modelMatrix * vec4(position,1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}