document.addEventListener('DOMContentLoaded', function (event) {
    (function () {
        return;

        // Get the target date and time from the countdown attr
        // Convert the date string to a native JavaScript date object
        const targetDateStr =
            document.getElementById('countdown').dataset.tamCountdownDate;
        const targetDate = new Date(Date.parse(targetDateStr));

        // Get the countdown elements
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');

        // Function to add leading zeroes
        function addLeadingZero(value) {
            return value < 10 ? `0${value}` : value;
        }

        // Function to update the countdown
        function updateCountdown() {
            // Calculate the remaining time
            const now = new Date();
            const diff = targetDate - now;

            // Calculate the remaining days, hours, minutes, and seconds
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Update the countdown elements with leading zeroes
            daysElement.textContent = addLeadingZero(days);
            hoursElement.textContent = addLeadingZero(hours);
            minutesElement.textContent = addLeadingZero(minutes);
            secondsElement.textContent = addLeadingZero(seconds);
        }

        // Call the updateCountdown function initially
        updateCountdown();

        // Update the countdown every second
        setInterval(updateCountdown, 1000);
    })();
});
