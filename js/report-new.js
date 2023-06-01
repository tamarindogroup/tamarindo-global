/*

if logged in and access is open (common)
    load member button form
        on submission of form, load report

if logged in and access is open-form
    if custom form is set load it 
    else load member form
        on submission of form, load report

if logged in and access is closed (rare)
    if custom form is set load it
    else load no form [1]
        no action on submission

if logged out and access is open (rare)
    load report

if logged out and access is open-form (common)
    if custom form is set load it 
    else load request form
        on submission of form, load report

if logged out and access is closed (common)
    if custom form is set load it 
    else load no form [1]
         no action on submission


[1] perhaps rich text field for panel could handle:
    - fallback text for no form
    - custom embed form if something else needed


*/

$('document').ready(function () {
    /* something */
});

/* --- initial stuff --- */

/* create tamarindo obj */
let tamarindo = tamarindo ?? {};

/* check if we are on staging or live */
if (!window.location.hostname.match(/webflow\.io/)) {
    tamarindo.ENV = {
        domain: 'live',
    };
} else {
    tamarindo.ENV = {
        domain: 'staging',
    };
}

/* --- get stuff from page --- */

/* get page elements, if any do not exist then exit */
tamarindo.report = {};
tamarindo.report.elements = {};
function getElement(query, varName) {
    var myElement = document.querySelector('query');
    if (!myElement) {
        console.log(varName + ' cannot be found');
        return false;
    }
    tamarindo.report.elements[varName] = myElement;
    return tamarindo.report.elements[varName];
}
if (!getElement('#view-report', 'showReportBtn')) return;
if (!getElement('#embed-report', 'embedPdf')) return;
if (!getElement('#item-data', 'itemData')) return;

/* get item data */
(function getItemData(itemDataEl = tamarindo.report.elements.itemData) {
    tamarindo.report.url = itemDataEl.dataset.itemUrl;
    tamarindo.report.name = itemDataEl.dataset.itemName;
    tamarindo.report.flippingBookId = itemDataEl.dataset.itemFlippingbookId;
    tamarindo.report.memberAccess = itemDataEl.dataset.itemMemberAccess;
    tamarindo.report.nonmemberAccess = itemDataEl.dataset.itemNonmemberAccess;
    tamarindo.report.useNewLayout =
        itemDataEl.dataset.itemUseNewLayout; /* TODO remove? */
    tamarindo.report.memberFormID = itemDataEl.dataset.itemHsFormIdMember;
    tamarindo.report.nonmemberFormID = itemDataEl.dataset.itemHsFormIdNonmember;
})();

/* --- make decisions based on data and member status --- */
MemberStack.onReady.then(function (member) {
    if (member.loggedIn) {
        loadForm_member();
    } else {
        loadForm_nonmember();
    }
});

/* --- functions --- */

function loadForm_member() {
    /* if access is open */
    if (tamarindo.report.memberAccess == 'open') {
        var formReadyFn = function () {
            $form.find('input[name="email"]').val(member['email']).change();
        };
    }
}

/* add PDF to page */
function loadPDF_flippingbook() {}

/* create form */
function createForm(
    reportName,
    formName,
    targetSelector = '#report-form-embed' /* default location for form */,
    formId,
    formReadyFn = function ($form) {
        /* by default, pass report name and action to form */
        updateForm_reportName(reportName);
        updateForm_formName(formName);
    },
    formSubmitFn = function ($form) {},
    formSubmittedFn = function ($form) {
        /* by default, show report */
        showReportButton();
    }
) {
    /* break if no form specified */
    if (!formId) return;

    /* create the form */
    hbspt.forms.create({
        target: targetSelector,
        region: 'na1',
        portalId: '3372701',
        formId: formId,
        submitButtonClass: 'button button--accent',
        onFormReady: formReadyFn,
        onFormSubmit: formSubmitFn,
        onFormSubmitted: formSubmittedFn,
    });

    /* default fn to add report name to form */
    function updateForm_reportName(reportName) {
        $form.find('[name="TICKET.content"]').val(reportName).change();
    }

    /* default fn to add form name to form */
    function updateForm_formName(formName) {
        $form.find('[name="TICKET.subject"]').val(formName).change();
    }

    /* default fn to enable report */
    function showReportButton() {
        showReportBtn.classList.remove('hidden');
    }
}
