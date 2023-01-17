#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>

uniform vec3 uColor;
uniform float uGlossiness;
uniform sampler2D uTexture;
uniform float medThresHold;
uniform float medSmooth;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

float LinearStep(float minValue, float maxValue, float In)
{
    return saturate((In-minValue) / (maxValue - minValue));
}

void main() {

    //shadow map
  DirectionalLightShadow directionalShadow = directionalLightShadows[0];
  
  float shadow = getShadow(
    directionalShadowMap[0],
    directionalShadow.shadowMapSize,
    directionalShadow.shadowBias,
    directionalShadow.shadowRadius,
    vDirectionalShadowCoord[0]
  );
    
   // directional light
  float NdotL = dot(vNormal, directionalLights[0].direction);
  float smoothedTone = LinearStep(medThresHold - medSmooth,medThresHold + medSmooth, NdotL);
  float lightIntensity = smoothedTone * shadow;
 // float lightIntensity = smoothstep(0.0, 0.01, NdotL * shadow);
  vec3 directionalLight = directionalLights[0].color * lightIntensity;
  
  // specular reflection
  vec3 halfVector = normalize(directionalLights[0].direction + vViewDir);
  float NdotH = dot(vNormal, halfVector);

  float specularIntensity = pow(NdotH * lightIntensity, 1000.0 / uGlossiness);
  float specularIntensitySmooth = smoothstep(0.02, 0.2, specularIntensity);
  //float specularIntensitySmooth = LinearStep(medThresHold - medSmooth,medThresHold + medSmooth, specularIntensity);
  vec3 specular = specularIntensitySmooth * directionalLights[0].color;

   // rim lighting
  float rimDot = 1.0 - dot(vViewDir, vNormal);
  float rimAmount = 0.8;
  float rimThreshold = 0.2;
  float rimIntensity = rimDot * pow(NdotL, rimThreshold);
  rimIntensity = smoothstep(rimAmount - 0.02, rimAmount + 0.01, rimIntensity);

  vec3 rim = rimIntensity * directionalLights[0].color;

  vec4 tex = texture2D(uTexture, vUv);

  gl_FragColor = vec4(tex.xyz * (ambientLightColor + directionalLight + specular + rim), 1.0);
  //gl_FragColor = vec4(tex.xyz, 1.0);

  
  }