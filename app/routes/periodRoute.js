App.PeriodRoute = Ember.Route.extend({
    model: function(params) {
        var ticker = this.modelFor("quote").get("id");
        var period = params.period;
        var results = this.store.find("Chart", {s: ticker, t: period}).then(function(data){
            return data;
        });
        return results;
    },
    afterModel: function(periodData, transition) {
      if (!periodData.get("length")) {
        this.transitionTo("404");
      }
    },
    setupController: function(controller, model) {
        this.controllerFor("quote").set("chartContent", model);
    },
    renderTemplate: function() {
        this.render("quote", {controller: "quote"});
    }
});