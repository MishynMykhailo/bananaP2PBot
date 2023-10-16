const { Scenes, Markup } = require("telegraf");
const getP2Ppage = require("../services/getP2Ppage");
const getCurrentFormattedDate = require("../helpers/getCurrentFormattedDate");
const {
  markupListOrders,
  markupInfoOperation,
} = require("../helpers/markupMessage");
const { BaseScene } = Scenes;

class BuyUsdtScene extends BaseScene {
  constructor() {
    super("buy_usdt", { ttl: 25 });
    this.enter(this.askBank.bind(this));
    this.action("privatBank", this.handlePrivateBank.bind(this));
    this.action("monobank", this.handleMonoBank.bind(this));
    this.action("minAmount", this.handleMinAmountBtn.bind(this));
    this.action("maxAmount", this.handleMaxAmountBtn.bind(this));
    this.hears(/.+/, this.getResponseUserAmount.bind(this));
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
      [
        "🏛Выбранный банк - ПриватБанк",
        "",
        "🧐Сколько хотите обменять гривны?",
        "",
        "⬇️Выберите плашку либо введите число:",
      ].join("\n"),
      Markup.inlineKeyboard([
        Markup.button.callback(500, "minAmount"),
        Markup.button.callback(1000, "maxAmount"),
      ])
    );
    ctx.scene.session.awaitingSumInput = true;
    ctx.scene.session.fetchData.bank = ctx.match.input;
  }

  async handleMonoBank(ctx) {
    await ctx.reply(
      "Вы выбрали Monobank.Но он пока не работает⛔️Выберите приват"
    );
    return ctx.scene.leave();
  }

  async handleMinAmountBtn(ctx) {
    ctx.scene.session.fetchData.transAmount = 500;
    await this.sendRequestInformation(ctx);
    await this.sendListOrders(ctx);
  }

  async handleMaxAmountBtn(ctx) {
    ctx.scene.session.fetchData.transAmount = 1000;
    await this.sendRequestInformation(ctx);
    await this.sendListOrders(ctx);
  }

  async getResponseUserAmount(ctx) {
    let { awaitingSumInput } = ctx.scene.session;

    if (!awaitingSumInput) {
      return;
    }
    const { text: userArmount } = ctx.message;

    if (isNaN(userArmount)) {
      return await ctx.reply(`Введите число, без сторонних символов`);
    }
    if (userArmount < 400) {
      return await ctx.reply("Сумма должна быть не меньше 400 грн");
    }
    console.log("1", userArmount);
    await ctx.reply(`Вы ввели сумму: ${userArmount}`);
    awaitingSumInput = false;

    ctx.scene.session.fetchData.transAmount = Number(userArmount);
    await this.sendRequestInformation(ctx);
    try {
      await this.sendListOrders(ctx);
    } catch (error) {
      console.log(error);
    }
  }

  async sendRequestInformation(ctx) {
    const { transAmount, method, bank } = ctx.scene.session.fetchData;

    const message = markupInfoOperation({ transAmount, method, bank });

    await ctx.reply(message, { parse_mode: "Markdown" });
  }

  async sendListOrders(ctx) {
    const response = await getP2Ppage(ctx.scene.session.fetchData);
    const resultMessage = await response.map((e, index) => {
      return markupListOrders(e, index);
    });

    if (!resultMessage) {
      return await ctx.reply("Попробуйте позже");
    }
    await ctx.reply(resultMessage.join("\n"), {
      parse_mode: "Markdown",
    });

    await ctx.scene.leave(() => {
      ctx.reply("Bye bye");
    });
  }
}

module.exports = new BuyUsdtScene();
