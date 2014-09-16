App.GraphView = Ember.View.extend({
    didInsertElement: function() {
        // D3 Chart
        var controller = this.get("controller");
        var elementId = this.get("elementId");
        Ember.run.scheduleOnce("afterRender",
                controller.send("render", elementId));
        controller.set("isLoading", false);
    }
});