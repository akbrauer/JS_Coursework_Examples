const mongoose = require('mongoose');
const Product = require("./models/product");

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/farmStandTake2");
	console.log("MONGO CONNECTION OPEN");
}
main().catch(err => {
	console.log("OH NO MONGO CONNECTION ERROR!!!!");
	console.log(err);
});


const seedProducts = [
    {
        name: "Fairy Eggplant",
        price: 1.00,
        category: "vegetable",
    },
    {
        name: "Organic Godess Melon",
        price: 4.99,
        category: "fruit",
    },
    {
        name: "Organic Mini Seedless Watermelon",
        price: 3.99,
        category: "fruit",
    },
    {
        name: "Organic Celery",
        price: 1.59,
        category: "vegetable",
    },
    {
        name: "Chocolate Whole Milk",
        price: 2.69,
        category: "dairy",
    }
]

Product.insertMany(seedProducts)
	.then(p => {
		console.log(p);
	})
	.catch(e => {
		console.log(e);
	});
