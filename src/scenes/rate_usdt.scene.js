const { Scenes, Markup } = require("telegraf");
const { BaseScene } = Scenes;

const BuyUsdtScene = new BaseScene("rate_usdt", { ttl: 60 });

BuyUsdtScene.enter((ctx) => {
  ctx.reply(
    "Какой банк вас интересует ?",
    Markup.inlineKeyboard([
      Markup.button.callback("ПриватБанк", "privateBank"),
      Markup.button.callback("МоноБанк", "monobank"),
    ])
  );
});

BuyUsdtScene.action("privateBank", (ctx) => {
  console.log(ctx.match.input) // Вывести консоль лог какой банк выбран
  ctx.editMessageText("privateBank. Пожалуйста, введите сумму:");
  ctx.scene.session.awaitingSumInput = true;
});
BuyUsdtScene.on("text", (ctx) => {
  if (ctx.scene.session.awaitingSumInput) {
    // Если мы ожидаем сумму, обрабатываем этот ввод
    const sum = ctx.message.text;
    ctx.reply(`Вы ввели сумму: ${sum}`); // Здесь вы можете добавить дополнительную логику обработки

    ctx.scene.session.awaitingSumInput = false; // Сбрасываем состояние, так как сумма уже введена
    return ctx.scene.leave();
  }
  // Если не ожидаем ввода суммы, то просто проигнорируем это сообщение или обработаем иначе
});
BuyUsdtScene.action("monobank", (ctx) => {
  ctx.reply("You chose Monobank.");
  return ctx.scene.leave(); // exit global namespace
});

BuyUsdtScene.leave((ctx) => {
  if (ctx.scene.session.awaitingSumInput) {
    ctx.reply("Извините, вы долго думали.");
  } else {
    ctx.reply("Thank you for your time!");
  }
  delete ctx.scene.session.awaitingSumInput; // очистка состояния
});

module.exports = BuyUsdtScene;
