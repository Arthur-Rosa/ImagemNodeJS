// Importando as bibliotecas express, multer, sharp e cors
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

// Criando uma instância do express
const app = express();

// Configurando o multer para armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Habilitando o CORS
app.use(cors());

app.post('/upload', upload.single('image'), async (req, res) => {
    try {     
        // Salvar a imagem no disco
        // Aqui você pode salvar a imagem em diferentes formatos, redimensioná-la, etc.
        // Salvando a imagem:
        const imageName = req.file.originalname;
        const imageData = req.file.buffer;

        // Salvar a imagem original no disco
        await sharp(imageData).toFile(`uploads/${imageName}`);

        res.send('Imagem salva com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao salvar a imagem.');
    }
});

const fs = require("fs");

app.get("/images", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) {
      return res.status(500).send("Erro ao listar imagens.");
    }

    const images = files.filter(
      (file) => file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")
    );
    res.send(images);
  });
});

const path = require('path');

app.get('/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    res.sendFile(imagePath);
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
