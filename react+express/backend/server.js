const express = require('express')
const app = express()
const axios = require('axios').default;

const { XMLParser } = require("fast-xml-parser")


app.get('/login', async (req, res) => {
  const { ticket } = req.query;

  const serviceURL = "http%3A%2F%2Flocalhost%3A8080%2Flogin";
  const originURL = "http://localhost:3000"
  const  {data} = await axios.get(
    `https://sso.ui.ac.id/cas2/serviceValidate?ticket=${ticket}&service=${serviceURL}`, {
    transformResponse: [],
    responseType: 'text',
      }
  );
  const parser = new XMLParser();
  const dataMhs = parser.parse(data);
  const payload = {token: "", nama: dataMhs?.['cas:serviceResponse']?.['cas:authenticationSuccess']?.['cas:attributes']?.['cas:nama']}
  
  const wait = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Please Wait</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="wrap">
      <h3>If you're seing this pagee, some is wrong happening</h3>
    </div>
    <script type="application/javascript">
      (() => {
        if (window.opener) {
          window.opener.postMessage(${ JSON.stringify(payload) }, "${originURL}");
        } else {
          console.log("something bad happened");
        }
      })();
    </script>
  </body>
</html>
`;

  res.status(200).send(wait);
})

app.listen(8080, () => {
  console.log(`listening on port 8080`)
})
