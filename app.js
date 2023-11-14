const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: "minhachave",
    resave: false,
    saveUninitialized: true,
  })
);

const produtos = [
  { id: 1, nome: "Arroz", tipo: "alimento", preco: 25 },
  { id: 2, nome: "Feijao", tipo: "alimento", preco: 15 },
  { id: 3, nome: "Bife", tipo: "alimento", preco: 40 },
  { id: 4, nome: "Detergente", tipo: "Produto de limpeza", preco: 25 },
  { id: 5, nome: "Água sanitária", tipo: "Produto de limpeza", preco: 15 },
  { id: 6, nome: "Sabão em pó", tipo: "Produto de limpeza", preco: 40 },
];

app.get("/produtos", (req, res) => {
  res.send(`

  <html>
  <head>
    <link rel="stylesheet" type="text/css" href="/style.css">
  </head>
  <body>
    
        <h1>Lista de Produtos</h1>
        <ul>
            ${produtos
              .map(
                (produto) =>
                  `<li>${produto.nome} - ${produto.preco} <a href="/adicionar/${produto.id}"> Adicionar ao Carrinho </a></li>`
              )
              .join("")}

              <a href="/carrinho">Ver Carrinho</a>

        </ul>
        </body>
    </html>
    `);
});

app.get("/adicionar/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (produto) {
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }
    const dataHora = new Date();
    produto.horarioAdicao = `${dataHora.toLocaleDateString(
      "pt-BR"
    )} ${dataHora.toLocaleTimeString("pt-BR")}`;
    req.session.carrinho.push(produto);
  }

  res.redirect("/produtos");
});

app.get("/carrinho", (req, res) => {
  const carrinho = req.session.carrinho || [];
  const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

  const ultimoTipoAdicionado =
    carrinho.length > 0 ? carrinho[carrinho.length - 1].tipo : null;

  res.send(`
  <html>
    <head>
      <link rel="stylesheet" type="text/css" href="/style.css">
    </head>
      <body>
        <h1>Carrinho de Compras</h1>
        <ul>
            ${carrinho
              .map(
                (produto) =>
                  `<li>${produto.nome} - ${produto.preco} ${produto.tipo} (Adicionado em: ${produto.horarioAdicao})</li>`
              )
              .join("")}
        </ul>

        <h2>Produtos do Mesmo Tipo do Último Adicionado:</h2>
        <ul>
            ${produtos
              .filter((produto) => produto.tipo === ultimoTipoAdicionado)
              .map(
                (produto) =>
                  `<li>${produto.nome} - ${produto.preco} ${produto.tipo}</li>`
              )
              .join("")}
        </ul>
      </body>
        <p>Total: ${total}</p>
        <a href="/produtos">Continuar comprando</a>
    </html>
    `);
});

app.use(express.static("public")); // Serve arquivos estáticos

app.listen(3000, () => console.log("Aplicação rodando"));
