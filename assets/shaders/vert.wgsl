
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f,
}

@vertex
fn vertex_main(@location(0) position: vec3f,
               @location(1) uv: vec2f
               @location(2) normal: vec3f) -> VertexOut
{
  var output : VertexOut;
  output.position = vec4(uv.xy, 1.0, 1.0);
  output.color = color;
  return output;
}