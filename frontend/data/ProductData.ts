import service1 from '/home/product/service/1.png'
import service2 from '/home/product/service/2.png'
import service3 from '/home/product/service/3.png'
import service4 from '/home/product/service/4.png'
import service5 from '/home/product/service/5.png'

import test1 from '~/public/home/product/testimonial/1.png'
import test2 from '~/public/home/product/testimonial/2.png'
import test3 from '~/public/home/product/testimonial/3.png'

export const productService = [
    {
        id: 1,
        title: "Worldwide Delivery",
        desc: "For Order Over 100k",
        img: service1,
    },
    {
        id: 2,
        title: "Next Day Delivery",
        desc: "ID Orders Only",
        img: service2,
    },
    {
        id: 3,
        title: "Best Online Support",
        desc: "Hour : 10AM - 11PM",
        img: service3,
    },
    {
        id: 4,
        title: "Return Policy",
        desc: "Easy & Free Return",
        img: service4,
    },
    {
        id: 5,
        title: "30% Money Back",
        desc: "For Order Over 100K",
        img: service5,
    },
];

export const testimonial = [
    {
        id: 1,
        name: "Tung Sahur",
        img: test1,
        color: 'primary',
        region: "Indonesia",
        test: '“The website design is clean and easy to navigate. Everything loads smoothly, and the layout works great on both desktop and mobile”'
    },
    {
        id: 2,
        name: "Balerina",
        img: test2,
        color: 'secondary',
        region: "Indonesia",
        test: '“The admin is very helpful and responsive. My questions were answered quickly and clearly. Great service that made my experience even better!”'
    },
    {
        id: 3,
        name: "Patabim",
        img: test3,
        color: 'primary',
        region: "Indonesia",
        test: '“I love how intuitive the website feels. Everything is exactly where I expect it to be. It`s simple, elegant, and user-centered—great job on the UX!”'
    },
];