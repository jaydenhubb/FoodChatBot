const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const session = require("express-session");
const path = require('path')

const fastfoods = [
  { name: "shawarma", price: 1200, tag: "2", qty: 0 },
  { name: "suya", price: 1000, tag: "4", qty: 0 },
  { name: "pizza", price: 1500, tag: "6", qty: 0 },
  { name: "candy", price: 500, tag: "8", qty: 0 },
];

const orderHistory = [];

const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
});

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// app.use("server", express.static(path.join(__dirname, "public")));

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  console.log("new customer in", socket.id);
  let customer = {
    name: "",
    cart: null,
  };
  const check = async()=>{
    if(customer.cart === null){
        await autoResponse(
            `Input <b>1</b> to view list of options`)
    }
  }

  const autoResponse = async (msg) => {
    
    socket.emit("auto-response", msg);
  };

 
  const userResponse = async (msg) => {
 
    try {
      if (!customer.name) {
        customer.name = msg;
        await autoResponse(
          `welcome to Chop-Grow, <i>${customer.name}</i>: <br>Press <b>1</b> to view list of available menu.`
        );
      } else {
        switch (msg) {
          case "1":
            // Generate the list of items dynamically
            const itemOptions = fastfoods
              .map((food) => `<b>${food.name}</b> => <b>${food.tag}</b><br>`)
              .join("\n");
              customer.cart = []
            await autoResponse(
              `Available products and their respective tags:<br>${itemOptions}Please select one by inputing its corresponding tag.`
            );
            break;
          case "2":
            check()
            let Item1 = fastfoods.find((val) => val.tag === "2")
            const item1Index = customer.cart.findIndex(
              (val) => val.tag === "2"
            );
            if (item1Index === -1) {
              Item1.qty = 1;
              customer.cart.push(Item1);
            } else {
              Item1.qty += 1;
            }
            await autoResponse(
              `<b><i>${Item1.name}</i></b> has been added to your order. <br>Input <b>1</b> to place more orders. <br>Input <b>97</b> to view current orders.<br>Input <b>99</b> to checkout placed orders.<br>Input <b>98</b> to view checked out order(s).`
            );
            break;
          case "4":
            check()
            const Item2 = fastfoods.find((val) => val.tag === "4");
            const item2Index = customer.cart.findIndex(
              (val) => val.tag === "4"
            );
            if (item2Index === -1) {
              Item2.qty = 1;
              customer.cart.push(Item2);
            } else {
              Item2.qty += 1;
            }
            await autoResponse(`<b><i>${Item2.name}</i></b> has been added to your order. <br>Input <b>1</b> to place more orders. <br>Input <b>97</b> to view current orders.<br>Input <b>99</b> to checkout placed orders.<br>Input <b>98</b> to view checked out order(s).`);
            break;
          case "6":
            check()
            const Item3 = fastfoods.find((val) => val.tag === "6");
            const item3Index = customer.cart.findIndex(
              (val) => val.tag === "6"
            );
            if (item3Index === -1) {
              Item3.qty = 1;
              customer.cart.push(Item3);
            } else {
              item3Index.qty += 1;
            }
            await autoResponse(`<b><i>${Item3.name}</i></b> has been added to your order. <br>Input <b>1</b> to place more orders. <br>Input <b>97</b> to view current orders.<br>Input <b>99</b> to checkout placed orders.<br>Input <b>98</b> to view checked out order(s).`);
            break;
          case "8":
            check()
            const Item4 = fastfoods.find((val) => val.tag === "8");
            const item4Index = customer.cart.findIndex(
              (val) => val.tag === "8"
            );
            if (item4Index === -1) {
              Item4.qty = 1;
              customer.cart.push(Item4);
            } else {
              Item4.qty += 1;
            }
            await autoResponse(`<b><i>${Item4.name}</i></b> has been added to your order. <br>Input <b>1</b> to place more orders. <br>Input <b>97</b> to view current orders.<br>Input <b>99</b> to checkout placed orders.<br>Input <b>98</b> to view checked out order(s).`);
            break;
            case "99":
              if (customer.cart.length === 0) {
                await autoResponse(
                  "No placed orders to checkout. Please input <b>1</b> to place order."
                );
              } else {
                customer.cart.map((prod) => orderHistory.push(prod));
                await autoResponse("Order placed successfully! <br>Input <b>1</b> to place more orders.<br>Input <b>98</b> to view checked out order(s).");
                customer.cart = [];
              }
              break;
            case "98":
              if (orderHistory.length === 0) {
                await autoResponse("No previous orders. Please input <b>1</b> to place order.");
              }
              else if( customer.cart.length === null){
                  await autoResponse(`Input <b>1</b> to view list of options`);
              } 
              else {const price = orderHistory.reduce((acc, val)=>{
                return acc + (val.price*val.qty)
              }, 0)
              
                const orderHistoryString = orderHistory
                  .map((order) => `<b>${order.name} Qty:${order.qty} Price:${order.price} </b>each<br>`)
                  .join("\n");
                await autoResponse(
                  `Here are your previous orders:<br>${orderHistoryString}Total cost:${price}`
                );
              }
              break;
            case "97":
              
              if (customer.cart.length === 0 ) {
                await autoResponse("No current order. Please input <b>1</b> to start placing orders.");
              } 
              else if( customer.cart.length === null){
                  await autoResponse(`Input <b>1</b> to view list of options`);
              }
              else {
                const price = customer.cart.reduce((acc, val)=>{
                  return acc + (val.price*val.qty)
                }, 0)
                const currentOrder = customer.cart
                  .map((order) => `<b>${order.name} Qty:${order.qty} Price:${order.price}</b>each<br>`)
                  .join("\n");
                  
                await autoResponse(
                  `Here is your current order:<br>${currentOrder}Total cost:${price}`
                );
              }
              break;
            case "0":
              if (customer.cart.length === 0) {
                await autoResponse("You have no plced order to cancel. Please input <b>1</b> to start placing orders.");
              }
              else if( customer.cart.length === null){
                  await autoResponse(`Input <b>1</b> to view list of options`);
              } 
              else {
                customer.cart = [];
                await autoResponse("Order cancelled. Input <b>1</b> to view list of options");
              }
              break;
            default:
              await autoResponse("Invalid input <br>Please input <b>1</b> to view list of options");
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
