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

for updated v2 of this script, target element instead has:
data-tam-load-element="load-target"
data-tam-load-path="RELATIVE URL PATH"
data-tam-load-id="IDENTIFIER"
data-tam-load-status="STATUS"

*/

(function () {
    /* waits for jQuery to load*/
    var waitForJQuery = setInterval(function () {
        if (typeof $ != 'undefined') {
            $.ajaxSetup({
                // Disable caching of AJAX responses
                cache: false,
            });

            tamarindoLoad();
            clearInterval(waitForJQuery);
        }
    }, 10);
})();

function tamarindoLoad(jquery_obj) {
    /* if fn has scope defined, look for descendent elements within this scope. */
    if (jquery_obj) {
        console.log('load function with scope');
        $('[data-tam-load-element="load-target"]', jquery_obj).each(function (
            i
        ) {
            /* do function */
            doTheLoading(this);
        });
    } else {
        console.log('load function without scope');
        /* Otherwise just search whole document by default */
        $('[data-tam-load-element="load-target"]').each(function (i) {
            /* do function */
            doTheLoading(this);
        });
    }

    /* check if descendents need loading */
    function checkForLoading(jquery_obj) {
        if ($('[data-tam-load-element="load-target"]', jquery_obj).length > 0) {
            return true;
        } else return false;
    }

    function doTheLoading(that) {
        var load_target = $(that);
        var load_target_el = load_target[0];

        /* v1 */
        var load_collection = load_target.attr('data-tam-load-collection');
        var load_item = load_target.attr('data-tam-load-item');
        var load_id = load_target.attr('data-tam-load-id');

        /* v2 - merge collection and item into more general path */
        /* plus add new status checker */
        var load_path = load_target.attr('data-tam-load-path');
        var load_id = load_target.attr('data-tam-load-id');
        var load_status = load_target.attr('data-tam-load-status');

        /* if a path attribute, we are using v2 */
        if (load_target_el.hasAttribute('data-tam-load-path')) {
            /* check for path and id values - this prevents us making lots of unnecessary load() requests that return 404 */
            if (!load_path || !load_id) return true;
            /* if load has already been carried out for this item, ignore */
            if (load_status == 'complete') return true;
            console.log('running load v2');
            load_target.load(
                load_path +
                    ' ' +
                    "[data-tam-load-element='load-source'][data-tam-load-id='" +
                    load_id +
                    "']",
                function () {
                    console.log('successful load v2');
                    /* update status */
                    load_target.attr('data-tam-load-status', 'complete');

                    /* check if there are elements within newly loaded HTML that need loading */
                    if (checkForLoading(load_target)) {
                        console.log(
                            'There are elements within newly loaded HTML that need loading'
                        );
                        tamarindoLoad(load_target);
                    }
                }
            );
        } else {
            /* otherwise we have v1 attributes defined */
            if (!load_item || !load_collection || !load_id) return true;
            console.log('running load v1');
            load_target.load(
                '/' +
                    load_collection +
                    '/' +
                    load_item +
                    ' ' +
                    "[data-tam-load-element='load-source'][data-tam-load-id='" +
                    load_id +
                    "']",
                function () {
                    console.log('successful load v1');
                }
            );
        }
    }
}
