require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/bit_bot-ascend", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `In Your Honour \nLatency: ${latency}ms` });
});
app.command("/bit_bot-about", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Hello, I am Bit Bot!\n I can provide YSWS related info` });
});

app.command("/bit_bot-cookie", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Num num num , THANK YOU!!!` });
});



app.command("/bit_bot-ysws", async ({ command, ack, respond }) => {
  await ack();
   try {
    const response = await fetch(process.env.YSWS_API_URL);
    const data = await response.json();
    const programs = Array.isArray(data) ? data : 
    Object.values(data).flat();
    
    const searchTerm = command.text.trim().toLowerCase();
    const results  = programs.filter(program => program.name.toLowerCase().includes(searchTerm));
    const ysws = programs.map(program =>{ const status = new Date(program.deadline) < new Date() ? "Ended": program.status; return ` ${program.name}-${status}`});
    const names = results.map(program =>{ const status = new Date(program.deadline) < new Date() ? "Ended": program.status; return ` *${program.name}* \n*Description:* ${program.description}\n*Status:* ${status} | *Deadline:* ${program.deadline}`});
    if(!searchTerm) {
      await respond({ text: `*YSWS Programs:*\n${ysws.join("\n")}` });
    } else {
      await respond({ text: `*YSWS Programs:*\n${names.join("\n")}` });
    }
  } catch (error) {
      console.error(error);
    await respond({ text: "Error fetching YSWS programs." });
  }
});
    

(async () => {
  await app.start();
     console.log("bot is running!");
})();