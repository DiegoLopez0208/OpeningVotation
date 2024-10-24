import Opening from '../schemas/openingSchema.js';

export function openingsHandler(app) {

    // POST /opening
    app.post('/opening', async (req, res) => {
        const { title, url, start, chorus } = req.body;
    
        const newOpening = new Opening({
            title,
            url,
            start,
            chorus,
        })
    
        newOpening.save()
        res.send('Opening agregado correctamente!')
    })

    // GET /opening/:id
    app.get('/opening/:id', async (req, res) => {
        const opening = await Opening.findById(req.params.id)
    
        if (!opening) {
            return res.status(404).send('No se encontró el opening')
        }
    
        res.send(opening)
    })

    // GET /openings
    app.get('/openings', async (req, res) => {
        const openings = await Opening.find()
    
        if (!openings) {
            return res.status(404).send('No existen openings almacenados')
        }
    
        res.send(openings)
    })
}
