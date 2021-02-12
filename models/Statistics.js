const mongoose = require('mongoose');

const StatisticsSchema = new mongoose.Schema({
  currenciesUsed: Object,
  mostPouplarCurrency: Array,
  totalAmmountUSD: Number,
  totalConversions: Number,
});

module.exports = mongoose.model('statistics', StatisticsSchema)