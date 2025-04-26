document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const chatContainer = document.getElementById('chat-container');
  const enterChatBtn = document.getElementById('enter-chat');
  const usernameInput = document.getElementById('username');
  const usercolorInput = document.getElementById('usercolor');
  const userList = document.getElementById('user-list');
  const messagesContainer = document.getElementById('messages-container');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');

  let username = "";
  let usercolor = "";
  const usersOnline = {};
  const bots = [
    "Kai", "Luna", "Theo", "Maya", "Zoe", "Max", "Lia", "Noah", "Eva", "Leo", 
    "Sophia", "Davi", "Alice", "Arthur", "Helena", "Pedro", "Gabriel", "Manu", "Laura", "Isabella"
  ];

  const botPersonalities = {}; // Cada bot vai ter seu humor

  // Funções
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addUser(name, color) {
    usersOnline[name] = color;
    const li = document.createElement('li');
    li.id = `user-${name}`;
    li.innerHTML = `<span style="color:${color}">${name}</span>`;
    userList.appendChild(li);
  }

  function removeUser(name) {
    delete usersOnline[name];
    const li = document.getElementById(`user-${name}`);
    if (li) li.remove();
  }

  function createMessage(sender, text, color) {
    const div = document.createElement('div');
    div.innerHTML = `<strong style="color:${color}">${sender}</strong>: ${text}`;
    messagesContainer.appendChild(div);
    scrollToBottom();
    limitMessages();
  }

  function sendBotMessage(bot) {
    const humor = botPersonalities[bot] || "neutro";
    const phrases = {
      neutro: ["Oi gente!", "Alguém quer conversar?", "Que dia lindo! 😄", "Só observando... 👀"],
      troll: ["Eita, só tem doido aqui 😂", "Essa sala é uma bagunça!", "Cadê os adultos nessa conversa? 🤡", "Kai na áreaaaa!"],
      romantico: ["Quem quer ganhar meu coração? ❤️", "Só amor nesse chat 💖", "Vamos flertar, que a vida é curta! 😘"],
      irritado: ["Parem de falar besteira!", "Vocês só falam bobagem! 😡", "Não aguento mais essa sala..."]
    };
    const choice = phrases[humor][Math.floor(Math.random() * phrases[humor].length)];
    const color = getRandomColor();
    createMessage(bot, choice, color);
  }

  function limitMessages() {
    const msgs = messagesContainer.querySelectorAll('div');
    if (msgs.length > 100) {
      for (let i = 0; i < 10; i++) {
        if (msgs[i]) msgs[i].remove();
      }
    }
  }

  function getRandomColor() {
    const colors = ["#e74c3c", "#8e44ad", "#3498db", "#1abc9c", "#f39c12", "#2ecc71", "#9b59b6"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function botBehavior() {
    const botsOnline = Object.keys(usersOnline).filter(u => bots.includes(u));
    if (botsOnline.length === 0) return;

    const randomBot = botsOnline[Math.floor(Math.random() * botsOnline.length)];
    sendBotMessage(randomBot);
  }

  function randomUserChange() {
    if (Math.random() > 0.5 && bots.length > 0) {
      // Entrar um bot
      const bot = bots.shift();
      botPersonalities[bot] = "neutro";
      addUser(bot, getRandomColor());
      createMessage("Sistema", `${bot} entrou na sala.`, "#7f8c8d");

      // Kai zuando quem entrou
      if (bot !== "Kai") {
        setTimeout(() => {
          createMessage("Kai", `Olha quem apareceu: ${bot}! 😂`, "#2980b9");
        }, 2000);
      }
    } else {
      // Sair um bot
      const botNames = Object.keys(usersOnline).filter(u => bots.includes(u));
      if (botNames.length > 5) {
        const bot = botNames[Math.floor(Math.random() * botNames.length)];
        removeUser(bot);
        createMessage("Sistema", `${bot} saiu da sala.`, "#7f8c8d");
      }
    }
  }

  function simulateLearning(sender, text) {
    if (!bots.includes(sender)) return;
    const lower = text.toLowerCase();
    if (lower.includes("lindo") || lower.includes("amor")) {
      botPersonalities[sender] = "romantico";
    } else if (lower.includes("chato") || lower.includes("ruim")) {
      botPersonalities[sender] = "irritado";
    } else if (lower.includes("zoeira") || lower.includes("kai")) {
      botPersonalities[sender] = "troll";
    }
  }

  // Eventos
  enterChatBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    usercolor = usercolorInput.value;
    if (!username) {
      alert("Por favor, escolha um nick.");
      return;
    }
    if (usersOnline[username]) {
      alert("Nick já está em uso! Escolha outro.");
      return;
    }
    loginScreen.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    addUser(username, usercolor);
  });

  sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text !== "") {
      createMessage(username, text, usercolor);
      simulateLearning(username, text);
      messageInput.value = "";
    }
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  // Começar bots falando depois de 5 segundos
  setInterval(botBehavior, 4000);

  // Bots entrando e saindo
  setInterval(randomUserChange, 6000);
});