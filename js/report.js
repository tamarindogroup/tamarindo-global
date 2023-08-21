/* Load item details, forms and enable chosen PDF viewer */
/* updated 2023-08-21 to replace FlippingBook with browser default PDF viewer. */

/* further improvements that could be made:
- remove FB stuff
- remove adobe pdf stuff
- add in check for logged in, so we only need to load one form instead of two
- abstract submit button class
- hidden HS form on submission for member btn form - we don't actually need to see the submission message.
- Also we don't really need the member btn form at all - we end up with a weird shift because of the swapping of one button for another. And we don't need the legal blurb...
- re-look at triggering the FB viewer more effectively with the form submission
*/

$('document').ready(function () {
    /* submit button class for HS forms */
    var buttonClassStr = 'button button--accent';

    /* check if we are on staging or live */
    if (!window.location.hostname.match(/webflow\.io/)) {
        var TG_ENV = {
            domain: 'live',
        };
    } else {
        var TG_ENV = {
            domain: 'staging',
        };
    }

    /* get button for viewing report */
    var showReportBtn = document.querySelector('#view-report');
    /* check button exists */
    if (showReportBtn === null) {
        console.log('showReportBtn not found');
        return;
    }

    /* PDF embed element */
    var embedEl = document.getElementById('embed-report');
    /* check element exists */
    if (embedEl === null) {
        console.log('embedEl not found');
        return;
    }

    /* get item data element*/
    var itemDataEl = document.querySelector('#item-data');
    var itemData = {};
    /* check data element exists */
    if (itemDataEl === null) {
        console.log('itemDataEl not found');
        return;
    }

    /* get item data */
    (function getItemData() {
        itemData.url = itemDataEl.dataset.itemUrl;
        itemData.name = itemDataEl.dataset.itemName;
        itemData.flippingBookId = itemDataEl.dataset.itemFlippingbookId; //FB is no longer used, so this returns undefined
        itemData.flippingBookId = undefined; // manually override FB id so we can force default display method without removing old FB ids
        itemData.memberAccess = itemDataEl.dataset.itemMemberAccess;
        itemData.nonmemberAccess = itemDataEl.dataset.itemNonmemberAccess;
        // itemData.useNewLayout = itemDataEl.dataset.itemUseNewLayout;
        itemData.memberFormID = itemDataEl.dataset.itemHsFormIdMember;
        itemData.memberFormID = '';
        itemData.nonmemberFormID = itemDataEl.dataset.itemHsFormIdNonmember;
        itemData.nonmemberFormID = '';

        /* choose pdf display method */
        (function getDisplayMethod() {
            // if fb id is not set at all, use default pdf display
            if (itemData.flippingBookId === undefined) {
                itemData.displayMethod = 'default';
                return;
            }
            // if fb id is set and is a non-empty string, try to use FB
            else if (itemData.flippingBookId.length > 0) {
                itemData.displayMethod = 'flippingbook';
            }

            // otherwise use default
            else {
                /* otherwise use default PDF browser display */
                itemData.displayMethod = 'default';
            }
        })();
    })();

    /* load third party scripts */
    /* FB script has been moved to FB PDF function as for some reason not working correctly when separated from rest of FB code */
    (function loadPDFScripts() {
        /* Load Adobe PDF API if required */
        if (itemData.displayMethod == 'adobe') {
            var adobeScript = document.createElement('script');
            adobeScript.async = true;
            adobeScript.onload = function () {
                console.log('Adobe script loaded');
            };
            adobeScript.src =
                'https://documentcloud.adobe.com/view-sdk/main.js';
            document.head.appendChild(adobeScript);
        }
    })();

    /* load forms depending on access settings */
    /* currently this loads both a member and non-member form, it may be possible to load only one depending on user login status */
    (function loadForms() {
        /* for members */
        if (itemData.memberAccess == 'Click to view PDF') {
            loadMemberBtnForm();
        } else if (itemData.memberAccess == 'Submit form to access') {
            loadMemberAccessForm();
        } else {
        }

        /* for non-members */
        if (itemData.nonmemberAccess == 'Submit form to access') {
            loadNonMemberAccessForm();
        } else if (
            itemData.nonmemberAccess == 'Submit form to request access'
        ) {
            loadNonMemberRequestForm();
        } else if (itemData.nonmemberAccess == 'No access') {
        } else {
        }
    })();

    /* load PDF */
    function loadPDF() {
        if (itemData.displayMethod == 'adobe') {
            loadAdobe();
        } else if (itemData.displayMethod == 'flippingbook') {
            loadFlippingBook(embedEl);
        } else {
            window.open(itemData.url, '_blank');
        }
    }

    /* click show report button */
    function clickButton() {
        console.log('click');
        showReportBtn.click();
    }

    /* load PDF embed with FB  */
    function loadFlippingBook(embedEl) {
        /* add flippingbook link */
        var fbEmbedStr =
            '<a href="https://online.flippingbook.com/view/' +
            itemData.flippingBookId +
            '/" class="fbo-embed" data-fbo-id="' +
            itemData.flippingBookId +
            '" data-fbo-lightbox="yes" data-fbo-width="250px" data-fbo-height="188px" data-fbo-version="1" style="max-width: 100%">Test report</a>';
        embedEl.innerHTML = fbEmbedStr;

        if (itemData.displayMethod == 'flippingbook') {
            var flippingbookScript = document.createElement('script');
            flippingbookScript.async = true;
            flippingbookScript.defer = true;
            flippingbookScript.onload = function () {
                console.log('FlippingBook script loaded');
            };
            flippingbookScript.src =
                'https://online.flippingbook.com/EmbedScriptUrl.aspx?m=redir&hid=' +
                itemData.flippingBookId;
            embedEl.appendChild(
                flippingbookScript
            ); /* fb script must be loaded in the embed element to work properly */
        }

        embedEl.hidden =
            'true'; /* for some reason, if the embed element is hidden before the script is run, FB does not load */

        /* add click event to showReportBtn to trigger fb modal */
        if (showReportBtn) {
            showReportBtn.addEventListener(
                'click',
                function (event) {
                    /* we look for the fbTarget only once the click event has happened, so we can be sure the target exists */
                    var fbTargetSelector = "div[data-fbo-lightbox='yes'] > a";
                    event.preventDefault(); /* override existing href */

                    if (fboEmbed) {
                        try {
                            document.querySelector(fbTargetSelector).click();
                        } catch (err) {
                            /* click fb button */
                        }
                    }
                },
                false
            );
            showReportBtn.disabled = false;
        }
    }
    /* end loadFlippingBook() */

    /* load PDF embed with Adobe */
    function loadAdobe() {
        /* when Adobe is ready enable PDF button */
        if (window.AdobeDC) {
            enablePDFLightbox();
        } else {
            document.addEventListener('adobe_dc_view_sdk.ready', () =>
                enablePDFLightbox()
            );
        }

        /* enable the btn and add a click event to show lightbox */
        function enablePDFLightbox() {
            if (showReportBtn) {
                showReportBtn.addEventListener(
                    'click',
                    function (event) {
                        displayPDFLightbox();
                        event.preventDefault(); /* override existing href */
                    },
                    false
                );
                showReportBtn.disabled = false;
            }
        }

        /* show the PDF modal */
        function displayPDFLightbox() {
            /* if on staging domain we use different Adobe API credentials */
            var clientIdLive = 'bf8b2441691a4b3a9c58b2b48e852d88';
            var clientIdStaging = 'ec59dc6b86d3487d84c75241a46cd956';
            if (TG_ENV.domain == 'staging') {
                var clientId = clientIdStaging;
            } else {
                var clientId = clientIdLive;
            }

            /* create PDF view using name and url */
            var adobeDCView = new AdobeDC.View({ clientId: clientId });
            adobeDCView.previewFile(
                {
                    content: {
                        location: {
                            url: itemData.url,
                        },
                    },
                    metaData: {
                        fileName: itemData.name,
                    },
                },
                {
                    embedMode: 'LIGHT_BOX',
                    defaultViewMode: 'FIT_PAGE',
                    dockPageControls: true,
                    showDownloadPDF: false,
                    showPrintPDF: false,
                }
            );
        }
    }
    /* end loadAdobe() */

    /* one-click form for logged in members */
    function loadMemberBtnForm() {
        /* hide form while rearranging consent text */
        var targetSelector = '#report-member-access-button-wrapper';
        if (document.querySelector(targetSelector)) {
            document.querySelector(targetSelector).style.display = 'none';
        }

        /* wait for MS so we can get user data */
        MemberStack.onReady.then(function (member) {
            /* create form */
            hbspt.forms.create({
                target: targetSelector /* element to create inside */,
                region: 'na1',
                portalId: '3372701',
                formId: '39d6ad68-5001-4781-874d-10d275050754' /* default form ID */,
                submitButtonClass: 'button' /* add class to submit button */,
                onFormReady: function ($form) {
                    /* After form is loaded, update hidden ticket fields so we can track on HS */
                    $form
                        .find('input[name="TICKET.subject"]')
                        .val('Report Member Access')
                        .change(); /* form submission type */
                    $form
                        .find('input[name="TICKET.content"]')
                        .val(itemData.name)
                        .change(); /* report name */
                    $form
                        .find('input[name="email"]')
                        .val(member['email'])
                        .change(); /* load email from MS */

                    /* rearrange to put consent info after submit */
                    try {
                        var $consent = $form.find('.legal-consent-container');
                        var $submit = $form.find('.hs_submit');
                        $submit.insertBefore($consent);
                        $consent.css('margin-top', '1.5rem');
                        document.querySelector(targetSelector).style.display =
                            'block';
                    } catch (err) {}
                },
                onFormSubmit: function ($form) {},
                onFormSubmitted: function ($form) {
                    loadPDF();
                    showReportBtn.classList.remove('hidden');
                    // setTimeout(function() {clickButton()}, 500); /* unsure if timeout is required */
                },
            });
        });
    }

    /* normal access form for logged in mem */
    function loadMemberAccessForm() {
        hbspt.forms.create({
            target: '#report-member-form-wrapper',
            region: 'na1',
            portalId: '3372701',
            formId: (function () {
                /* if user has set HS form ID, use that, else use default form */
                var hsFormID = itemData.memberFormID;
                if (hsFormID.length > 0) {
                    return hsFormID;
                } else {
                    return '1cfe2718-7115-481d-8a24-9167f0fcad56';
                }
            })(),
            submitButtonClass: 'button',
            onFormReady: function ($form) {
                $form
                    .find('[name="TICKET.subject"]')
                    .val('Report Member Access')
                    .change();
                $form
                    .find('[name="TICKET.content"]')
                    .val(itemData.name)
                    .change();
            },
            onFormSubmit: function ($form) {},
            onFormSubmitted: function ($form) {
                loadPDF();
                showReportBtn.classList.remove('hidden');
                // setTimeout(function() {clickButton()}, 500); /* unsure if timeout is required */
            },
        });
    }

    /* request form for non mem */
    function loadNonMemberRequestForm() {
        hbspt.forms.create({
            target: '#report-non-member-request-wrapper',
            region: 'na1',
            portalId: '3372701',
            formId: (function () {
                var hsFormID = itemData.nonmemberFormID;
                if (hsFormID.length > 0) {
                    return hsFormID;
                } else {
                    return '648469bd-a4bc-4716-8d60-b282a9dd164e';
                }
            })(),
            submitButtonClass: 'button',
            onFormReady: function ($form) {
                $form
                    .find('[name="TICKET.subject"]')
                    .val('Report Request')
                    .change();
                $form
                    .find('[name="TICKET.content"]')
                    .val(itemData.name)
                    .change();

                /* fix for MS login link in form  */
                $form.find('[href="#/ms/login"]').click(function () {
                    document
                        .querySelector('.w-nav-menu [href="#/ms/login"]')
                        .click();
                });
            },
            onFormSubmit: function ($form) {},
            onFormSubmitted: function ($form) {},
        });
    }

    /* access form for non mem */
    function loadNonMemberAccessForm() {
        hbspt.forms.create({
            target: '#report-non-member-form-wrapper',
            region: 'na1',
            portalId: '3372701',
            formId: (function () {
                var hsFormID = itemData.nonmemberFormID;
                if (hsFormID.length > 0) {
                    return hsFormID;
                } else {
                    return '2c6fd965-24fb-4990-ba84-90e9fe97047d';
                }
            })(),
            submitButtonClass: 'button',
            onFormReady: function ($form) {
                $form
                    .find('[name="TICKET.subject"]')
                    .val('Report Non-Member Access')
                    .change();
                $form
                    .find('[name="TICKET.content"]')
                    .val(itemData.name)
                    .change();
            },
            onFormSubmit: function ($form) {},
            onFormSubmitted: function ($form) {
                loadPDF();
                showReportBtn.classList.remove('hidden');
            },
        });
    }
});
