// Transform class

/**
 * @typedef {Object} transform
 * 
 * @property {Array} location - the 
 * 
 */
class transform
{

    // Private class members
    #_location = [ null, null, null ];
    #_rotation = [ null, null, null, null ];
    #_scale    = [ null, null, null ];
    #_uniform_buffer = null;
    #_uniform_bind_group = null;

    /**
     * 
     * @param {Object} value - Describes an instance
     * @param {string} value.name - The name of the G10 instance
     * @param {string|json} value.renderer - A renderer object, or a URI to a renderer object
     * @param {string|json} value.input - An input object, or a URI to an input object
    */
    constructor ( value )
    {
        if ( typeof value != "object" )
        { throw new Error("[G10] [Transform] Transform constructor must be parameterized with an object matching the transform schema:\n https://schema.g10.app/transform.json") }

        this.#_location = (value["location"])
        this.#_rotation = (value["rotation"])
        this.#_scale = (value["scale"])

        this.#_uniform_buffer = instance.device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        
        instance.device.queue.writeBuffer(
            this.#_uniform_buffer,
            0,
            new Float32Array(this.model_matrix),
            0,
            16
        );
        
        this.#_uniform_bind_group = instance.device.createBindGroup({
            layout: renderer.context_shader.pipeline_descriptor.getBindGroupLayout(0),
            entries: [
              {
                binding: 0,
                resource: {
                  buffer: this.#_uniform_buffer,
                },
              },
            ],
        });
        
    }

    static async from_uri ( uri )
    {
        const value = await fetch('transform.json')
        .then(response => response.json())

        return new transform(value);
    }

    static from_location ( location )
    {
        return new transform( location, [1, 0, 0, 0], [1, 1, 1] );
    }

    static from_rotation ( rotation )
    {
        return new transform( [0, 0, 0], rotation, [1, 1, 1] );
    }

    static from_scale ( scale )
    {
        return new transform( [0, 0, 0], [1, 0, 0, 0], scale );
    }

    get model_matrix() {
        return (linear.model_matrix(this.#_location, this.#_rotation, this.#_scale));
    }

    set location ( location )
    {
        this.#_location = location;
    }

    get location ( )
    {
        return this.#_location;
    }

    get uniform ( )
    {
        return this.#_uniform_bind_group;
    }
}