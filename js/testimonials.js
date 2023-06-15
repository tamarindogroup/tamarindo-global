document.addEventListener('DOMContentLoaded', function (event) {
    (function () {
        $('.testimonial-wrapper').each(function (index) {
            var testimonialToLoad =
                '/testimonials/' + testimonials[index] + ' ' + '#testimonial';
            $(this).load(testimonialToLoad, function () {
                alert('Load was performed.');
            });
        });
    })();
});
