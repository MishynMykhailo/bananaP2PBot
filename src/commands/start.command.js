const { Markup } = require("telegraf");

class StartCommand {
  constructor(bot) {
    this.bot = bot;
  }
  handle() {
    this.bot.start((ctx) => {
      console.log(ctx.session, ctx.message);
      ctx.reply(
        "Вам понравился курс?",
        Markup.inlineKeyboard([
          Markup.button.callback("Like", "course_like"),
          Markup.button.callback("dislike", "course_dislike"),
        ])
      );
    });
    this.bot.action("course_like", (ctx) => {
      ctx.session.courseLike = true;
      ctx.editMessageText("Круто");
    });
    this.bot.action("course_dislike", (ctx) => {
      ctx.session.courseLike = false;
      ctx.editMessageText("Плохо");
    });
  }
}

module.exports = StartCommand;
