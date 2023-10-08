struct Uniforms { 
  mvp: mat4x4<f32>
}

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f,
}

@vertex
fn vertex_main(@location(0) position: vec3f,
               @location(1) uv: vec2f,
               @location(2) normal: vec3f) -> VertexOut
{
  var output : VertexOut;
  output.position = uniforms.mvp * vec4(position.xyz, 1.0);
  output.color = vec4(normal.xyz, 1.0);
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}