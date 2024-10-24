import userSchema from '../schemas/userSchema.js';
import voteSchema from '../schemas/voteSchema.js';

export function votesHandler(app) {
    // GET /votes/:userid
    app.get('/votes/:id', async (req, res) => {
        const votes = await voteSchema.find({ userId: req.params.id })

        if (!votes) {
            return res.status(404).send('No se encontraron votos para este usuario')
        }

        res.send(votes)
    })

    // POST /vote
    app.post('/vote', async (req, res) => {
        const { openingId, userId, vote } = req.body

        const userVotes = await voteSchema.find({ userId })
        const user = await userSchema.findById({ _id: userId })

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
        const existingVote = await voteSchema.findOne({ openingId, userId })

        if(!existingVote) {
            const newVote = new voteSchema({
                submittedBy: user.username,
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