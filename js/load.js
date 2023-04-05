/* loads an element from another collection template page */

/* SETUP

target element has the following attributes:
data-tam-load-element="load-target"
data-tam-load-collection="COLLECTION SLUG"
data-tam-load-item="ITEM SLUG"
data-tam-load-id="IDENTIFIER"

source element has the following attributes:
data-tam-load-element="load-source"
data-tam-load-id="IDENTIFIER"

*/

(function () {
    /* waits for jQuery to load*/
    var waitForJQuery = setInterval(function () {
        if (typeof $ != 'undefined') {
            load();
            clearInterval(waitForJQuery);
        }
    }, 10);

    function load() {
        $('[data-tam-load-element="load-target"]').each(function (i) {
            var load_target = $(this);
            var load_collection = load_target.attr('data-tam-load-collection');
            var load_item = load_target.attr('data-tam-load-item');
            var load_id = load_target.attr('data-tam-load-id');

            /* if one of these attributes is not defined, skip to next iteration */
            /* this prevents us making lots of unnecessary load() requests that return 404 */
            if (!load_item || !load_collection || !load_id) return true;

            load_target.load(
                '/' +
                    load_collection +
                    '/' +
                    load_item +
                    ' ' +
                    "[data-tam-load-element='load-source'][data-tam-load-id='" +
                    load_id +
                    "']"
            );
        });
    }
})();
