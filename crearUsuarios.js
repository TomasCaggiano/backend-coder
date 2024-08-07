const mongoose = require('mongoose');
const { userModel } = require('./src/Dao/mongo/models/user.model'); // Asegúrate de que la ruta al archivo de tu modelo sea correcta

// Conexión a MongoDB
const url = 'mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Crear usuarios
const createUsers = async () => {
  try {
    // Crear usuario admin
    const admin = new userModel({
      first_name: 'Tomas',
      last_name: 'Caggiano',
      email: 'tomascaggiano@gmail.com',
      password: 'contrasenia',
      role: 'admin'
    });

    // Crear usuario user
    const user = new userModel({
      first_name: 'Usuario',
      last_name: 'Normal',
      email: 'user@example.com',
      password: 'contrasenia',
      role: 'user'
    });

    // Crear usuario premium
    const premiumUser = new userModel({
      first_name: 'Usuario',
      last_name: 'Premium',
      email: 'premium@example.com',
      password: 'contrasenia',
      role: 'premium'
    });

    // Guardar usuarios en la base de datos
    await admin.save();
    await user.save();
    await premiumUser.save();

    console.log('Usuarios creados exitosamente');
  } catch (error) {
    console.error('Error al crear usuarios:', error);
  } finally {
    // Cerrar la conexión a MongoDB
    mongoose.connection.close();
  }
};

// Llamar a la función para crear los usuarios
createUsers();