class light
{

    #id = null
    #location = [ null, null, null ]
    #color = [ null, null, null ]

    constructor ( value )
    {

        return ( async() => {

            // Error check
            if ( typeof value != "object" ) { throw Error("[G10] [Light] Constructor parameter must conform to light schema. https://schema.g10.app/light.json")}

            // Set the name
            this.#id = (value.name)
            
            // Set the location
            this.#location = value.location

            // Set the color
            this.#color = value.color

            return this
        })();
    }

    static async from_uri( uri )
    {
        return await fetch(uri)
        .then( response => response.json() )
        .then( value => new light(value) );
    }

    get name ( )
    {
        return this.#id;
    }
}