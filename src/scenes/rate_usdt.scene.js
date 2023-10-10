const { Scenes, Markup } = require("telegraf");
const getP2Ppage = require("../services/getP2Ppage");
const getCurrentFormattedDate = require("../helpers/getCurrentFormattedDate");
const {
  markupListOrders,
  markupInfoOperation,
} = require("../helpers/markupMessage");
const { BaseScene } = Scenes;

class RateUsdtScene extends BaseScene {
  constructor() {
    super("rate_usdt", { ttl: 25 });
    this.enter(this.askBank.bind(this));
    this.action("privatBank", this.handlePrivateBank.bind(this));
    this.action("monobank", this.handleMonoBank.bind(this));
    this.hears(/.+/, this.captureInput.bind(this));
  }

  async askBank(ctx) {
    await ctx.reply(
      "Какой банк вас интересует?",
      Markup.inlineKeyboard([
        Markup.button.callback("ПриватБанк", "privatBank"),
        Markup.button.callback("МоноБанк", "monobank"),
      ])
    );
  }

  async handlePrivateBank(ctx) {
    ctx.editMessageText(
      "privatBank. Сколько хотите обменять гривны? Введите число:"
    );
    ctx.scene.session.awaitingSumInput = true;
    ctx.scene.session.fetchData.bank = ctx.match.input;
  }

  async handleMonoBank(ctx) {
    await ctx.reply("Вы выбрали Monobank.");
    return ctx.scene.leave();
  }

  async captureInput(ctx) {
    const { awaitingSumInput } = ctx.scene.session;
    if (awaitingSumInput) {
      const sum = Number(ctx.message.text);

      await ctx.reply(`Вы ввели сумму: ${sum}`);

      awaitingSumInput = false;

      ctx.scene.session.fetchData.transAmount = sum;

      const { transAmount, method, bank } = ctx.scene.session.fetchData;

      const message = markupInfoOperation({ transAmount, method, bank });

      await ctx.reply(message, { parse_mode: "Markdown" });
      const result = await getP2Ppage(ctx.scene.session.fetchData);
      const resultMessage = result.map((e, index) =>
        markupListOrders(e, index)
      );

      const finalMessage = [
        `*Запрос сделан:* ${getCurrentFormattedDate()} `,
        `-------------------------------------------------------------`,
        ...resultMessage,
      ];

      await ctx.reply(finalMessage.join("\n"), {
        parse_mode: "Markdown",
      });
    }
  }
  async captureInput(ctx) {
    const { awaitingSumInput } = ctx.scene.session;

    if (!awaitingSumInput) {
      return;
    }
    const { text: userArmount } = ctx.message;
    console.log(userArmount, typeof userArmount);

    await ctx.reply(`Вы ввели сумму: ${sum}`);

    awaitingSumInput = false;

    ctx.scene.session.fetchData.transAmount = sum;

    const { transAmount, method, bank } = ctx.scene.session.fetchData;

    const message = markupInfoOperation({ transAmount, method, bank });

    await ctx.reply(message, { parse_mode: "Markdown" });
    const result = await getP2Ppage(ctx.scene.session.fetchData);
    const resultMessage = result.map((e, index) => markupListOrders(e, index));

    const finalMessage = [
      `*Запрос сделан:* ${getCurrentFormattedDate()} `,
      `-------------------------------------------------------------`,
      ...resultMessage,
    ];

    await ctx.reply(finalMessage.join("\n"), {
      parse_mode: "Markdown",
    });
  }
}

module.exports = new RateUsdtScene();
