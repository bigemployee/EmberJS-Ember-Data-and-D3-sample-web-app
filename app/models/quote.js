App.Quote = DS.Model.extend({
    Symbol: attr(),
    AverageDailyVolume: attr(),
    Change: attr(),
    DaysLow: attr(),
    DaysHigh: attr(),
    YearLow: attr(),
    YearHigh: attr(),
    MarketCapitalization: attr(),
    LastTradePriceOnly: attr(),
    DaysRange: attr(),
    Name: attr(),
    Volume: attr(),
    StockExchange: attr()
});