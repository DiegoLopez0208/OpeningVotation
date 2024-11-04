import Opening from "../schemas/openingSchema.js";

export function openingsHandler(app) {
  // POST /opening
  app.post("/api/opening", async (req, res) => {
    const { title, url, start, chorus } = req.body;

    const newOpening = new Opening({
      title,
      url,
      start,
      chorus,
    });

    newOpening.save();
    res.send({
      status: 201,
      message: "Opening agregado correctamente!",
    });
  });

  // GET /api/opening/:id
  app.get("/api/opening/:id", async (req, res) => {
    try {
      // Obtener el opening actual por su ID
      const opening = await Opening.findById(req.params.id).sort({ title: 1 });

      if (!opening) {
        return res.send({
          status: 404,
          message: "No se encontró el opening",
        });
      }

      // Obtener el opening anterior en orden alfabético
      const previousOpening = await Opening.findOne({
        title: { $lt: opening.title },
      }).sort({ title: -1 }); // Orden descendente para obtener el más cercano

      // Obtener el opening siguiente en orden alfabético
      const nextOpening = await Opening.findOne({
        title: { $gt: opening.title },
      }).sort({ title: 1 }); // Orden ascendente para obtener el más cercano

      res.send({
        status: 200,
        message: "Opening encontrado",
        data: {
          op: opening,
          prevOp: previousOpening ? previousOpening._id : null,
          nextOp: nextOpening ? nextOpening._id : null,
        },
      });
    } catch (error) {
      res.send({
        status: 500,
        message: "Error al obtener el opening",
        error,
      });
    }
  });

  // GET /openings
  app.get("/api/openings", async (req, res) => {
    const openings = await Opening.find().sort({ title: 1 });

    if (!openings) {
      return res.send({
        status: 404,
        message: "No existen openings almacenados",
      });
    }

    res.send({
      status: 200,
      message: "Openings encontrados",
      openings,
    });
  });
}
