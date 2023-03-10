/* <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
hbspt.forms.create({
region: "na1",
portalId: "3372701",
formId: "d437e8c9-6fd9-48a9-a49e-81d2196d08c5"
});
</script> */

/* <script> */

window.onload = (event) => {
    /*$( "[href='#/ms/login']" ).on( "click", function() {
console.log("login click");
});*/

    MemberStack.onReady.then(function (member) {
        const form = document.getElementById('login-email-form');
        form.addEventListener('submit', logSignInFormSubmit);
    });

    /* on MS form submit */
    function logSignInFormSubmit(event) {
        /* pause MS form submission */
        event.preventDefault();

        /* get HS form */
        const HSform = document
            .getElementById('hs-login-form')
            .querySelector('form');

        /* copy email from MS form to HS form */
        HSform.querySelector("input[name='email']").value =
            event.target.querySelector("input[name='email']").value;

        /* submit HS form */
        HSform.submit();

        /* submit MS form */
        event.target.submit();
    }

    form.addEventListener('submit', logSignInFormSubmit);
};

// </script>
