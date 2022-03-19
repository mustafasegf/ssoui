// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { XMLParser } from "fast-xml-parser";

export default async function handler(req, res) {
  const { ticket } = req.query;

  const serviceURL = "http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin%2F";
  const originURL = "http://localhost:3000"
  const response = await fetch(
    `https://sso.ui.ac.id/cas2/serviceValidate?ticket=${ticket}&service=${serviceURL}`
  );
  const data = await response.text();

  const parser = new XMLParser();
  const dataMhs = parser.parse(data);
  console.log(dataMhs);

  const wait = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Please Wait</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        background-color: white;
        color: #5d31ff;
        font-family: -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
          "Helvetica Neue", sans-serif;
        font-size: 16px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div id="wrap">
      <h3>Ada yang salah</h3>
    </div>
    <script type="application/javascript">
      (() => {
        if (window.opener) {
          window.opener.postMessage("done", "${originURL}");
          console.log('sending data')
        } else {
          console.log("idk");
        }
      })();
    </script>
  </body>
</html>
`;

  res.status(200).send(wait);
}
