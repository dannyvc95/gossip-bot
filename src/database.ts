import Database from 'better-sqlite3';
import { SecretMessage } from './types';

const db = new Database('database.db', { verbose: console.log });

export function init() {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS secret_messages (
            id TEXT PRIMARY KEY,
            author TEXT NOT NULL,
            recipient TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `).run();
}

export function insertSecretMessage(message: SecretMessage) {
    const statement = db.prepare(`
        INSERT OR REPLACE INTO secret_messages (id, author, recipient, content, timestamp)
        VALUES (?, ?, ?, ?, ?)
    `);
    statement.run(message.id, message.author, message.recipient, message.content, message.timestamp.toISOString());
}

export function readSecretMessageById(id: string): SecretMessage {
    const statement = db.prepare('SELECT * FROM secret_messages WHERE id = ?');
    return statement.get(id) as SecretMessage;
}

export function deleteSecretMessageById(id: string) {
    const statement = db.prepare('DELETE FROM secret_messages WHERE id = ?');
    return statement.run(id);
}

export function clearAllSecretMessages() {
    const statement = db.prepare('DELETE FROM secret_messages');
    const result = statement.run();
    console.log(`🧹 Cleared ${result.changes} rows from secret_messages`);
}
