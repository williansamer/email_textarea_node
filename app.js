const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, //587 para quando NÃO tem criptografia. 465 para quando TEM criptografia.
    secure: false, //false, pois não está usando criptografia
    auth: {user: process.env.EMAIL_USER,  //'auth' de authentication(autenticação)
            pass: process.env.EMAIL_PASS}
    })

app.use("/", express.urlencoded({extended: true}), express.static(path.join(__dirname, "public")));

app.get("/", (req, res)=>{
    res.send("<a href='/contato.html'>Contato</a>");
})

app.post("/contato", (req, res)=>{

    let emailUser = req.body.email;
    let subject = req.body.subject;
    let message = req.body.message;

    transporter.sendMail({ //Enviar email >>>Isso retorna uma PROMISSE. Necessário usar o 'then' após
        from: process.env.EMAIL_USER, // Indica quem está enviando o email. Sempre será o email próprio. Importando que o email esteja no mesmo domínio que o servidor. Neste caso é o domínio 'gmail'
        to: process.env.EMAIL_USER, //  
        replyTo: emailUser, //Email do usuário
        subject: subject, //Assunto
        text: message, //Corpo da mensagem(textarea)
        //html  >>> Poderia criar um 'html' caso fosse enviar uma URL.
    })
    .then(info=>{
        console.log(info);
        res.send("Mensagem enviada com sucesso")
    })
    .catch((error)=>{
        console.log(error);
        res.send("Ocorreu um erro no envio")
    })
})

app.listen(3000, ()=>{
    console.log("Server running..");
})