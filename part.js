// part class
class part
{

    // Private class members
    #id = null;
    #_vertex_buffer = null;
    #_element_buffer = null;
    #_element_count = null;

    // Class constructor
    constructor ( value )
    {
        return ( async () => {

            if ( typeof value != "object" ) { throw new Error("[G10] [Part] Part constructor must be parameterized with an object matching the part schema:\n https://schema.g10.app/part.json") }

            let part_json = null;
            
            this.#id = ( value["name"] )

            // TODO: Replace with something less awful, like a PLY loader 
            if (typeof value["polygon"] == "object" )
                part_json = value["polygon"]
            else
                part_json = await fetch(value["polygon"])
                .then(response => part_json = response.json());

            const vertices = await new Float32Array(part_json["vertex"]);
            const elements = await new Uint32Array(part_json["index"]);
            
            this.#_vertex_buffer = await instance.device.createBuffer({
                size:vertices.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            })

            this.#_element_buffer = await instance.device.createBuffer({
                size:elements.byteLength,
                usage:GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
            })

            await instance.device.queue.writeBuffer(this.#_vertex_buffer, 0, vertices, 0, vertices.length);
            await instance.device.queue.writeBuffer(this.#_element_buffer, 0, elements, 0, elements.length);

            this.#_element_count = elements.length;

            instance.cache_part(this);

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new part(value));
    }

    get name ( )
    {
        return this.#id
    }

    get vertex_buffer ( )
    {
        return this.#_vertex_buffer
    }

    get index_buffer ( )
    {
        return this.#_element_buffer;
    }

    get index_count ( )
    {
        return this.#_element_count;
    }

    static async find ( name )
    {
        return await instance.find_part(name);
    }
}