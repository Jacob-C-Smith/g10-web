// renderer class
class renderer
{

    // Private class members
    #id = null
    #_clear_color = { r: 0, g: 0, b: 0, a: 0 };
    static #_active_shader = null;

    // Class constructor
    constructor ( value )
    {

        return ( async () => {

            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw Error("[G10] [Renderer] Renderer constructor must be parameterized with an object matching the renderer schema:\n https://schema.g10.app/renderer.json"); }
            // Renderer initialization
            {

                // Set the clear color
                this.#_clear_color = {
                    r: value["clear color"][0],
                    g: value["clear color"][1],
                    b: value["clear color"][2],
                    a: 1                  
                }
                
                // TODO: This is not correct, but it does work for this simple case
                for (const _idx in value["passes"]) {
                    const _render_pass = value["passes"][_idx];
                    renderer.#_active_shader = await shader.from_uri(_render_pass["shader"]);
                }
            }

            // Return
            return this;
        } )();
    }

    static async from_uri ( uri )
    {
        return await fetch(uri)
        .then(response => response.json())
        .then(value => new renderer(value));
    }

    get clear_color ()
    {
        return this.#_clear_color;
    }

    static get context_shader()
    {
        return renderer.#_active_shader;
    }

    static get context ( )
    {
        return instance.context.active_renderer;
    }
}

class render_pass
{

    #id = null

    constructor ( value )
    {
        return ( async () => {

            // Render pass initialization
        })();
    }
}