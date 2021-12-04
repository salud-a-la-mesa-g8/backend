const axios = require("axios");
const config = require("../config");
const sms1 = config.cfg.sms1;
const sms2 = config.cfg.sms2;
const userMail = config.cfg.userMail;
const userPwd = config.cfg.usPw;
var nodemailer = require('nodemailer');

module.exports = {
  sms: async (celular, codigo) => {
    const texto = "Comidas Saludables. Escribe el numero " + codigo + " en la casilla - codigo recibido - incluso si hay ceros al principio."
    const ruta = sms1 + "57" + celular + sms2 + texto
    axios.get(ruta)
      .then(respuestaItCoud => {
        // res = ["-2","-6","0"]
        if (respuestaItCoud.length > 12) {
          return true
        } else {
          return false
        }
      })
      .catch(err => {
        console.log("err:", err)
        return false

      });
  },
  emailRecuperar: async (correo, nombre, codigo) => {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userMail,
        pass: userPwd
      }
    });

    var mailOptions = {
      from: userMail,
      to: correo,
      subject: 'Comidas Saludables - cambio password',
      html: `
        <table border="0" cellpadding="0" cellspacing="0" width="80%">
          <tr background-color="#2E4589" bgcolor="#2E4589">
            <td bgcolor="" width="80%">
                <h1 style="color: #fff;text-align:center;">
                  Bienvenido
                </h1>                
                <h2 style="color: #B0E0E6; text-align:center">
                  ${nombre}
                </h2>                    
                <p style="color: #fff; text-align:center; padding:1rem">
                  Para recuperar el acceso a la plataforma de Comidas Saludables debes
                  ingresar en la casilla de - código recibido - los siguientes 6 números, incluso si empiezan con ceros.
                </p>                
            </td>            
          </tr>

          <tr background-color='#020329' bgcolor='#020329'>
            <td bgcolor="" align="center" width="80%">
              <h1 style="color: #fff; text-align:center">
                ${codigo}
              </h1>
            </td>  
          </tr>

          <tr background-color=white bgcolor=white>
            <td bgcolor="" align="center" padding:"1rem" width="80%">
              <img style="text-align:center" src="cid:logo"/>
            </td>  
          </tr>

          <tr background-color="#2E4589" bgcolor="#2E4589">
            <td bgcolor="" width="80%" text-align:center>
              <p style="color:white; text-align:center">
                Comidas Saludables<br/>
                Proyecto Ciclo 4 <br/>
                UTP-MinTic - 2021
              </p>            
            </td>
          </tr>
        
      </table>
    `,
      attachments: [{
        filename: 'email-img.png',
        path: __dirname + '/email-img.png',
        cid: 'logo'
      }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return false
      } else {
        console.log('El correo se envío correctamente: ' + info.response);
        return true;
      }
    });

  }
}
