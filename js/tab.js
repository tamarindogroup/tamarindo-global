/* Accessible WF tab component, based on Heydon Pickering's https://inclusive-components.design/tabbed-interfaces/ */

document.addEventListener('DOMContentLoaded', function (event) {
    /* check if we are on staging or live */
    if (!window.location.hostname.match(/webflow\.io/)) {
        var TG_ENV = {
            domain: 'live',
        };
    } else {
        var TG_ENV = {
            domain: 'staging',
        };
        //return;
    }

    // Check if this is a tabbed or flagship event - this var is set on page in WF - if not then we don't load tabs
    if (eventStyle == 'default') {
        return;
    }

    (function () {
        // Get relevant elements and collections
        const tabbed = document.querySelector('.tabbed');
        const tablist = tabbed.querySelector('ul');
        const tabs = tablist.querySelectorAll(
            'li:not(.w-condition-invisible) a'
        ); /* exclude any hidden tabs */
        const panels = tabbed.querySelectorAll(
            '.tab-panel:not(.w-condition-invisible)'
        ); /* exclude any hidden panels */

        // The tab switching function
        const switchTab = (oldTab, newTab, updateHash) => {
            newTab.focus();
            // Make the active tab focusable by the user (Tab key)
            newTab.removeAttribute('tabindex');
            // Set the selected state
            newTab.setAttribute('aria-selected', 'true');
            oldTab.removeAttribute('aria-selected');
            oldTab.setAttribute('tabindex', '-1');
            // Get the indices of the new and old tabs to find the correct
            // tab panels to show and hide
            let index = Array.prototype.indexOf.call(tabs, newTab);
            let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
            panels[oldIndex].hidden = true;
            panels[index].hidden = false;

            // // WF modification - animate out old tab content and hide when animation ended
            // panels[oldIndex].setAttribute('data-tam-tabactive', 'false')
            // panels[oldIndex].addEventListener('animationend', () => {
            //     if (
            //         panels[oldIndex].getAttribute('data-tam-tabactive') ==
            //         'false'
            //     ) {
            //         panels[oldIndex].hidden = true

            //         // animate in new tab content
            //         panels[index].setAttribute('data-tam-tabactive', 'true')
            //         panels[index].hidden = false
            //     }
            // })

            // WF modification - Scroll by 1px to trigger webflow's "w--current" class
            window.scrollBy(0, 1);

            //WF modification - scroll to top of new panel
            panels[index].scrollIntoView();

            // WF modification - update page hash if it's the user changing the tab
            if (updateHash) {
                history.pushState({}, '', newTab.href);
            }

            // console.log('The tab has been changed to tab ' + newTab.id);
        };

        // Add the tablist role to the first <ul> in the .tabbed container
        tablist.setAttribute('role', 'tablist');

        // Add semantics are remove user focusability for each tab
        Array.prototype.forEach.call(tabs, (tab, i) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('id', 'tab' + (i + 1));
            tab.setAttribute('tabindex', '-1');
            tab.parentNode.setAttribute('role', 'presentation');

            // Handle clicking of tabs for mouse users
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                let currentTab = tablist.querySelector('[aria-selected]');
                if (e.currentTarget !== currentTab) {
                    switchTab(currentTab, e.currentTarget, true);
                }
            });

            // Handle keydown events for keyboard users
            tab.addEventListener('keydown', (e) => {
                // Get the index of the current tab in the tabs node list
                let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
                // Work out which key the user is pressing and
                // Calculate the new tab's index where appropriate
                let dir =
                    e.which === 37
                        ? index - 1
                        : e.which === 39
                        ? index + 1
                        : e.which === 40
                        ? 'down'
                        : null;
                if (dir !== null) {
                    e.preventDefault();
                    // If the down key is pressed, move focus to the open panel,
                    // otherwise switch to the adjacent tab
                    dir === 'down'
                        ? panels[i].focus()
                        : tabs[dir]
                        ? switchTab(e.currentTarget, tabs[dir], true)
                        : void 0;
                }
            });
        });

        // Add tab panel semantics and hide them all
        Array.prototype.forEach.call(panels, (panel, i) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '-1');
            let id = panel.getAttribute('id');
            panel.setAttribute('aria-labelledby', tabs[i].id);
            panel.hidden = true;
            // panel.setAttribute('data-tam-tabactive', 'false')
        });

        // Initially activate the first tab and reveal the first tab panel
        tabs[0].removeAttribute('tabindex');
        tabs[0].setAttribute('aria-selected', 'true');
        panels[0].hidden = false;
        // panels[1].setAttribute('data-tam-tabactive', 'true') //WF modification - custom attr on active v inactive panels

        // WF MODIFICATION - support direct linking to a tab from the hash

        // Get new tab

        function getHashFromURL() {
            return window.location.hash.substr(1);
        }

        function getHashFromLink(linkEl) {
            return linkEl.hash.substr(1);
        }

        function getTabFromHashStr(str) {
            /* get the tab that points to this hash, and that ISNT hidden by WF */
            return tablist.querySelector(
                'li:not(.w-condition-invisible) [href="#' + str + '"]'
            );
        }

        function getCurrentTab() {
            return tablist.querySelector(
                'li:not(.w-condition-invisible) [aria-selected]'
            );
        }

        function getHash(updateHash) {
            // Get hash from URL
            var targetHash = getHashFromURL();
            // Find tab that targets this hash
            var targetTab = getTabFromHashStr(targetHash);
            // console.log(targetTab);
            // If tab exists and is not current tab, then switch to it
            var currentTab = getCurrentTab();

            if (targetTab && targetTab !== currentTab) {
                switchTab(currentTab, targetTab, updateHash);
            }
        }

        // Change tab on hashchange
        window.addEventListener(
            'hashchange',
            () => {
                // console.log('The hash changed');
                getHash(false);
                /* if the hash changes we don't then need to update it. If we updated it here, we'd prevent the user from using Forward browser button */
            },
            false
        );

        // Check for hash on page load
        if (window.location.hash) {
            // console.log('Page has loaded with a hash');
            getHash(false); /* we don't need to update hash on page load */
        }

        // WF seems to block hashchange event for regular on-page changes (it allows hashchanges at page load and use of forward/back buttons), so we need to manually trigger tab changes for buttons that aren't tabs, but go to tabs
        var linkEls = document.querySelectorAll(
            '[href*="#"]:not([role="tab"])'
        );
        console.log(linkEls);
        linkEls.forEach((el) => {
            el.addEventListener('click', (e) => {
                // console.log('non-tab hash click on ' + el);
                var linkHash = getHashFromLink(e.currentTarget);
                var targetTab = getTabFromHashStr(linkHash);
                var currentTab = getCurrentTab();
                if (targetTab && targetTab !== currentTab) {
                    switchTab(currentTab, targetTab, true);
                }
            });
        });
    })();
});
