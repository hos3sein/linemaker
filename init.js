const fetch = require("node-fetch");

exports.createPerm = async () => {
  const data = [
    {
      name: "approve request",
      description: "approve pending request",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "admin",
      funcName: "approverequest",
      number: 20,
    },
    {
      name: "all request",
      description: "get all pending request",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "admin",
      funcName: "allpendings",
      number: 21,
    },

    {
      name: "request for group",
      description: "request for add group to me",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "user",
      funcName: "request",
      number: 22,
    },

    {
      name: "all request me",
      description: "get all request me ",
      iconName: "approve",
      libIconName: "lib approve",
      serviceName: "approve",
      prefixName: "user",
      funcName: "all",
      number: 23,
    },
  ];

  const url = `http://localhost:8012/api/v1/setting/dev/allper`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();

    if (response.data.length) {
      response.data.find(async (elem) => {
        if (elem.number == 20) {
          return console.log("rad sho");
        } else {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            try {
              const urll = `http://localhost:8012/api/v1/setting/permission/create`;
              const rawResponse = await fetch(urll, {
                method: "POST",
                headers: {
                  Accept: "*/*",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(element),
              });
              const response = await rawResponse.json();
            } catch (err) {
              console.log("err", err);
            }
          }
        }
      });
    } else {
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        try {
          const urll = `http://localhost:8012/api/v1/setting/dev/createperm`;
          const rawResponse = await fetch(urll, {
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(element),
          });
          const response = await rawResponse.json();
        } catch (err) {
          console.log("err", err);
        }
      }
    }
  } catch (err) {
    console.log("err", err);
  }
};
