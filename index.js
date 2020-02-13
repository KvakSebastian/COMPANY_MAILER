var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const nodemailer = require('nodemailer');
var session = require('express-session');
const mysql = require("mysql2");
const fileUpload = require('express-fileupload');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(fileUpload());

app.use('/public', express.static('public'));



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'nodelogin',
  port: 3306,
});
connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.post('/auth', function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/mailer');
      } else {

        response.render('index', { boo: true, n: false });
      }
      response.end();
    });
  } else {
    response.render('index', { boo: true, n: true });
  }
});






app.post('/reg', function (request, response) {
  var name = request.body.name;
  var email = request.body.email;
  var username = request.body.username;
  var password = request.body.password;
  if (name && email && username && password) {
    connection.query("INSERT INTO accounts (username, password) VALUES(?,?)",
      [username, password], function (error, results, fields) {
      });
    connection.query("INSERT INTO users (user,username) VALUES(?,?)",
      [name, username], function (error, results) {
        var inputId = results.insertId;
        connection.query("INSERT INTO user_emails (user_id,user_email,user_name) VALUES(?,?,?)",
          [inputId, email, username], function (error, results) {
            response.render('/index', { boo: false, n: false });
            response.end();
          });
      });

  }
  else {
    res.render('404');
    response.end();
  }
});


app.post('/upd', function (request, response) {
  var ntu = request.body.name;
  var etu = request.body.email;
  if (ntu && etu) {
    connection.query('SELECT id FROM users WHERE username = ?', ntu, function (error, results, fields) {
      var nid = results[0].id;

      if (nid) {
        connection.query("INSERT INTO user_emails (user_id,user_email,user_name) VALUES(?,?,?)",
          [nid, etu, ntu], function (error, results) {
            response.render('mailer');
            response.end();

          });
      } else {
        response.render('upd');
        response.end();

      }
    });
  }
});





app.post('/add', function (request, response) {
  var nta = request.body.name;
  var eta = request.body.email;
  if (nta && eta) {
    connection.query('INSERT INTO unregisted (name,email) VALUES(?,?)',
      [nta, eta], function (error, results) {
        if (error) {
          response.render('add');
        }
        else {
          response.redirect('mailer');

        }

      });
  }
});







app.get('/', function (req, res) {
  req.session.loggedin = false;
  res.render('index', { boo: false, n: false });
});

app.get('/index', function (req, res) {
  req.session.loggedin = false;
  res.render('index', { boo: false, n: false });
});

app.get('/test', function (req, res) {
  res.render('test');
});
app.get('/add', function (req, res) {
  res.render('add');
});
app.get('/upd', function (req, res) {
  res.render('upd');
});
app.get('/404', function (req, res) {

  res.render('404');
});


app.get('/mailer', function (request, response) {
  if (request.session.loggedin) {
    connection.query('SELECT user_email,user_name FROM user_emails ', function (error, results, fields) {
      var i = 0;
      var arr = new Array(); var index = new Array();

      ;
      while (i < results.length) {
        arr[i] = results[i].user_email + '  ' + results[i].user_name;
        index[i] = results[i].user_email;


        i++;

      }
      arr = arr.sort();
      index = JSON.stringify(index);
      arr = JSON.stringify(arr);

      response.render('mailer', { arr: arr, index: index });

    });
  } else {
    response.render('404');
  }
});

app.post('/mailer', function (req, res) {
  // Sending Emails with SMTP, Configuring SMTP settings

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kvaksebastian@gmail.com',
      pass: 'mercedes621'
    }
  });
  var a = new Array();
  var adr = new Array();

  a[0] = req.body.email;

  adr = req.body.mul;
  if (req.body.email) {
    adr = adr.concat(a);
  }
  if (req.body.sampleFile) {


    let sampleFile;
    let uploadPath;

    if (Object.keys(req.files).length == 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }


    sampleFile = req.files.sampleFile;

    uploadPath = __dirname + '/public/' + sampleFile.name;
    sampleFile.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).send(err);
      }

    });
    var mailOptions = {
      from: 'kvaksebastian@gmail.com',
      to: adr,
      subject: req.body.subject + " ✔",
      html: "<b>" + req.body.description + "</b>",
      attachments: [{
        filename: sampleFile.name,
        path: uploadPath,
        cid: 'sdfsdf' //my mistake was putting "cid:logo@cid" here!
      }]

    };


  }
  else {
    var mailOptions = {
      from: 'kvaksebastian@gmail.com',
      to: adr,
      subject: req.body.subject + " ✔",
      html: "<b>" + req.body.description + "</b>",
    };




  }




  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.redirect('mailer');
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('mailer');
    }
  });
}

);



app.listen(3000);
