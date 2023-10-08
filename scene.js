// Scene class
class scene
{

    // Private class members
    #id       = null
    #entities = null;
    #cameras  = null;
    #lights   = null;

    // Class constructor
    constructor ( value )
    {
        return ( async () => {

            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw new Error("[G10] [Scene] Scene constructor must be parameterized with an object matching the scene schema:\n https://schema.g10.app/scene.json") }
            
            // Store the name
            this.#id = ( value["name"] )
            
            // Construct a list for entities
            this.#entities = [ ]

            // Construct a list for cameras
            this.#cameras  = [ ]

            // Construct a list for lights
            this.#lights   = [ ]
    
            // Iterate over each entity 
            for (const _entity of value["entities"]) {
                if (typeof _entity == "object" )
                    this.#entities.push( await new entity ( _entity ) )
                else
                {
                    await entity.from_uri( _entity )
                    .then( async __entity =>
                        await this.#entities.push(__entity)
                    );
                }
            }
    
            // Iterate over each camera 
            if ( value["cameras"] )
            {
                await value["cameras"].forEach( async _camera => 
                    {
                        if (typeof _camera == "object" )
                            this.#cameras.push( await new camera ( _camera ) )
                        else
                            this.#cameras.push( await camera.from_uri( _camera ) )
                    }
                );
            }

            if ( value["lights"])
            {
                await value["lights"].forEach( async _light =>
                    {
                        if ( typeof _light == "object" )
                            this.#lights.push( await new light( _light ) );
                        else
                            this.#lights.push( await light.from_uri( _light ));
                    }
                );
            }

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        return fetch(uri)
        .then(response => response.json())
        .then(value => new scene(value));
    }

    get name ( )
    {
        return this.#id
    }

    static get context ( )
    {
        return instance.context.active_scene;
    }

    // TODO: FIX THIS FUNCTION
    find_entity ( name )
    {
        return this.#entities[0];
    }

    scene_info()
    {
        let out = "- Scene info -\n" +
        "Name: " + this.#id + "\n" +
        "Entities: \n";

        this.#entities.forEach(_entity => {
            out = out + "\t" + _entity.name + "\n";
        });

        out = out + "Cameras: \n";

        this.#cameras.forEach(_camera => {
            out = out + "\t" + _camera.name + "\n";
        });

        out = out + "Lights: \n";

        this.#lights.forEach(_light => {
            out = out + "\t" + _light.name + "\n";
        });

        console.log(out);
    }
}