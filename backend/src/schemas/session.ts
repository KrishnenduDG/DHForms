import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").defaultRandom().notNull(),
  generatorUsed: varchar("generator_used"),
  primeUsed: varchar("prime_used"),
  serverPrivateKey: varchar("server_private_key"), // Basically the "b"
  serverPublicKey: varchar("server_public_key"), // Basically the "(g^b) % p"
  clientPublicKey: varchar("client_public_key"), // Basically the "(g^a) % p"
  encryptionKey: varchar("encryption_key"),
  ivBase64: varchar("iv_base_64"), // IV for the encryption
  encryptedDataBase64: varchar("encrypted_data_base_64"), // Encrypted Data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
