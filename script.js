// --- Intersection Observer for Scroll Reveals ---
document.addEventListener("DOMContentLoaded", () => {
  // Nav dark mode on scroll
  window.addEventListener("scroll", () => {
    document
      .getElementById("mainNav")
      .classList.toggle("solid", window.scrollY > 60);
  });

  // Scroll reveal animation
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Waitlist Form Handler
  const wlForm = document.getElementById("wlForm");
  if (wlForm) {
    wlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const b = e.target.querySelector("button");
      b.textContent = "✓ You're on the list!";
      b.style.background = "#2a6b35";
      b.disabled = true;
    });
  }

  // Chat Demo Auto-resizing textarea
  const ci = document.getElementById("chatInput");
  if (ci) {
    ci.addEventListener("input", () => {
      ci.style.height = "auto";
      ci.style.height = Math.min(ci.scrollHeight, 120) + "px";
    });

    ci.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
      }
    });
  }

  // Add event listener to send button
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMsg);
  }
});

// --- Chat Demo Logic ---
let chatHistory = [];

function usePrompt(text) {
  const ci = document.getElementById("chatInput");
  if (ci) {
    ci.value = text;
    ci.focus();
    sendMsg();
  }
}

function addMsg(who, txt) {
  const chatMsgs = document.getElementById("chatMsgs");
  const msgDiv = document.createElement("div");
  msgDiv.className = `cmsg ${who}`;

  const whoDiv = document.createElement("div");
  whoDiv.className = "cmsg-who";
  whoDiv.textContent = who === "bot" ? "Kobo" : "You";

  const bubDiv = document.createElement("div");
  bubDiv.className = "cmsg-bub";
  bubDiv.textContent = txt;

  msgDiv.appendChild(whoDiv);
  msgDiv.appendChild(bubDiv);
  chatMsgs.appendChild(msgDiv);

  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

// Simulated bot response logic (for demo purposes)
function simulateBotResponse(userText) {
  const txt = userText.toLowerCase();
  let response =
    "I hear you! To give you the best advice, I'd need to look at your full transaction history. But generally, the best way to stop running out of money is to automatically save toward your fixed expenses the day your salary lands.";

  if (txt.includes("budget") && txt.includes("350")) {
    response =
      "Okay so ₦350k. In Lagos, try this: ₦175k (50%) for fixed needs like rent/transport. ₦105k (30%) for yourself (flexing). ₦70k (20%) saved/invested immediately on payday. Would you like me to auto-save the ₦70k next payday?";
  } else if (txt.includes("dinner")) {
    response =
      'Looking at your current trajectory, you have ₦41,000 "safe to spend" before your next payday. A nice dinner out is fine, but try to keep it under ₦15k so you\'re not stressed next week.';
  } else if (txt.includes("25th") || txt.includes("always run out")) {
    response =
      "The salary trap! 😩 It happens because we usually pay bills and flex first, then save whatever's left (which is usually nothing). Next month, let's reverse it. We'll secure your savings and fixed costs on Day 1.";
  } else if (txt.includes("detty december")) {
    response =
      "Ah, Detty December! The earlier you start, the less you feel it. If we auto-save ₦25,000 every month starting now, you'll have ₦200,000 ready by November without taking loans.";
  } else if (txt.includes("emergency")) {
    response =
      "For a young professional in Lagos, aiming for 3 to 6 months of your absolute basic living expenses is key. If your bare minimum to survive is ₦150k/month, a full emergency fund is ₦450k-₦900k.";
  }

  setTimeout(
    () => {
      const dots = document.getElementById("typingDots");
      if (dots) dots.classList.remove("show");

      const sendBtn = document.getElementById("sendBtn");
      if (sendBtn) sendBtn.disabled = false;

      addMsg("bot", response);
      chatHistory.push({ role: "assistant", content: response });
    },
    1500 + Math.random() * 1000,
  ); // 1.5 - 2.5s delay
}

async function sendMsg() {
  const ci = document.getElementById("chatInput");
  const txt = ci.value.trim();
  if (!txt) return;

  addMsg("usr", txt);
  ci.value = "";
  ci.style.height = "auto"; // reset size

  chatHistory.push({ role: "user", content: txt });

  // Show typing indicator
  const dots = document.getElementById("typingDots");
  if (dots) dots.classList.add("show");

  // Disable send button while "typing"
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.disabled = true;

  // Simulate API call/response
  simulateBotResponse(txt);
}
