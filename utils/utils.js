// convert function
exports.convertCurrencies = (rates, amount, destCurr) => {
  return +(amount * rates[destCurr]).toFixed(2)
};

// returns an array of max values in oject
exports.getMaxValue = object => {
  return Object.keys(object).filter(x => {
       return object[x] == Math.max.apply(null, 
       Object.values(object));
 });
};