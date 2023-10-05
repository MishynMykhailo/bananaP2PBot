const { Telegraf, Scenes, session } = require("telegraf");
const StartCommand = require("./commands/start.command");
const LocalSession = require("telegraf-session-local");
const MenuCommand = require("./commands/menu.command");
const rateUsdtScene = require("./scenes/rate_usdt.scene");

require("dotenv").config();

const { TOKEN } = process.env;

class Bot {
  bot;
  commands = [];
  scenes = [];

  constructor(token) {
    this.bot = new Telegraf(token);
    this.bot.use(new LocalSession({ database: "session.json" })).middleware();
  }

  init() {
    this.commands.push(new StartCommand(this.bot));
    this.commands.push(new MenuCommand(this.bot));
    this.scenes.push(rateUsdtScene);

    // Создайте объект stage после добавления сцен:
    const stage = new Scenes.Stage(this.scenes);
    this.bot.use(stage.middleware());

    for (const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}

const bot = new Bot(TOKEN);
bot.init();
