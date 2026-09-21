import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { telegramSubscribers } from "../../db/schema.js";

export async function subscribeTelegramUser(
  chatId: number | string,
  username?: string,
) {
  const normalizedChatId = String(chatId);

  const existingSubscriber = await db
    .select()
    .from(telegramSubscribers)
    .where(
      eq(
        telegramSubscribers.chatId,
        normalizedChatId,
      ),
    )
    .limit(1);

  if (existingSubscriber.length > 0) {
    const updated = await db
      .update(telegramSubscribers)
      .set({
        telegramUsername: username ?? null,
        isSubscribed: true,
        updatedAt: new Date(),
      })
      .where(
        eq(
          telegramSubscribers.chatId,
          normalizedChatId,
        ),
      )
      .returning();

    return updated[0];
  }

  const created = await db
    .insert(telegramSubscribers)
    .values({
      chatId: normalizedChatId,
      telegramUsername: username ?? null,
      isSubscribed: true,
    })
    .returning();

  return created[0];
}

export async function unsubscribeTelegramUser(
  chatId: number | string,
) {
  const normalizedChatId = String(chatId);

  const updated = await db
    .update(telegramSubscribers)
    .set({
      isSubscribed: false,
      updatedAt: new Date(),
    })
    .where(
      eq(
        telegramSubscribers.chatId,
        normalizedChatId,
      ),
    )
    .returning();

  return updated[0] ?? null;
}

export async function getSubscribedTelegramUsers() {
  return db
    .select()
    .from(telegramSubscribers)
    .where(
      eq(
        telegramSubscribers.isSubscribed,
        true,
      ),
    );
}