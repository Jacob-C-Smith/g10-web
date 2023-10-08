// shader class
class shader
{

    // Private class members
    #id = null
    #modules = {
        "vertex" : null,
        "fragment" : null
    }
    #layout = null
    #pipeline_descriptor_ = null

    // Class constructor
    constructor ( value )
    {

        return ( async () => {

            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw Error("[G10] [Shader] Shader constructor must be parameterized with an object matching the shader schema:\n https://schema.g10.app/shader.json"); }

            // Shader initialization
            {

                // Load the vertex shader source code
                let _vertex_shader = await fetch(value.webgpu.vertex.path)
                .then( _response => _response.text() )
                
                // Load the fragment shader source code
                let _fragment_shader = await fetch(value.webgpu.fragment.path)
                .then( _response => _response.text() )

                // Construct the vertex shader module
                this.#modules.vertex = instance.device.createShaderModule({
                    code: _vertex_shader
                });

                // Construct the fragment shader module
                this.#modules.fragment = instance.device.createShaderModule({
                    code: _fragment_shader
                });

                this.#layout = [
                    {
                        attributes:
                        [
                            {
                                shaderLocation : 0, // position
                                offset         : 0,
                                format         : 'float32x3'
                            },
                            {
                                shaderLocation : 1,
                                offset : 12,
                                format : 'float32x2'
                            },
                            {
                                shaderLocation : 2, // color
                                offset         : 20,
                                format         : 'float32x3'
                            }
                        ],
                        arrayStride : 32,       // 28 bytes => (3 x 4 bytes + 4 x 4 bytes) per vertex
                        stepMode    : 'vertex'
                    }
                ];

                this.#pipeline_descriptor_ = instance.device.createRenderPipeline({
                    vertex :
                    {
                        module     : this.#modules.vertex,
                        entryPoint : value.webgpu.vertex.entry,
                        buffers    : this.#layout,
                    },
                    fragment :
                    {
                        module     : this.#modules.fragment,
                        entryPoint : value.webgpu.fragment.entry,
                        targets    :
                        [
                            {
                                format: navigator.gpu.getPreferredCanvasFormat()
                            }
                        ]
                    },
                    primitive:
                    {
                        topology : 'triangle-list'
                    },
                    layout : 'auto'
                });
            }

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new shader(value));
    }

    get vertex_shader ( )
    {
        return this.#modules.vertex;
    }
    
    get fragment_shader ( )
    {
        return this.#modules.fragment;
    }

    get pipeline_descriptor ( )
    {
        return this.#pipeline_descriptor_;
    }
}