const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const session = require("express-session");
const path = require("path");




const sessionMiddleware = session({
  secret: "jayboi-carax",
  resave: false,
  saveUninitialized: true,
});

app.use(express.static("public"));
app.use(sessionMiddleware);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});
io.on("connection", (socket) => {
  const orderHistory = [];
  console.log("new customer in", socket.id);
  let customer = {
    name: "",
    cart: [],
  };
  const check = async () => {
    if (customer.cart === null) {
      await autoResponse(`Input <b>1</b> to view list of available menu.`);
    }
  };

  const autoResponse = async (msg) => {
    socket.emit("auto-response", msg);
  };

  const userResponse = async (msg) => {
    try {
      const fastfoods = [
        { name: "shawarma", price: 1200, tag: "2", qty: 1},
        { name: "suya", price: 1000, tag: "4", qty: 1 },
        { name: "candy", price: 500, tag: "8", qty: 1 },
        { name: "pizza", price: 1500, tag: "6", qty:1 },
      ];
      if (!customer.name) {
        customer.name = msg;
        await autoResponse(
          `welcome to Jay Food, <b>${customer.name}!</b> <br>Press <b>1</b> to view list of available menu.`
        );
      } else {
        switch (msg) {
          case "1":
            // Generate the list of items dynamically
            const itemOptions = fastfoods
              .map((food) => `<b>${food.name}</b> => <b>${food.tag}</b><br>`)
              .join("\n");
            // customer.cart = [];
            await autoResponse(
              `Available products and their respective tags:<br>${itemOptions}Please select a product by inputing its corresponding tag.`
            );
            break;
          case "2":
            check();
            let Item1 = fastfoods.find((val) => val.tag === "2");
            const item1Index = customer.cart.findIndex(
              (val) => val.tag === "2"
            );
            if (item1Index === -1) {
              customer.cart.push(Item1);
            } else {
              customer.cart[item1Index].qty++
            }
            await autoResponse(
              `<b><i>${Item1.name}</i></b> has been added to your order list. <br>Input <b>1</b> to view menu and place more orders. <br>Input <b>97</b> to view order list.<br>Input <b>99</b> to checkout order list.<br>Input <b>0</b> to clear order list.`
            );
            break;
          case "6":
            check();
            let Item7 = fastfoods.find((val) => val.tag === "6");
            const item7Index = customer.cart.findIndex(
              (val) => val.tag === "6"
            );
            if (item7Index === -1) {
              customer.cart.push(Item7);
            } else {
              customer.cart[item7Index].qty++
            }
            await autoResponse(
              `<b><i>${Item7.name}</i></b> has been added to your order list. <br>Input <b>1</b> to view menu and place more orders. <br>Input <b>97</b> to view order list.<br>Input <b>99</b> to checkout order list.<br>Input <b>0</b> to clear order list.`
            );
            break;
          case "4":
            check();
            const Item2 = fastfoods.find((val) => val.tag === "4");
            const item2Index = customer.cart.findIndex(
              (val) => val.tag === "4"
            );
            if (item2Index === -1) {
              customer.cart.push(Item2);
            } else {
              customer.cart[item2Index].qty++
            }
            await autoResponse(
              `<b><i>${Item2.name}</i></b> has been added to your order list. <br>Input <b>1</b> to view menu and place more orders. <br>Input <b>97</b> to view order list.<br>Input <b>99</b> to checkout order list.<br>Input <b>0</b> to clear order list.`
            );
            break;
          case "8":
            check();
            const Item4 = fastfoods.find((val) => val.tag === "8");
            const item4Index = customer.cart.findIndex(
              (val) => val.tag === "8"
            );
            if (item4Index === -1) {
              customer.cart.push(Item4);
            } else {
              customer.cart[item4Index].qty++
            }
            await autoResponse(
              `<b><i>${Item4.name}</i></b> has been added to your order list. <br>Input <b>1</b> to view menu and place more orders. <br>Input <b>97</b> to view order list.<br>Input <b>99</b> to checkout order list.<br>Input <b>0</b> to clear order list.`
            );
            break;
          case "99":
            check()
            if (customer.cart.length === 0) {
              await autoResponse(
                "No orders to checkout. Please input <b>1</b> to place order."
              );
              return
            } 
            if(orderHistory.length === 0) {
              customer.cart.map((prod) => orderHistory.push(prod));
              customer.cart = [];
              await autoResponse(
                "Order checkedout successfully! <br>Input <b>1</b> to view menu and place more orders.<br>Input <b>98</b> to view checkedout order(s)."
              );
              return
            }
            else{
              const bar = JSON.parse(JSON.stringify(customer.cart))
              for (let i = 0; i < bar.length; i++) {
                const key1 = bar[i].name;
                for (let j = 0; j < orderHistory.length; j++) {
                  const key2 = orderHistory[j].name;
                  if (key1 === key2) {
                    orderHistory[j].qty +=bar[i].qty
                    const rem = bar.findIndex((val)=> val.name===key1)
                    delete customer.cart[rem]
                    break
                  }
                }
              }
              customer.cart.map((prod) => orderHistory.push(prod));
              customer.cart = [];
              await autoResponse(
                "Order checkedout successfully! <br>Input <b>1</b> to view menu and place more orders.<br>Input <b>98</b> to view checkedout order(s)."
              );
            }
            break;
          case "98":
            check()
            if (orderHistory.length === 0) {
              await autoResponse(
                "No previous checkedout orders. Please input <b>1</b> to view menu and place order."
              );
            } 
            else {
              const price = orderHistory.reduce((acc, val) => {
                return acc + (val.price * val.qty);
              }, 0);

              const orderHistoryString = orderHistory
                .map(
                  (order) =>
                    `<b>${order.name} Qty:${order.qty} Price:${order.price} </b> each<br>`
                )
                .join("\n");
              await autoResponse(
                `Here are your previous checked out orders:<br>${orderHistoryString} <b>Total cost:${price}</b><br>Input <b>1</b> to view menu and place more orders.`
              );
            }
            break;
          case "97":
            check()
            if (customer.cart.length === 0) {
              await autoResponse(
                "No current order.<br>Input <b>1</b> to view menu and place more orders.<br>Input <b>99</b> to checkout order list."
              );
            }  
            else {
              const price = customer.cart.reduce((acc, val) => {
                return acc + val.price * val.qty;
              }, 0);
              const currentOrder = customer.cart
                .map(
                  (order) =>
                    `<b>${order.name} Qty:${order.qty} Price:${order.price}</b> each<br>`
                )
                .join("\n");

              await autoResponse(
                `Here is your current order:<br>${currentOrder} <b>Total cost:${price}</b><br>Input <b>0</b> to cancel orders.<br>Input <b>1</b> to view menu and place more orders.<br>Input <b>99</b> to checkout order list.`
              );
            }
            break;
          case "0":
            check()
            if (customer.cart.length === 0) {
              await autoResponse(
                "You have no placed order to cancel. Please input <b>1</b> to start placing orders."
              );
            } 
            else {
              customer.cart = [];
              await autoResponse(
                "Order cancelled. Input <b>1</b> to view menu and start placing orders."
              );
            }
            break;
          default:
            await autoResponse(
              "Invalid input <br>Please input <b>1</b> to view menu."
            );
        }
      }
    } catch (err) {
      console.log(err.message);
    }
    //     // socket.emit("user-response", msg)
  };

  socket.on("chatMessage", (msg) => {
    userResponse(msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("server running on port", process.env.PORT);
});
