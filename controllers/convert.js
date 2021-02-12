const axios = require("axios");
const Statistics = require("../models/Statistics");
const { convertCurrencies, getMaxValue } = require("../utils/utils")
const statsId = "60250c33c97f530c10f91377";

// @desc      get initial statistics, rates and result
// @route     POST /api/convert/initial
exports.getInitialData = async (req, res, next) => {
  const { amount, baseCurr, destCurr } = req.body;
  try {
    // check values
    if(!baseCurr || !amount || !destCurr) {
      const error = new Error("Insert valid values");
      error.status = 404;
      return next(error)
    }
    
    // check if value is number
    if(isNaN(amount)) {
      const error = new Error("Amount value must be a number");
      error.status = 404;
      return next(error)
    }

    // check for negative values
    if(amount < 0) {
      const error = new Error("Amount must be positive number");
      error.status = 404;
      return next(error)
    }

    // get rates
    const { data } = await axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCurr}`);

    // get all rates including the base one
    const rates = {...data.rates, [data.base]: 1};

    // calculate result
    const result = convertCurrencies(rates, amount, destCurr);

    let statistics = await Statistics.findById(statsId);
    const response = {
      rates,
      statistics, 
      result: {
        result,
        amount,
        destCurr,
        baseCurr
      },
    }
    res.status(200).json({
      succes: true,
      response
    });

  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error)
  }
};

// @desc      Convert currencies
// @route     POST /api/convert
exports.convert = async (req, res, next) => {
  const { amount, baseCurr, destCurr } = req.body;
  try {  
    // check values
    if(!baseCurr || !amount || !destCurr) {
      const error = new Error("Insert valid values");
      error.status = 404;
      return next(error)
    }

    // check if value is number
    if(isNaN(amount)) {
      const error = new Error("Amount value must be a number");
      error.status = 404;
      return next(error)
    }

    // check for negative values
    if(amount < 0) {
      const error = new Error("Amount must be positive number");
      error.status = 404;
      return next(error)
    }

    // get rates from external api
    const { data } = await axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCurr}`);

    // get all rates including the base one
    const rates = {...data.rates, [data.base]: 1};

    // calculate result
    const result = convertCurrencies(rates, amount, destCurr);

    // get current statistics
    let { totalAmmountUSD, totalConversions, currenciesUsed } = await Statistics.findById(statsId);

    // increment total conversions
    totalConversions++

    // update object of currencies used
    if(currenciesUsed[destCurr]) {
      currenciesUsed[destCurr] = currenciesUsed[destCurr] + 1
    } else {
      currenciesUsed[destCurr] = 1
    }

    // find most used destination currencies in the object
    const mostPouplarCurrency = getMaxValue(currenciesUsed);

    // calculate total amount converted in USD
    if (destCurr === "USD") {
      totalAmmountUSD = (totalAmmountUSD + result).toFixed(2);
    } else {
      totalAmmountUSD = (totalAmmountUSD + convertCurrencies(rates, amount, "USD")).toFixed(2);
    }

    // make new statistics object
    const newStats = {
      currenciesUsed,
      mostPouplarCurrency,
      totalAmmountUSD,
      totalConversions,
    };

    // save new stats to DB
    let statistics = await Statistics.findByIdAndUpdate(statsId, newStats, {
      new: true,
    });
    statistics.save();

    // response object
    const response = {
      statistics: newStats,
      result: {
        result,
        amount,
        destCurr,
        baseCurr
      },
    };

    // response
    res.status(200).json({
      succes: true,
      response,
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 404;
    return next(error)
  }
};
