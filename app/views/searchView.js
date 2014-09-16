App.SearchView = Ember.View.extend({
    results: "",
    didInsertElement: function() {
        this.results = $("#search-results-list"); // Cache DOM element lookup
    },
    focusIn: function() {
        this.results.slideDown();
    },
    keyUp: function(e) {
        if (e.which === 40) { // Down arrow key code.
            navigate(1);
        }
        else if (e.which === 38) { // UP arrow key code.
            navigate(-1);
        }
        else if (e.which === 27 || e.which === 13) { // Escape & Enter
            this.results.slideUp();
        } else {
            this.results.slideDown(); // After Escape value change ie: Backspace
        }
    },
    focusOut: function() { // Clicked outside of the search box
        if (currentIndex === searchResultIndex) { // If not navigating
            this.results.slideUp();
        }
    }
});