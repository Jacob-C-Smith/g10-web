class input
{

    #_id = null;
    #_mouse_sense = null
    #_binds = null

    constructor ( value )
    {
        return ( async() => {

            // Error check
            if ( typeof value != "object" ) { throw Error("[G10] [Input] Constructor parameter must conform to input schema. https://schema.g10.app/input.json")}

            // Set the name
            this.#_id = (value.name)

            // Set the mouse sensitivity
            this.#_mouse_sense = (value["mouse sensitivity"])
            
            // Construct a list
            this.#_binds = { }

            // Iterate over each bind
            await value["binds"].forEach(async _bind => {
                await (this.#_binds[`${_bind.name}`] = await new bind(_bind));
            });

            document.addEventListener(
                "keydown",
                (event) =>
            {
                const key_name = event.key;

                for (const _bind in this.#_binds)
                {
                    this.#_binds[_bind].keys.forEach( _key =>
                    {
                        if ( _key === key_name )
                        {
                            this.#_binds[_bind].fire()
                        }
                    });
                };
            });

            return this;
        })();
    }

    static async from_uri( uri )
    {
        return await fetch(uri)
        .then( response => response.json() )
        .then( value => new input(value) );
    }

    get name ( )
    {
        return this.#_id;
    }

    static async find_bind ( name )
    {
        return instance.context.active_input.#_binds[name];
    }
}

class bind
{

    #_id = null;
    #_keys = null
    #_callbacks = null;

    constructor ( value )
    {
        return ( async() => {

            // Error check
            if ( typeof value != "object" ) { throw Error("[G10] [Input] Constructor parameter must conform to input schema. https://schema.g10.app/input.json")}

            // Set the name
            this.#_id = (value.name)

            // Construct a list
            this.#_keys = [ ]

            this.#_callbacks = []

            // Iterate over each bind
            await value["keys"].forEach(async _key => {
                await (this.#_keys.push(_key));
            });

            return this;
        })();
    }

    static async from_uri( uri )
    {
        return await fetch(uri)
        .then( response => response.json() )
        .then( value => new input(value) );
    }

    get name ( )
    {
        return this.#_id;
    }

    get keys ( )
    {
        return this.#_keys;
    }

    fire ( )
    {
        for (const _cb in this.#_callbacks) {
            this.#_callbacks[_cb]();
        }
    }

    async add_callback( fun )
    {
        await this.#_callbacks.push(fun)
    }
}