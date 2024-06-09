const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Book = require('./models/book');
const fs = require('fs');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const mongoURI = 'mongodb://localhost:27017/livros';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Conectado ao MongoDB');

  // funcao para limpar a colecao de livros
  const clearBooksCollection = async () => {
    try {
      await Book.deleteMany({});
      console.log('Coleção de livros limpa com sucesso!');
    } catch (err) {
      console.error('Erro ao limpar a coleção de livros:', err);
    }
  };

  // funcao para importar dados do JSON
  const importBooks = async () => {
    const booksData = JSON.parse(fs.readFileSync('livros.json', 'utf8'));

    // aqui ele mapeia os dados dos livros para o formato esperado pelo modelo
    const mappedBooksData = booksData.map(book => ({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      paginas: book.paginas,
      ano: book.ano,
      valor: book.valor,
    }));

    // limpa a colecao de livros antes de importar
    await clearBooksCollection();

    console.log('Books Data:', mappedBooksData);
    try {
      await Book.insertMany(mappedBooksData);
      console.log('Livros importados com sucesso!');
    } catch (err) {
      console.error('Erro ao importar livros:', err);
    }
  };

  // importa os livros na inicializacao
  await importBooks();
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});

// configura a view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware para arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// rotas
app.use('/', indexRouter);

// inicia o app de maneira local
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
