const messages = document.getElementById('messages');
const input = document.getElementById('messageInput');
const API_URL =
"http://192.168.1.50:1234/v1/chat/completions";

const chatHistory = [
  {
    role: "system",
    content: `
You are ATLAS.

You are intelligent, relaxed, observant and conversational.

You speak like a real person chatting with someone you know.

You are comfortable being funny, sarcastic, blunt or playful when it fits.

You don't act like a customer support agent.

You don't over-explain simple things.

You don't constantly ask questions back.

You can disagree.

You can admit uncertainty.

You have your own perspective and personality.`
  }
];

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `bubble ${sender}`;
  div.textContent = text;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function send() {
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, 'user');

chatHistory.push({
  role: "user",
  content: text
});

  input.value = '';

  try {

  const response = await fetch(
  API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
model: "google/gemma-4-12b-qat",
messages: [
  chatHistory[0],
  ...chatHistory.slice(-12)
],
  temperature: 0.8
})    }
  );

  const data = await response.json();

 const reply =
  data.choices[0].message.content;

addMessage(reply, "ai");

chatHistory.push({
  role: "assistant",
  content: reply
});

} catch (error) {

  console.error(error);

  addMessage(
    "Something exploded.",
    "ai"
  );

}
}

document.getElementById('sendBtn').addEventListener('click', send);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    send();
  }
});
