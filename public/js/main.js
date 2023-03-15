const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "https://www.cio.com/wp-content/uploads/2023/02/chatbot_ai_machine-learning_emerging-tech-100778305-orig-1.jpg?quality=50&strip=all&w=1024";
const PERSON_IMG = "data:image/jpeg;base64,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";
const BOT_NAME = "Jay";
const PERSON_NAME = ""
const socket = io();

socket.on("auto-response", (message)=>{
    botResponse(message)
})

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  let msgText = msgerInput.value;
  msgText = msgText.trim()
  if (!msgText) return;
  socket.emit("chatMessage", msgText)
  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

});

// Append message to the DOM
function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse(msg) {
  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msg);
  }, 1000);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}


