import User from '../schemas/userSchema.js';

export function userHandler(app) {

    // POST /signin
    app.post('/signin', async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = new User({ username, password });

            await user.save();
            res.status(201).send('Usuario registrado con éxito');
        } catch (error) {
            res.status(500).send('Error al registrar usuario');
        }
    });

    // POST /login
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send('Usuario no encontrado');
            }

            const isMatch = await user.comparePassword(password);

            if (isMatch) {
                res.status(200)
                .send({
                    userId: user._id
                });
            } else {
                res.status(401).send('Contraseña incorrecta');
            }
        } catch (error) {
            res.status(500).send('Error al autenticar');
        }
    });
}

