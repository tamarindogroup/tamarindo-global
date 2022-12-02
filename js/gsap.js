

// let tween = gsap.fromTo(".logos__img-wrapper", 
//     {
//         opacity: 0
//     }, 
//     {
//         opacity: 1, 
//         duration: 1, 
//         ease: "elastic",
//         stagger: {
//             amount: 2,
//             from: "random"
//           }
//     });


//     let tween = gsap.fromTo(".logos__img-wrapper", 
//     {opacity: 0}, 
//     {opacity: 1, duration: 20, ease: "elastic", stagger: {
//     amount: 2,
//     from: "random"
//   }}
//     );


let logoTween = gsap.to(".logos__img-wrapper", 
    {   
        scrollTrigger: ".logos__img-wrapper",
        opacity: 1, 
        duration: 2, 
        ease: "ease",
        stagger: {
            amount: 2,
            from: "random"
          },
        // paused: true,
    });

    