import openingSchema from '../schemas/openingSchema.js'
import voteSchema from '../schemas/voteSchema.js'
import userSchema from '../schemas/userSchema.js'

export function adminHandler(app) {
    //// Admin

    // GET /admin/results

    // GET /admin/results/:openingid
    app.get('/admin/results/:id', async (req, res) => {
        const opening = await openingSchema.findById(req.params.id)

        if (!opening) {
            return res.send({
                message: "Opening no encontrado!"
            })
        }

        const votes = await voteSchema.find({ openingId: req.params.id })

        if (!votes) {
            return res.send({
                message: "El opening no tiene votos registrados!"
            })
        }

        const users = await userSchema.find();

        res.send({
            openingId: opening._id,
            title: opening.title,
            votes: votes
        })
    })

    // POST /admin/download
    app.post('/admin/download', async (req, res) => {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            return res.status(400).send('URL del video es requerida');
        }

        try {
            // Aquí podrías usar una librería para descargar el video
            const videoName = path.basename(videoUrl); // Extraer el nombre del video

            // Aquí puedes usar un paquete como `node-fetch` para descargar el video
            const response = await fetch(videoUrl);
            
            if (!response.ok) {
                throw new Error('Error al descargar el video');
            }

            // Configurar la respuesta para la descarga
            res.set({
                'Content-Type': 'video/mp4', // O el tipo MIME apropiado
                'Content-Disposition': `attachment; filename="${videoName}"`,
            });

            // Pipe the video data into the response
            response.body.pipe(res);
        } catch (error) {
            res.status(500).send('Error al descargar el video');
        }
    });
}