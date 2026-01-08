require("dotenv").config();
const app = require("./app");
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  const isConnected = await testConnection();
  
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Failed to connect to database. Server not started.');
    process.exit(1);
  }
};

startServer();