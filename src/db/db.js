import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () => {
    try {
        mongoose.connect(process.env.URI_MONGODB);
        console.log("Se ha establecido la conexion con MongoDB!");
    } catch (error) {
        console.log(
            "Se produjo un error al establecer la conexion con MongoDB: ",
            error.message
        );
    }
};

export default connectMongoDB;