App.ApplicationController = Ember.ArrayController.extend({
    searchTerm: null,
    searchTermChanged: function() {
        // Wait half a second before sending the query
        Ember.run.debounce(this, this.doSearch, 500);
    }.observes("searchTerm"),
    doSearch: function() {
        var searchTerm = this.get("searchTerm");
        if (searchTerm) {
            this.set("isSearching", true);
            var controller = this;
            this.store.find("Symbol", {query: searchTerm})
                    .then(function(searchResults) {
                        controller.set("content", searchResults);
                        controller.set("isSearching", false);
                    });
        }
    },
    actions: {
        search: function(){
            this.doSearch(); // Just do it
        }
    }
});