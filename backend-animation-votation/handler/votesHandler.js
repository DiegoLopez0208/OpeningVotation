import Vote from '../schemas/voteSchema.js';

export function votesHandler(app) {
    // GET /votes/:userid
    app.get('/votes/:id', async (req, res) => {
        const votes = await Vote.find({ userId: req.params.id })

        if (!votes) {
            return res.status(404).send('No se encontraron votos para este usuario')
        }

        res.send(votes)
    })

    // POST /vote
    app.post('/vote', async (req, res) => {
        const { openingId, userId, vote } = req.body

        const userVotes = await Vote.find({ userId })

        // Encontrar los votos 0 y 11 entre todos los votos
        const zeroVote = userVotes.find(v => v.vote === 0)
        const elevenVote = userVotes.find(v => v.vote === 11)

        if (vote === 0 && zeroVote) {
            return res.status(400).send('El usuario ya ha utilizado su voto nulo');
        }
        
        if(vote === 11 && elevenVote) {
            return res.status(400).send('El usuario ya ha utilizado su voto 11')
        }

        // Encontrar el voto existente para el openingId y userId
        const existingVote = await Vote.findOne({ openingId, userId })

        if(!existingVote) {
            const newVote = new Vote({
                openingId,
                userId,
                vote
            })
        
            newVote.save()
            return res.send('Voto agregado correctamente!')
        }


        existingVote.vote = vote


        existingVote.save()
        return res.send('Voto actualizado correctamente!')
    })
}