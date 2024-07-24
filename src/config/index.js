import { connect } from "mongoose"

//coneccion mongo    localhost=127.0.0.1
//mongoose.connect('mongodb://127.0.0.1:27017/backcoder')
//mongoose.connect('mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority')
//console.log('base de datos conectada')

const connectDB = () => {
    connect('mongodb://nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log('base de datos conectada')
}

export default connectDB