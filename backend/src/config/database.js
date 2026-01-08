const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // SSL configuration for Supabase
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  
  // Connection pool configuration
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // Timezone
  timezone: '+00:00',

  // options
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');
    return true;
  } catch (error) {
    console.error(' Unable to connect to the database:', error.message);
    return false;
  }
};


const syncDatabase = async (options = {}) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync(options);
      console.log('Database synchronized successfully.');
    }
  } catch (error) {
    console.error('Error synchronizing database:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};