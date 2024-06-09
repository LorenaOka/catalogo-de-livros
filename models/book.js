const mongoose = require('mongoose');  // Importa o módulo mongoose

// define o esquema do livro, que especifica a estrutura dos documentos na colecao "books"
const bookSchema = new mongoose.Schema({
  titulo: String,   
  autor: String,   
  isbn: String,     
  paginas: Number,   
  ano: Number,     
  valor: Number     
});

module.exports = mongoose.model('Book', bookSchema);
