const jwt = require("jsonwebtoken");
const fs = require("fs");
const cp = require("child_process");
const util = require("util");
const execP = util.promisify(cp.exec);
const readFilePromise = util.promisify(fs.readFileSync);

async function main() {
  try {
    await execP("bash ./secure.sh");

    const private = fs.readFileSync("./private.pem");
    const public = fs.readFileSync("./public.pem");

    console.log("done");
    const userPayload = {
      id: 123,
      roles: ["user", "admin"]
    };

    const token = jwt.sign(userPayload, private, {
      algorithm: "RS256",
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 2
    });

    console.log(token);

    console.log(jwt.verify(token, public, { algorithms: "RS256" }));
  } catch (error) {
    console.error(error);
  }
}

main();
