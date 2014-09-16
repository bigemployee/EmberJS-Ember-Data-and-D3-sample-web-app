App.Router.map(function() {
    this.resource("chart", function() {
        this.resource("quote", {path: "/:ticker"}, function() {
            this.resource("period", {path: "/:period"});
        });
    });
    this.route("404");
});