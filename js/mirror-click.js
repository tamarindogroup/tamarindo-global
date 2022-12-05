/* when a trigger element is clicked, click a matching target element */

/* get trigger (s) */
var triggerEls = document.querySelectorAll("[data-tam-mirror-trigger]");

for (var i = 0; i < triggerEls.length; i++) {

    /* when trigger clicked */
    triggerEls[i].addEventListener('click', function(event) {

        console.log(this)

        /* get value to match on */
        var matchStr = this.getAttribute("data-tam-mirror-trigger");

        /* get targets */
        var targetEls = document.querySelectorAll("[data-tam-mirror-target='" + matchStr + "']");

        /* click target(s) */
        for (var j = 0; j < targetEls.length; j++) {
            console.log(targetEls[j])
            targetEls[j].click()

        };
    });
}
