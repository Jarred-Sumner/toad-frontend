const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
});
const config = require("./config");

const GRAPHQL_URL = `${config.BASE_HOSTNAME}/graphql`;

fetch(GRAPHQL_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie:
      "toads_session=spW1a1qHv7~Mey~0qCT9o8RYfRoS~MgAo8ld~0nib1j37DmdsUBeFG9wkE3YPxUM"
  },
  body: JSON.stringify({
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
})
  .then(result => result.json())
  .then(result => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      type => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData;
    fs.writeFile("./fragmentTypes.json", JSON.stringify(result.data), err => {
      if (err) {
        console.error("Error writing fragmentTypes file", err);
      } else {
        console.log("Fragment types successfully extracted!");
      }
    });
  });
