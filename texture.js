// texture class
class texture
{

    // Private class members
    #_name    = null
    #_texture = null
    #_sampler = null

    // Class constructor
    constructor ( value )
    {
        return ( async () => {

            // Initialized data
            let _path = null;
            let _texture_filter_mode  = "linear";
            let _texture_address_mode = "repeat";
            
            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw new Error("[G10] [Texture] Texture constructor must be parameterized with an object matching the texture schema:\n https://schema.g10.app/texture.json") }
            
            // Parse the texture JSON object 
            {

                // Store the name
                this.#_name = ( value["name"] )
            
                // Get the path to the texture
                _path = value["path"];

                // If the user provided a texture filtering mode...
                if ( value["filter"] )

                    // ... use their filtering mode
                    _texture_filter_mode = value["filter"];
                
                // If the user provided a texture addressing mode...
                if ( value["addressing"] )

                    // ... use their addressing mode
                    _texture_address_mode = value["addressing"];
            }

            // Construct the texture
            {

                // Construct a new image
                const _image = new Image();
                const _image_promise = new Promise(resolve => {
                    _image.onload = () => resolve();
                    _image.src = _path
                });
                
                await Promise.resolve(_image_promise);

                let _image_size = {
                    width: _image.width,
                    height: _image.height
                };
                
                let _image_descriptor = {
                    size: _image_size,
                    arrayLayerCount: 1,
                    mipLevelCount: 1,
                    sampleCount: 1,
                    dimension: "2d",
                    format:  navigator.gpu.getPreferredCanvasFormat(),
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
                };
                
                let _texture = instance.device.createTexture(_image_descriptor);

                instance.device.queue.copyExternalImageToTexture(
                    { source: await createImageBitmap(_image) },
                    { texture: _texture },
                    [ _image.width, _image.height ]
                )

                this.#_texture = _texture;
            }

            // Construct a sampler
            {
                const sampler = instance.device.createSampler({
                    addressModeU: _texture_address_mode,
                    addressModeV: _texture_address_mode,
                    magFilter: _texture_filter_mode,
                    minFilter: _texture_filter_mode,
                    mipmapFilter: _texture_filter_mode,
                });

                this.#_sampler = sampler;
            }

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new texture(value));
    }

    get name ( )
    {
        return this.#_name;
    }

    get image ( )
    {
        return this.#_texture;
    }

    get image_sampler ( )
    {
        return this.#_sampler;
    }
}