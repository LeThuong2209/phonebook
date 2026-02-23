const mongoose = require("mongoose")

if (process.argv.length < 3){
    console.log("Command line need more argument");
    process.exit();
}

const password = encodeURIComponent(process.argv[2]);
const name = process.argv[3];
const number = process.argv[4]
const id = process.argv[5]

const url = `mongodb+srv://fullstackcourse:${password}@cluster0.zt06tr1.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, {family: 4});

const informationSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
});

const informationModel = mongoose.model("information", informationSchema)

const informationSaved = informationModel({
    id: id,
    name: name,
    number: number,
})

informationSaved.save().then(result => {
    console.log(`Successfully adding ${name} ${number} to database`);
    mongoose.connection.close()
});