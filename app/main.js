"use strict"; // I ♥ JS
window.App = Ember.Application.create({
//    LOG_TRANSITIONS: true,
//    LOG_ACTIVE_GENERATION: true,
//    LOG_VIEW_LOOKUPS: true
});
App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: "http://finance.bigemployee.io"
});
App.QuoteAdapter = DS.RESTAdapter.extend({
    host: "https://query.yahooapis.com",
    namespace: "v1/public",
    buildURL: function (type, id) {
        type = false;
        var url = this._super(type, id);
        return url;
    }
});
App.ChartAdapter = DS.RESTAdapter.extend({
    host: "http://finance.bigemployee.io",
    pathForType: function (type) {
        var camelized = Ember.String.camelize(type);
        return camelized;
    }
});
App.ApplicationSerializer = DS.RESTSerializer.extend({
    primaryKey: "symbol",
    normalizePayload: function (payload) {
        var symbols = payload.ResultSet.Result;
        payload = {symbols: symbols};
        return payload;
    }
});
App.QuoteSerializer = DS.RESTSerializer.extend({
    primaryKey: "symbol",
    normalizePayload: function (payload) {
        payload = {quote: [payload.query.results.quote]};
        return payload;
    }
});
App.ChartSerializer = DS.RESTSerializer.extend({
    normalizePayload: function (payload) {
        payload = {chart: payload};
        return payload;
    }
});

var attr = DS.attr,
        hasMany = DS.hasMany,
        belongsTo = DS.belongsTo;

// Navigation helper function for autocomplete symbol lookup
var currentIndex = -1; // iterator to check if we are navigating with arrow keys
var searchResultIndex = -1; // so on arrow down we start at element 0
var navigate = function (direction) {
    searchResultIndex += direction;
    var results = $(".list-group-item");
    if (searchResultIndex >= results.length)
        searchResultIndex = 0;
    if (searchResultIndex < 0)
        searchResultIndex = results.length - 1;
    results.eq(searchResultIndex).focus();
    currentIndex = searchResultIndex;
};