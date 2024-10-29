process.env.NODE_ENV = "test";

import http from "http";
import { Cookie, CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import Axios from "axios";
import { setupServer, SetupServerApi } from "msw/node";
import assert from "node:assert/strict";

const port = 8777;

const dumbServer = async () => {
  // promise until loaded
  return new Promise((resolve, reject) => {
    http
      .createServer((req, res) => {
        // console.log(req.headers, req.method);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            cookieHeader: req.headers.cookie,
            // headers: req.headers,
            method: req.method,
          })
        );
        res.end();
      })
      .listen(port, () => {
        console.log("Server is up on " + port);
        resolve(0);
      });
  });
};

await dumbServer();
const mswServer = setupServer();

const url = `http://localhost:${port}`;
const cookieJar = new CookieJar();

const axios = wrapper(
  Axios.create({
    baseURL: url,
    jar: cookieJar,
    withCredentials: true,
  })
);

const cookie = new Cookie({
  key: "key",
  value: "value",
  sameSite: "lax",
  path: "/",
  secure: false,
  domain: "localhost",
});

cookieJar.setCookieSync(cookie, url);

const result1 = await axios.post("/mypath");
assert(
  result1.data.cookieHeader === "key=value",
  "Before turning on MSW server"
);

mswServer.listen({ onUnhandledRequest: "bypass" });

const result2 = await axios.post("/mypath");
assert(
  result2.data.cookieHeader === "key=value",
  "After turning on MSW server"
);

console.log("No errors, all cookies passed ✅");
