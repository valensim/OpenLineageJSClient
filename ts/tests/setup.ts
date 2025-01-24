import { config } from 'dotenv'

// Set up any global test configuration
try {
  config()
} catch (error) {
  console.log('No .env file found, using default configuration')
}