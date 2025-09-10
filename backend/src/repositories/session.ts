import { eq } from "drizzle-orm";
import { db, G_FOR_DH, P_FOR_DH } from "../configurations";
import { sessions } from "../schemas";

export class SessionRepo {
  static addSession = async (
    serverPrivateKey: string,
    serverPublicKey: string
  ) =>
    await db
      .insert(sessions)
      .values({
        generatorUsed: G_FOR_DH,
        primeUsed: P_FOR_DH,
        serverPrivateKey,
        serverPublicKey,
      })
      .returning();

  static getBySessionId = async (sessionId: string) =>
    await db.select().from(sessions).where(eq(sessions.sessionId, sessionId));

  static updateSession = async (
    sessionId: string,
    clientPublicKey: string | null = null,
    encryptionKey: string | null = null,
    ivBase64: string | null = null,
    encryptedDataBase64: string | null = null
  ) => {
    // Build an object with only non-null fields
    const fieldsToUpdate: Partial<{
      clientPublicKey: string;
      encryptionKey: string;
      ivBase64: string;
      encryptedDataBase64: string;
    }> = {};

    if (clientPublicKey !== null)
      fieldsToUpdate.clientPublicKey = clientPublicKey;
    if (encryptionKey !== null) fieldsToUpdate.encryptionKey = encryptionKey;
    if (ivBase64 !== null) fieldsToUpdate.ivBase64 = ivBase64;
    if (encryptedDataBase64 !== null)
      fieldsToUpdate.encryptedDataBase64 = encryptedDataBase64;

    return await db
      .update(sessions)
      .set(fieldsToUpdate)
      .where(eq(sessions.sessionId, sessionId))
      .returning();
  };
}
