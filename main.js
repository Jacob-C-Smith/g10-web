// Main function
( async() => {

    // Construct a G10 instance
    const _instance = await instance.from_url('assets/instance.json');

    // The remainder of the WebGPU example
    {
        const _part1 = await part.find('tri');
        const _part2 = await part.find('quad');
        const _entity1 = scene.context.find_entity("tri");
        const _entity1_transform = _entity1.transform;
        const _forward_bind = await input.find_bind("FORWARD");
        const _renderer = await renderer.context;
        const _shader = await renderer.context_shader;
        console.log(_shader);
        
        const uniformBufferSize = 4 * 16; // 4x4 matrix
        const uniformBuffer1 = instance.device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
          });

        const uniformBuffer2 = instance.device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
          });

          instance.device.queue.writeBuffer(
            uniformBuffer1,
            0,
            new Float32Array(
                [0.5, 0, 0, 0,
                 0, 0.5, 0, 0,
                 0, 0, 0.5, 0, 
                 0.5, 0.5, 0, 1]),
            0,
            16
          );
        
        instance.device.queue.writeBuffer(
            uniformBuffer2,
            0,
            new Float32Array(
                [0.5, 0, 0, 0,
                 0, 0.5, 0, 0,
                 0, 0, 0.5, 0, 
                 -0.5, -0.5, 0, 1]),
            0,
            16
          );      
        
        const renderPipeline = renderer.context_shader.pipeline_descriptor;

        const uniformBindGroup1 = instance.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
              {
                binding: 0,
                resource: {
                  buffer: uniformBuffer1,
                },
              },
            ],
          });

        const uniformBindGroup2 = instance.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
              {
                binding: 0,
                resource: {
                  buffer: uniformBuffer2,
                },
              },
            ],
          });

        // Create GPUCommandEncoder to issue commands to the GPU
        // Note: render pass descriptor, command encoder, etc. are destroyed after use, fresh one needed for each frame.
        const commandEncoder = instance.device.createCommandEncoder();

        // TODO: Iterate over each render pass in the renderer
        {
            // Start the render pass
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments :
                [
                    {
                        clearValue : _instance.active_renderer.clear_color,
                        loadOp     : 'clear',
                        storeOp    : 'store',
                        view       : instance.webgpu_context.getCurrentTexture().createView()
                    }
                ]
            });
            passEncoder.setPipeline(renderPipeline);
            
            // TODO: Iterate over each draw item in each draw queue
            {

                // Draw the triangle
                passEncoder.setVertexBuffer(0, _part1.vertex_buffer);
                passEncoder.setIndexBuffer(_part1.index_buffer, "uint32");
                passEncoder.setBindGroup(0, _entity1_transform.uniform);
                passEncoder.drawIndexed(_part1.index_count);

                // Draw the quad
                passEncoder.setVertexBuffer(0, _part2.vertex_buffer);
                passEncoder.setIndexBuffer(_part2.index_buffer, "uint32");
                passEncoder.setBindGroup(0, uniformBindGroup2);
                passEncoder.drawIndexed(_part2.index_count);
            }

            // End the render pass
            passEncoder.end();
        }

        // End frame by passing array of command buffers to command queue for execution
        instance.device.queue.submit([commandEncoder.finish()]);
    }
})();
