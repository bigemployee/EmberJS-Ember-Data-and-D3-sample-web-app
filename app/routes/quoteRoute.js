App.QuoteRoute = Ember.Route.extend({
    model: function(params) {
        var query = "yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22"
                + params.ticker +
                "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
        var results = this.store.find("Quote", query);
        return results;
    },
    setupController: function(controller, model) {
        controller.set("content", model);
    }
});