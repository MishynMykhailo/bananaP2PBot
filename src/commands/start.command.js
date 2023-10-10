const { Markup } = require("telegraf");

class StartCommand {
  constructor(bot) {
    this.bot = bot;
  }

  register() {
    this.bot.start(this.onStart.bind(this));
    this.bot.action("course_like", this.onLike.bind(this));
    this.bot.action("course_dislike", this.onDislike.bind(this));
  }

  async onStart(ctx) {
    await ctx.reply(
      "Вам понравился курс?",
      Markup.inlineKeyboard([
        Markup.button.callback("Like", "course_like"),
        Markup.button.callback("Dislike", "course_dislike"),
      ])
    );
  }

  async onLike(ctx) {
    ctx.session.courseLike = true;
    await ctx.editMessageText("Круто");
  }

  async onDislike(ctx) {
    ctx.session.courseLike = false;
    await ctx.editMessageText("Плохо");
  }
}

module.exports = StartCommand;
