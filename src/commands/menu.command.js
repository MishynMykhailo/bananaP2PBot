const { Markup } = require("telegraf");

class MenuCommand {
  constructor(bot) {
    this.bot = bot;
  }

  register() {
    this.bot.command("menu", this.showMenu.bind(this));
    this.bot.hears(this.btn1, this.handleBuy.bind(this));
    this.bot.hears(this.btn2, this.handleSell.bind(this));
    this.bot.hears(this.btn3, this.handleCloseMenu.bind(this));
  }

  btn1 = "💰 Курс Покупка USDT";
  btn2 = "💵 Курс Продажа USDT";
  btn3 = "❌ Закрыть меню";

  async showMenu(ctx) {
    ctx.scene.session.fetchData = {};
    await ctx.reply(
      "Какое действие выбираем?",
      Markup.keyboard([[this.btn1, this.btn2], [this.btn3]]).resize()
    );
  }

  async handleBuy(ctx) {
    await ctx.scene.enter("rate_usdt");
    ctx.scene.session.fetchData.method = "buy";
  }

  async handleSell(ctx) {
    await ctx.scene.enter("rate_usdt");
    ctx.scene.session.fetchData.method = "sell";
  }

  async handleCloseMenu(ctx) {
    await ctx.reply("Меню закрыто!");
  }
}

module.exports = MenuCommand;
