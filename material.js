// material class
class material
{

    // Private class members
    #id     = null
    #_textures = null

    // Class constructor
    constructor ( value )
    {
        return ( async () => {

            // Initialized data
            
            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw new Error("[G10] [Texture] Texture constructor must be parameterized with an object matching the texture schema:\n https://schema.g10.app/texture.json") }
            
            // Parse the material JSON object 
            {

                // Store the name
                this.#id = ( value["name"] )

                this.#_textures = new Object();

                // Load each texture
                value["textures"].forEach( async _texture => 
                    {
                        if (typeof _texture == "object" )
                        {
                            const _texture_res = await new texture ( _texture );
                            this.#_textures[_texture_res.name] = _texture_res;
                        }
                        else
                        {
                            const _texture_res = await texture.from_uri( _texture )
                            this.#_textures[_texture_res.name] = _texture_res;
                        }
                    }
                );
            
            }

            instance.cache_material(this);

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new material(value));         
    }

    get name ( )
    {
        return this.#id;
    }
}