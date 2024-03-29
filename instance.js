/**
 * Defines a G10 instance
 * 
 * @file instance.js 
 * @author Jacob Smith
 */

class instance
{

    // Private class members
    #_name = null
    static #webgpu = {
        "adapter" : {
            "adapter" : null,
            "info" : null
        },
        "device" : null,
        "_canvas" : null,
        "context" : null
    }
    #cache = {
        "shaders"   : { },
        "parts"     : { },
        "materials" : { },
        "ais"       : { }
    }
    #instance_context = { 
        "scene" : null,
        "renderer" : null,
        "input" : null
    }
    static #active_instance;

    /**
     * Construct a G10 instance singleton from a JSON object
     * 
     * @param {Object} value - Describes an instance
     * @param {String} value.name - The name of the G10 instance
     * @param {(URL|JSON)} value.renderer - A renderer object, or a URI to a renderer object
     * @param {(URL|JSON)} value.input - An input object, or a URI to an input object
     * @param {(URL[]|JSON[])} value.schedules - Schedules
     * @param {Object} value.window - Describes the window
     * @param {Number} value.window.width - The width of the window in pixels
     * @param {Number} value.window.height - The height of the window in pixels
     * @param {String} value.window.title - The title of the window
     * @returns {Promise<instance>} A promise that returns the instance.
    */
    constructor ( value )
    {

        // Throw an error if the constructor has been called before
        if ( typeof instance.#active_instance != "undefined" ) { throw Error("[G10] Instance has already been constructed.") }

        return ( async () => {

            // Throw an error if the constructor parameter is incorrect
            if ( typeof value != "object" ) { throw Error("[G10] Instance constructor must be parameterized with an object matching the instance schema:\n https://schema.g10.app/instance.json"); }

            // Instance initialization
            {

                // WebGPU Initialization
                {

                    // Initialized data
                    let _adapter      = null;
                    let _adapter_info = null;
                    let _device       = null;

                    // Set up the adapter
                    {

                        // Get an adapter
                        await navigator.gpu.requestAdapter()
                        .then(__adapter => {
                            
                            // Error checking
                            if ( !__adapter ) { throw Error("[WebGPU] Failed to request WebGPU adapter!"); }

                            _adapter = __adapter;

                            // Store the WebGPU adapter
                            instance.#webgpu.adapter.adapter = _adapter;
                        });

                        // Get information about the adapter
                        await _adapter.requestAdapterInfo()
                        .then(__adapter_info => {
                            
                            // Error checking
                            if ( !__adapter_info ) { throw Error("[WebGPU] Failed to request WebGPU adapter info!"); }

                            // Store the WebGPU adapter info
                            instance.#webgpu.adapter.info = __adapter_info;
                        });
                    }

                    // Set up the device
                    {

                        // Get the device
                        await _adapter.requestDevice()
                        .then(__device => {

                            // Error checking
                            if ( !__device ) { throw Error("[WebGPU] Failed to get a WebGPU device!"); }
                            
                            // Store the WebGPU device info
                            instance.#webgpu.device = __device;
                        });
                    }
                }

                // Set the name of the instance
                this.#_name = value["name"];

                // Store the initial scene
                instance.#active_instance = this;
                
                // Store the framebuffer
                await (instance.#webgpu._canvas = document.querySelector('#g10_framebuffer'));

                instance.#webgpu.context = instance.canvas.getContext('webgpu');
        
                instance.#webgpu.context.configure({
                    device: instance.device,
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    alphaMode: 'premultiplied'
                });

                // Load and store the renderer
                await renderer.from_uri(value["renderer"])
                .then(__renderer => { this.#instance_context.renderer = __renderer; });

                // Load and store the initial scene
                await scene.from_uri(value["initial scene"])
                .then(__scene => { this.#instance_context.scene = __scene; });

                // Set up the window
                {

                    // Store the canvas width
                    instance.#webgpu._canvas.width  = value.window.width;

                    // Store the canvas height
                    instance.#webgpu._canvas.height = value.window.height;

                    // Set the title of the document
                    document.title = value.window.title;
                    
                    // Set the body CSS such that the canvas fills the entire page
                    document.body.style = "width: 100%; height: 100%; margin: 0;"

                    // Resize the canvas when the window is resized
                    document.body.onresize = ( () => {

                        // Set the width of the canvas
                        instance.#webgpu._canvas.width  = window.innerWidth;

                        // Set the height of the canvas
                        instance.#webgpu._canvas.height = window.innerHeight;
                    })();

                }     
                
                // Set up the input
                if ( typeof value["input"] == "object" )
                    this.#instance_context.input = await new input( value["input"] );
                else
                    this.#instance_context.input = await input.from_uri( value["input"] );
                
            }

            // Return
            return this;
        } )();
    }

    /**
     * Construct a G10 instance singleton from a URL
     * 
     * @param {URL} url - A URL to a G10 instance JSON object
     * 
     * @returns {Promise<instance>} A promise that returns the instance.
     */
    static async from_url ( url )
    {
        
        // Request the URL ...
        const ret = await fetch(url)
        
        // ... then parse the response into JSON ...
        .then(response => response.json())

        // ... then use the JSON to construct an instance ...
        .then(value => new instance(value));

        // ... then return the instance to the caller
        return ret;
    }

    /**
     * Get the name of the instance
     *
     * @returns {string} The name of the G10 instance
     */
    get name ( )
    {
        return this.#_name
    }

    /**
     * Get the WebGPU adapter
     * 
     * @returns {GPUAdapter}
     */
    get adapter ( )
    {
        return instance.#webgpu.adapter.adapter
    }

    get adapter_info ( )
    {
        return instance.#webgpu.adapter.info
    }

    static get device ( )
    {       
        return instance.#webgpu.device
    }

    static get context ( )
    {
        return instance.#active_instance;
    }

    static get webgpu_context()
    {
        return instance.#webgpu.context;
    }

    get active_scene ( )
    {
        return this.#instance_context.scene;
    }

    get active_renderer ( )
    {
        return this.#instance_context.renderer;
    }

    get active_input ( )
    {
        return this.#instance_context.input;
    }

    static get canvas ( )
    {
        return instance.#webgpu._canvas;
    }

    static async cache_part ( _part )
    {
        instance.context.#cache.parts[`${_part.name}`] = _part;
    }

    static async find_part ( name )
    {
        return instance.context.#cache.parts[name]
    }

    static cache_material ( _material )
    {
        instance.context.#cache.materials[`${_material.name}`] = _material;
    }

    static find_material ( name )
    {
        return instance.context.#cache.materials[name]
    }

    static cache_ai ( _ai )
    {
        instance.context.#cache.ais[`${_ai.name}`]
    }

    static find_ai ( name )
    {
        return instance.context.#cache.ais[name]
    }

    print_adapter_info ( )
    {
        console.log(
            "WebGPU adapter info:" + 
            "\n\tArchitecture: " + instance.#webgpu.adapter.info.architecture +
            "\n\tDescription : " + instance.#webgpu.adapter.info.description +
            "\n\tDevice      : " + instance.#webgpu.adapter.info.device +
            "\n\tDriver      : " + instance.#webgpu.adapter.info.driver +
            "\n\tVendor      : " + instance.#webgpu.adapter.info.vendor 
        );
    }
}