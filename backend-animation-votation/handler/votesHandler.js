import userSchema from "../schemas/userSchema.js";
import voteSchema from "../schemas/voteSchema.js";

export function votesHandler(app) {
  // GET /votes/:userid
  app.get("/api/votes/:id", async (req, res) => {
    const votes = await voteSchema.find({ userId: req.params.id });

    if (votes.length === 0) {
      return res.status(404).send({
        status: 404,
        message: "No se encontraron votos para este usuario",
      });
    }

    res.send({
      status: 200,
      message: "Votos encontrados",
      data: votes,
    });
  });

  // POST /vote
  app.post("/api/vote", async (req, res) => {
    const { openingId, userId, vote } = req.body;

    try {
      // Verificar si ya existe un voto del usuario para el opening
      const existingVote = await voteSchema.findOne({ openingId, userId });

      if (vote === 0 || vote === 11) {
        // Verificar si el usuario ya usó su voto especial de 0 o 11
        const specialVoteUsed = await voteSchema.findOne({ userId, vote });
        if (specialVoteUsed) {
          return res.status(400).send({
            status: 400,
            message: `Ya utilizaste tu voto por ${vote}!`,
          });
        }
      }

      if (existingVote) {
        if (existingVote.vote === vote) {
          return res.status(200).send({
            status: 200,
            message: "Ya tienes este voto registrado para este opening!",
          });
        }
        // Actualizar el voto existente
        existingVote.vote = vote;
        await existingVote.save();
        return res.status(200).send({
          status: 200,
          message: "Voto actualizado correctamente!",
        });
      }

      // Crear un nuevo voto
      const user = await userSchema.findOne({ _id: userId });
      const newVote = new voteSchema({
        openingId,
        userId,
        submittedBy: user.username,
        vote,
      });

      await newVote.save();
      return res
        .status(201)
        .send({ status: 201, message: "Voto agregado correctamente!" });
    } catch (error) {
      console.error("Error al procesar el voto:", error);
      return res.status(500).send({
        status: 500,
        message: "Error al procesar el voto",
      });
    }
  });
}
