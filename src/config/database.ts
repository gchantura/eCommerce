import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_9goSDkh7eErT@ep-small-breeze-a8p26lvd.eastus2.azure.neon.tech/neondb',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool; 