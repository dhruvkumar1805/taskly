"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function subscribeToPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const userId = await requireUserId();

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
    },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userId,
    },
  });
}

export async function unsubscribeFromPush(endpoint: string) {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
}

export async function getPushSubscriptionEndpoints() {
  const userId = await requireUserId();
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    select: { endpoint: true },
  });
  return subs.map((s) => s.endpoint);
}
