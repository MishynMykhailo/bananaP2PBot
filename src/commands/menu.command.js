const { Markup } = require("telegraf");

class MenuCommand {
  constructor(bot) {
    this.bot = bot;
  }
  btn1 = "💰 Курс Покупка USDT";
  btn2 = "💵 Курс Продажа USDT";
  btn3 = "❌ Закрыть меню";
  handle() {
    this.bot.command("menu", (ctx) => {
      console.log(ctx.session, ctx.message);
      ctx.reply(
        "Какое действие выбираем",
        Markup.keyboard([[this.btn1, this.btn2], [this.btn3]])
      );
      this.bot.hears(this.btn1, (ctx) => {
        ctx.scene.enter("rate_usdt");
      });

      this.bot.hears(this.btn2, (ctx) => {
        ctx.scene.enter("rate_usdt");
      });

      this.bot.hears(this.btn3, (ctx) => {
        ctx.reply("Меню закрыто!");
      });
    });
  }
}

module.exports = MenuCommand;
