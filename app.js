const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // COMPLETE API INFORMATION BELOW
  const apiKey = "5807590a36ed2642e1ac83a44e9937b0-us12";
  const apiReg = "us12";
  const apiListId = "0f8b438d07";

  const jsonData = JSON.stringify(data);

  const url = `https://${apiReg}.api.mailchimp.com/3.0/lists/${apiListId}`;

  const options = {
    method: "POST",
    auth: `dgknmr:${apiKey}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
