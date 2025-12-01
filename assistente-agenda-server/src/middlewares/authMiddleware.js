require('dotenv').config();
const { google } = require('googleapis');

module.exports = async (req, res, next) => {
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send('Acesso negado: Access Token não fornecido');
  }

  try {
    const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.SECRET_ID, process.env.REDIRECT);
    oauth2Client.setCredentials({ access_token: accessToken });
    
    next();
  } catch (error) {
    console.log('Erro ao autenticar com o Google:', error.message);
    return res.status(401).send('Acesso negado');
  }
};