
# Subindo imagem no NodeJS

Um tutorial de uma das milhares de forma de subir uma imagem usando input type file e NodeJS.

## Front

No meu caso estou utilizando HTML para exemplo, no HTML possuo a tag FORM para um formulário.

```
<!-- Utilizando HTML para exemplo, temos a tag FORM para um formulário. -->
<form action="http://localhost:3000/upload" method="post" enctype="multipart/form-data">
```
No exemplo acima, o atributo action especifica para onde os dados do formulário serão enviados. Neste caso, estamos enviando para http://localhost:3000/upload, que é o endpoint responsável por receber e processar o formulário.

O atributo method="post" indica que os dados serão enviados através do método HTTP POST. Isso é comumente usado para enviar dados que serão processados e armazenados no servidor.

O atributo enctype="multipart/form-data" é utilizado quando o formulário contém um campo do tipo file, como no exemplo. Esse tipo de campo é usado para upload de arquivos, e o valor multipart/form-data indica que o navegador deve codificar o formulário de uma forma que permite o envio de arquivos binários.

Depois apenas adicionar o input para subir o arquivo, mas sempre fique atento ao permitir arquivos dependendo do arquivo, pode gerar uma falha de segurança.

```
<input type="file" name="image" accept="image/*">
```

## JavaScript

O JavaScript utiliza o fetch para buscar a url e fonte da imagem trazendo assim cada imagem individualmente, onde anexamos a tag img e colocamos o SRC => Source com a imagem especifica.

```
fetch('http://localhost:3000/images')
            .then(response => response.json())
            .then(images => {
                const imageList = document.getElementById('image-list');
                images.forEach(image => {
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    img.src = `http://localhost:3000/image/${image}`;
                    img.style.maxWidth = '200px';
                    li.appendChild(img);
                    imageList.appendChild(li);
                });
            });
```
## NodeJS
Neste trecho de código, estamos importando as bibliotecas necessárias para o projeto Node.js. 
```
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
```
O express é utilizado para criar o servidor, o multer para lidar com o upload de arquivos, o sharp para processamento de imagens e o cors para permitir o acesso ao servidor de diferentes origens, evitando problemas de política de segurança.

### /upload
Este endpoint espera receber uma imagem através de uma requisição POST para adicioná-la à pasta específica no servidor.
```
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
```

### /images
Este caminho permite listar todas as imagens que estão na pasta "images" do servidor.
```
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
```

### /image/:imageName
Este caminho permite acessar uma imagem específica através do seu nome de arquivo. Ao acessar este caminho com o nome da imagem desejada, o servidor retornará essa imagem.
```
const path = require('path');

app.get('/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    res.sendFile(imagePath);
});
```