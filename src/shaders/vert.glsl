varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying mat4 vModelMatrix;

#include <common>
#include <shadowmap_pars_vertex>


// #define USE_SKINNING
#include <skinning_pars_vertex>

void main() {

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>

    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
 
    #include <worldpos_vertex>
    #include <shadowmap_vertex>

     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
     vec4 viewPosition = viewMatrix * modelPosition;
     vec4 clipPosition = projectionMatrix * viewPosition;

//   gl_Position = clipPosition;

    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-viewPosition.xyz);

    vUv=uv;  
    
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position,1.0);

    
    #include <project_vertex> 
}