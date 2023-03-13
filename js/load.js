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
    $('[data-tam-load-element="load-target"]').each(function (i) {
        var load_target = $(this);
        var load_collection = load_target.attr('data-tam-load-collection');
        var load_item = load_target.attr('data-tam-load-item');
        var load_id = load_target.attr('data-tam-load-id');
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
})();
