// See documentation on https://github.com/frankrousseau/americano-cozy/#models

var americano = require('americano');

var NoteModel = americano.getModel('Note', {
  title: String,
  date: Date,
  content: String
});

module.exports = NoteModel;
