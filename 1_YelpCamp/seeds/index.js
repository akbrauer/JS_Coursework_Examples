const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //TIM'S USER ID
            author: '66c8e82507bc955b485be6fd',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam eum, illum velit quod in, perspiciatis laborum soluta ullam possimus maxime nemo inventore est vel at impedit hic iste repudiandae quisquam.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dviijvxfy/image/upload/v1724524008/YelpCamp/lu2ow46ijg7mhvtzjrc7.jpg',
                    filename: 'YelpCamp/lu2ow46ijg7mhvtzjrc7'
                  },
                  {
                    url: 'https://res.cloudinary.com/dviijvxfy/image/upload/v1724524008/YelpCamp/lu2ow46ijg7mhvtzjrc7.jpg',
                    filename: 'YelpCamp/lu2ow46ijg7mhvtzjrc7'
                  }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

