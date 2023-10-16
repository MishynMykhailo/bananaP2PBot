module.exports = { markupInfoOperation, markupListOrders };
function markupInfoOperation({ transAmount, method, bank }) {
  return [
    `*Ваши данные:*`,
    `---------------------------------------------------------------------------------------`,
    `🧐 *Выбранное действие:* Информация о курсе - ${method} 🧐`,
    `---------------------------------------------------------------------------------------`,
    `🏛 *Банк:* ${bank} 🏛 `,
    `---------------------------------------------------------------------------------------`,
    `💰 *Минимальная сумма объявления:* ${transAmount} 💰`,
    `---------------------------------------------------------------------------------------`,
  ].join("\n");
}
function markupListOrders(data, index) {
  const {
    tradeType,
    asset,
    fiatUnit,
    price,
    surplusAmount,
    dynamicMaxSingleTransAmount,
    minSingleTransAmount,
    fiatSymbol,
    nickName,
    monthOrderCount,
    monthFinishRate,
    bank,
  } = data;

  //      return [
  //     `|👤 *Имя:* ${nickName} `,
  //     `|`,
  //     `|🤔 *Операц.за месяц/рейтинг:* ${monthOrderCount}/${monthFinishRate}`,
  //     `|`,
  //     `|💰 *Осталось ${asset}:* ${surplusAmount}`,
  //     `|`,
  //     `|📊 Торгует от ${minSingleTransAmount} ${fiatSymbol} до ${dynamicMaxSingleTransAmount} ${fiatSymbol}`,
  //     `|`,
  //     `|🧐 *Продает* 1 ${asset} за ${price} ${fiatSymbol}`,
  //     `|`,
  //     `|🏛 *Банк:* ${bank}`,
  //     `--------------------------------------`,
  //   ]
  return [
    `|*№* ${index + 1} 
    |
    |👤 *Имя:* ${nickName.toString()}
    |
    |🤔 *Операц.за месяц/рейтинг:* ${monthOrderCount}/${monthFinishRate}
    |
    |💰 *Осталось ${asset|| 'value'}:* ${surplusAmount}
    |
    |📊 Торгует от ${minSingleTransAmount} ${fiatSymbol} до ${dynamicMaxSingleTransAmount} ${fiatSymbol}
    |
    |🧐 *Продает* 1 ${asset|| 'value'} за ${price} ${fiatSymbol}
    |
    |🏛 *Банк:* ${bank}
    --------------------------------------`,
  ];
}
