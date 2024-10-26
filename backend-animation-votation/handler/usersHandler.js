import User from '../schemas/userSchema.js';

export function userHandler(app) {

    // POST /signin
    app.post('/api/signin', async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = new User({ username, password });

            await user.save();
            res.send({
                status: 201,
                message: 'Usuario registrado con éxito'
            });
        } catch (error) {
            res.send({
                status: 500, 
                message: 'Error al registrar usuario'
            });
        }
    });

    // POST /login
    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;

        console.log(username, password)

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.send({
                    status: 401,
                    message: 'Usuario no encontrado'
                });
            }

            const isMatch = await user.comparePassword(password);

            if (isMatch) {
                res.send({
                    status: 200,
                    message: 'Autenticado correctamente',
                    userId: user._id
                });
            } else {
                res.send({
                    status: 401,
                    message: 'Contraseña incorrecta'
                });
            }
        } catch (error) {
            res.send({ 
                status: 500,
                message: 'Error al autenticar'
            });
        }
    });
}

