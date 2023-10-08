const axios = require("axios");
require("dotenv").config();

const { BINANCE_URL } = process.env;

async function getP2Ppage(data) {
  const { method, bank } = data;
  console.log(method, bank);
  try {
    const url = BINANCE_URL; // Перенес url сюда
    const headers = {
      "Content-Type": "application/json",
    };

    const jsonData = {
      page: 1,
      rows: 1,
      asset: "USDT", // Используйте переданный параметр asset или "USDT" по умолчанию
      fiat: "UAH", // Используйте переданный параметр fiat или "UAH" по умолчанию
      tradeType: method, // Используйте переданный параметр tradeType или "Sell" по умолчанию
      payTypes: [bank], // Используйте переданный параметр payTypes или ["PrivatBank"] по умолчанию
      transAmount: 1000, // Используйте переданный параметр transAmount или 1000 по умолчанию
    };

    try {
      const response = await axios.post(url, jsonData, { headers });
      console.log(response.data.data);
      return response.data.data.map(({ adv, advertiser }) => {
        const {
          tradeType,
          asset,
          fiatUnit,
          price,
          surplusAmount,
          dynamicMaxSingleTransAmount,
          minSingleTransAmount,
          fiatSymbol,
        } = adv;
        const { nickName, monthOrderCount, monthFinishRate } = advertiser;

        return {
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
        };
      });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  } catch (error) {
    throw error;
  }
}

// Пример использования getP2Ppage:
// getP2Ppage({ page: 1, rows: 1 })
//   .then(({ data }) => {
//     const result = data.map(({ adv, advertiser }) => {
//       const {
//         tradeType,
//         asset,
//         fiatUnit,
//         price,
//         surplusAmount,
//         dynamicMaxSingleTransAmount,
//         minSingleTransAmount,
//         fiatSymbol,
//       } = adv;
//       const { nickName, monthOrderCount, monthFinishRate } = advertiser;

//       return {
//         tradeType,
//         asset,
//         fiatUnit,
//         price,
//         surplusAmount,
//         dynamicMaxSingleTransAmount,
//         minSingleTransAmount,
//         fiatSymbol,
//         nickName,
//         monthOrderCount,
//         monthFinishRate,
//       };
//     });
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error.message);
//   });
module.exports = getP2Ppage;
