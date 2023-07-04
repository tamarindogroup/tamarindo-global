/* stagger load using GSAP */

/* from https://greensock.com/forums/topic/34533-scrolltrigger-how-do-i-handle-multiple-elements-with-the-same-class/?do=findComment&comment=173043 */

gsap.registerPlugin(ScrollTrigger);

const triggerSelector = '.anim-stagger-trigger';
const targetSelector = '.anim-stagger-target';

// only run on larger screens
let mm = gsap.matchMedia();
mm.add('(min-width: 768px)', () => {
    /* get all triggers */
    let triggerArr = gsap.utils.toArray(triggerSelector);

    triggerArr.forEach((element) => {
        /* scope, so we only find descendents of trigger */
        const q = gsap.utils.selector(element);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                // markers: true,
            },
        });

        tl.from(q(targetSelector), {
            opacity: 0,
            duration: 0.5,
            ease: 'ease',
            stagger: {
                each: 0.25,
            },
        });
    });
});
