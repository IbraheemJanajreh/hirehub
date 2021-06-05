const mongoose = require('mongoose');
const cities = require('./cities');
const Offer = require('../models/Offer');
const User = require('../models/User');
mongoose.connect('mongodb://localhost:27017/hirehub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
    await Offer.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random6 = Math.floor(Math.random() * 6);
        const random = Math.floor(Math.random() * 10) + 1;
        const offer = new Offer({
            author: '60a1daac3f81d943b0eddce2',
            location: `${cities[random6].city}`,
            title: 'There are many variations',
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto cupiditate quae, fugit saepe at fugiat, laudantium blanditiis voluptatum tempore odio praesentium maxime optio, nam cumque repellat doloribus aperiam possimus tempora.Nobis sit ut iusto, commodi dolore ratione quod odio suscipit, rerum, consectetur illo cumque doloremque. Nisi, perspiciatis consequatur inventore soluta id earum similique deserunt maiores in. Et modi in dolorum.Voluptates sapiente adipisci inventore in officia dolore est nulla incidunt at maiores rerum reiciendis animi, a nobis nemo quaerat accusamus molestiae dignissimos possimus. Illo odio porro laudantium quis eos delectus.Cum, et provident doloremque velit voluptate unde rem consequatur quis quos mollitia corrupti illo expedita quas animi molestiae reprehenderit excepturi odio. Accusantium vel possimus, veniam sequi quia enim modi veritatis.Porro, placeat unde et iusto repellat vero in deserunt inventore illum vitae eos saepe dicta consectetur velit, hic illo rem amet labore nesciunt! Incidunt suscipit iste animi molestiae, totam fuga!",
        })
        await offer.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})