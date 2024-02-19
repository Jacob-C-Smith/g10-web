// Camera class
class camera
{

    // Private class members
    #_name      = null;
    #fov        = null;
    #near       = null;
    #far        = null;
    #front      = null;
    #up         = null;
    #location   = null;
    #view       = null;
    #projection = null;

    // Class constructor
    constructor ( value )
    {
        return ( async () => {
            if ( typeof value != "object" ) { throw new Error("[G10] [Camera] Camera constructor must be parameterized with an object matching the camera schema:\n https://schema.g10.app/camera.json") }

            this.#_name    = ( value["name"] )
            this.#fov      = ( value["fov"] )
            this.#near     = ( value["near"] )
            this.#far      = ( value["far"] )
            this.#front    = ( value["front"] )
            this.#up       = ( value["up"] )
            this.#location = ( value["location"] )

            // Return
            return this;
        } )();
    }

    projection_matrix ( )
    {
        return [
            (1 / (1.77777 * Math.tan(this.#fov / 2))),
            0,
            0, 
            0,
            0,
            1 / Math.tan(this.#fov / 2),
            0,
            0,
            0,
            0,
            (-(this.#far  + this.#near) / (this.#far  - this.#near)),
            -1,
            0,
            0,
            (2 * this.#far  * this.#near / (this.#near - this.#far )),
            0
        ]
    }

    static async from_uri ( uri )
    {
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new camera(value));
    }

    get name ()
    {
        return this.#_name;
    }
}