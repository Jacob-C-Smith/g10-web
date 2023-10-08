class linear
{

    static mul_mat4_mat4 ( M, N )
    {

        return ([
                (M[0] * N[0] + M[1] * N[4] + M[2] * N[8] + M[3] * N[12]),
                (M[0] * N[1] + M[1] * N[5] + M[2] * N[9] + M[3] * N[13]),
                (M[0] * N[2] + M[1] * N[6] + M[2] * N[10] + M[3] * N[14]),
                (M[0] * N[3] + M[1] * N[7] + M[2] * N[11] + M[3] * N[15]),
                (M[4] * N[0] + M[5] * N[4] + M[6] * N[8] + M[7] * N[12]),
                (M[4] * N[1] + M[5] * N[5] + M[6] * N[9] + M[7] * N[13]),
                (M[4] * N[2] + M[5] * N[6] + M[6] * N[10] + M[7] * N[14]),
                (M[4] * N[3] + M[5] * N[7] + M[6] * N[11] + M[7] * N[15]),
                (M[8] * N[0] + M[9] * N[4] + M[10] * N[8] + M[11] * N[12]),
                (M[8] * N[1] + M[9] * N[5] + M[10] * N[9] + M[11] * N[13]),
                (M[8] * N[2] + M[9] * N[6] + M[10] * N[10] + M[11] * N[14]),
                (M[8] * N[3] + M[9] * N[7] + M[10] * N[11] + M[11] * N[15]),
                (M[12] * N[0] + M[13] * N[4] + M[14] * N[8] + M[15] * N[12]),
                (M[12] * N[1] + M[13] * N[5] + M[14] * N[9] + M[15] * N[13]),
                (M[12] * N[2] + M[13] * N[6] + M[14] * N[10] + M[15] * N[14]),
                (M[12] * N[3] + M[13] * N[7] + M[14] * N[11] + M[15] * N[15]),
        ]);
    }

    static identity_mat4 ( )
    {
        return ([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0 
        ]);
    }

    static translation_mat4 ( v )
    {
        return ([
            1.0 , 0.0 , 0.0 , 0.0,
            0.0 , 1.0 , 0.0 , 0.0,
            0.0 , 0.0 , 1.0 , 0.0,
            v[0], v[1], v[2], 1.0
        ]);
    }

    static scale_mat4 ( v )
    {
        return ([
            v[0], 0.0 , 0.0 , 0.0,
            0.0 , v[1], 0.0 , 0.0,
            0.0 , 0.0 , v[2], 0.0,
            0.0 , 0.0 , 0.0 , 1.0
        ]);
    }

    static rotation_mat4_from_vec3 ( v )
    {
        const x = v[0],
              y = v[1],
              z = v[2];

        return ([
                Math.cos(x) + Math.pow(x, 2) * ( 1.0 - Math.cos(x) ),
                x * y * ( 1.0 - Math.cos(y) ) - z * Math.sin(y),
                x * z * ( 1.0 - Math.cos(z) + y * Math.sin(z) ),
                0,
                y * x * ( 1.0 - Math.cos(x) ) + z * Math.sin(x),
                Math.cos(y) + Math.pow(y, 2) * ( 1.0 - Math.cos(y) ),
                y * z * ( 1.0 - Math.cos(z) ) - x * Math.sin(z),
                0,
                y * x * ( 1.0 - Math.cos(x) ) + z * Math.sin(x),
                y * x * ( 1.0 - Math.cos(x) ) + z * Math.sin(x),
                Math.cos(x) + Math.pow(x, 2) * ( 1.0 - Math.cos(x) ),
                0,
                0.0,
                0.0,
                0.0,
                1.0,
        ]);
    }

    static model_matrix ( location, rotation, scale )
    {
        return (
            this.mul_mat4_mat4(
            this.mul_mat4_mat4(
                this.scale_mat4(scale),
                this.translation_mat4(location)
            ),
            this.rotation_mat4_from_vec3(rotation)
        ) )
    }
}