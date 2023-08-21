$('document').ready(function () {
    /* get button for viewing report */
    var showReportBtn = document.querySelector('#view-report');
    /* check button exists */
    if (showReportBtn === null) {
        console.log('showReportBtn not found');
        return;
    }

    /* load data */

    function loadData() {
        /* get report id from params */
        const params = new URLSearchParams(window.location.search);
        const reportID = params.get('report');

        /* if no ID, end */
        if (!reportID) {
            console.log('No report ID found');
            document.querySelector('#loading-msg').classList.add('hidden');
            document.querySelector('#error-msg').classList.remove('hidden');
            return 'Bad report ID';
        }

        /* loop through reports on page and get report with same id */
        var reportDataEl;
        const reports = document.querySelectorAll('.report-access__item-data');
        for (var i = 0; i < reports.length; i++) {
            if (reports[i].dataset.reportId == reportID) {
                reportDataEl = reports[i];
                break;
            }
        }

        /* if no match for ID, end */
        if (!reportDataEl) {
            console.log('Bad report ID');
            document.querySelector('#loading-msg').classList.add('hidden');
            document.querySelector('#error-msg').classList.remove('hidden');
            return 'Bad report ID';
        }

        /* update content of empty report element */
        let reportEl = document.querySelector('#report');
        reportEl.querySelector('#report-img').src =
            reportDataEl.dataset.reportImgsrc;
        reportEl.querySelector('#report-bg').src =
            reportDataEl.dataset.reportBgimgsrc;
        reportEl.querySelector('#report-heading').innerHTML =
            reportDataEl.dataset.reportName;
        reportEl.querySelector('#report-date').innerHTML =
            reportDataEl.dataset.reportDate;
        reportEl.querySelector('#report-desc').innerHTML =
            reportDataEl.innerHTML;

        /* get url and name for PDF viewer and form */
        var itemData = {};
        itemData.url = reportDataEl.dataset.reportUrl;
        itemData.name = reportDataEl.dataset.reportName;
        itemData.el = reportEl;
        return itemData;
    }

    /* load HS form */
    function loadDirectAccessForm() {
        hbspt.forms.create({
            target: '#report-btn-wrapper',
            region: 'na1',
            portalId: '3372701',
            formId: '90512aae-3bf1-4e02-a8dd-b5c8004615c3',
            submitButtonClass: 'button',
            onFormReady: function ($form) {
                // After form is loaded, update hidden ticket fields
                $form
                    .find("[class~='hs_TICKET.content'] input")
                    .val(itemData.name)
                    .change();

                /* when form updated correctly, remove loading message */
                document.querySelector('#msg').classList.add('hidden');

                /* show report and form block */
                itemData.el.classList.remove('hidden');
            },
            onFormSubmitted: function ($form) {
                document.getElementById('showPDF').classList.remove('hidden');
            },
        });
    }

    var itemData = loadData();

    if (itemData != 'Bad report ID') {
        if (showReportBtn) {
            showReportBtn.addEventListener('click', function (event) {
                window.open(itemData.url, '_blank');
            });
        }
        loadDirectAccessForm();
    }
});
