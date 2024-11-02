import userSchema from "../schemas/userSchema.js";
import voteSchema from "../schemas/voteSchema.js";

export function votesHandler(app) {
  // GET /votes/:userid
  app.get("/api/votes/:id", async (req, res) => {
    const votes = await voteSchema.find({ userId: req.params.id });

    if (votes.length === 0) {
      return res.send({
        status: 404,
        message: "No se encontraron votos para este usuario",
        data: [],
      });
    }

    return res.send({
      status: 200,
      message: "Votos encontrados",
      data: votes,
    });
  });

  // POST /vote
  app.post("/api/vote", async (req, res) => {
    const { openingId, userId, vote } = req.body;

    console.log("Recibido:", { openingId, userId, vote }); // Agregar depuración aquí

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

      // Verificar si el usuario fue encontrado
      if (!user) {
        console.error("Usuario no encontrado para el ID:", userId); // Mensaje de error
        return res.status(404).send({
          status: 404,
          message: "Usuario no encontrado",
        });
      }

      console.log("Usuario encontrado:", user.username); // Agregar depuración aquí

      const newVote = new voteSchema({
        openingId,
        userId,
        submittedBy: user.username, // Accede a username solo si el usuario fue encontrado
        vote,
      });

      await newVote.save();
      return res.status(201).send({
        status: 201,
        message: "Voto agregado correctamente!",
      });
    } catch (error) {
      console.error("Error al procesar el voto:", error);
      return res.status(500).send({
        status: 500,
        message: "Error al procesar el voto",
      });
    }
  });
}
