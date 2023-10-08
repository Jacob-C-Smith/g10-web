// Entity class
class entity
{

    // Private class members
    #id = null;
    #_transform = null;
    #parts = null;
    #materials = null;

    // Class constructor
    constructor ( value )
    {
        return ( async () => {

            // Error check
            if ( typeof value != "object" ) { throw new Error("[G10] [Entity] Entity constructor must be parameterized with an object matching the entity schema:\n https://schema.g10.app/entity.json") }

            // Set the name
            this.#id = ( value["name"] )
            
            // Construct a list for parts
            this.#parts = [ ]
            this.#materials = [ ]

            // Construct a transform
            if ( typeof value["transform"] == "object" )
                this.#_transform = await new transform ( value["transform"] )
            else
                this.#_transform = await transform.from_uri ( value["transform"] )
            
            // Iterate over each part
            for (const _part of value["parts"]){
                if ( typeof _part == "object")
                {
                    await new part ( _part )
                    .then( async __part => await this.#parts.push(__part));
                }
                else
                {
                    await part.from_uri( _part )
                    .then( async __part => 
                        await this.#parts.push(__part)
                    );
                }
            }

            // Iterate over each material
            if ( value["materials"] )
            {
                value["materials"].forEach( async _material => {
                    if ( typeof _material == "object")
                        this.#materials.push( await new material( _material ) )
                    else
                        this.#materials.push( await material.from_uri( _material ) )
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
        .then(value => new entity(value));
    }

    get name ( )
    {
        return this.#id;
    }

    get transform ()
    {
        return this.#_transform;
    }
}