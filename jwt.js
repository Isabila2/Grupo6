const express = require('express');

const passport = require('passport');

const passportJWT = require('passport-jwt');

const jwt = require('jsonwebtoken');



const app = express();

const port = 3000;



// Simulação de uma base de dados de usuários (substitua por uma implementação real)

const users = [

  { id: 1, username: 'usuario1', password: 'senha123' },

  { id: 2, username: 'usuario2', password: 'senha456' },

];



// Configuração da estratégia JWT

const JWTStrategy = passportJWT.Strategy;

const ExtractJWT = passportJWT.ExtractJwt;



passport.use(

  new JWTStrategy(

    {

      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

      secretOrKey: 'secreto', // Substitua por sua chave secreta real

    },

    (jwtPayload, done) => {

      // Verifique se o usuário com o ID no token JWT existe na base de dados

      const user = users.find((u) => u.id === jwtPayload.id);



      if (user) {

        return done(null, user);

      } else {

        return done(null, false, { message: 'Usuário não encontrado' });

      }

    }

  )

);



app.use(express.json());



app.use(express.static(__dirname + '/'));



// ...



app.get('/', (req, res) => {

  res.sendFile(__dirname + '/login.html');

});



// Rota de autenticação

app.post('/login', (req, res) => {

  const { username, password } = req.body;



  // Simule a autenticação do usuário (substitua por uma implementação real)

  const user = users.find((u) => u.username === username && u.password === password);



  if (!user) {

    return res.status(401).json({ message: 'Credenciais inválidas' });

  }



  // Gere um token JWT e retorne-o para o cliente

  const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' }); // Substitua por sua chave secreta real



  res.json({ token });

});



// Rota protegida

app.get('/protegida', passport.authenticate('jwt', { session: false }), (req, res) => {

  res.json({ message: 'Rota protegida acessada com sucesso!' });

});



app.listen(3000, () => {

  console.log(`Servidor rodando na porta ${port}`);

});



