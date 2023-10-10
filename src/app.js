const { Telegraf, Scenes } = require("telegraf");
const LocalSession = require("telegraf-session-local");
const StartCommand = require("./commands/start.command");
const MenuCommand = require("./commands/menu.command");
const BuyUsdtScene = require("./scenes/buy_usdt.scene");
require("dotenv").config();
const { TOKEN } = process.env;
class Bot {
  constructor(token) {
    this.bot = new Telegraf(token);
    this.commands = [new StartCommand(this.bot), new MenuCommand(this.bot)];
    this.scenes = [BuyUsdtScene];

    this.initMiddleware();
    this.initCommands();
    this.bot.launch();
    console.log("Бот запущен");
  }

  initMiddleware() {
    this.bot.use(new LocalSession({ database: "session.json" }).middleware());
    const stage = new Scenes.Stage(this.scenes);
    this.bot.use(stage.middleware());
  }

  initCommands() {
    this.commands.forEach((command) => command.register());
  }
}

const bot = new Bot(TOKEN);
