var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var cors = require("cors");
var creds = require("./config");
var validator = require("express-validator");

var transport = {
  host: creds.SERVER,
  port: 587,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take message");
  }
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(validator());

router.post("/send", (req, res, next) => {
  req.assert("name", "Name is needed").notEmpty();
  req.assert("email", "Email is needed").notEmpty().isEmail();
  req.assert("message", "Message is needed").notEmpty();

  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `name: ${name} \nemail: ${email} \nmessage: ${message} `;

  var mail = {
    from: name,
    to: "schmager29@gmail.com",
    subject: "New Message from Marcel-Schmager.com",
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

const corsOption = {
  origin: "http://marcel-schmager.com",
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOption));
app.use(express.json());
app.use("/", router);
app.listen(3002);
