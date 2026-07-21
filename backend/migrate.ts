import pool from './src/config/database';

const migrate = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) 
          REFERENCES users(id) 
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;
    await pool.query(query);
    console.log('Migration successful: password_reset_tokens created');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
