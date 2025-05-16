const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido ou expirado." });
      }

      try {
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }

        req.user = {
          id: user._id,
          nome: user.nome,
          email: user.email,
        };

        next();
      } catch (dbErr) {
        return res.status(500).json({ message: "Erro ao autenticar usuário." });
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Erro interno de autenticação." });
  }
};

module.exports = authenticateToken;
