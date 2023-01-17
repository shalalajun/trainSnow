
varying vec2 vUv;


  
  void main() {

  	vec3 baseColor = vec3(1.0,1.0,1.0 );
    vec3 groundCol = vec3(0.398,0.665,0.885);
    vec3 mixCol = mix(groundCol, baseColor, vUv.x);
    gl_FragColor = vec4( mixCol, 1 );
  }
