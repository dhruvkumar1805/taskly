import { NextResponse } from "next/server";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// GitHub Actions' scheduled trigger is best-effort, not exact — runs of a
// "*/5 * * * *" workflow have been observed over an hour apart. remindedAt
// already makes each task fire at most once, so the lower bound only exists
// to stop a months-old stale task from suddenly notifying; it must stay far
// wider than any realistic gap between cron runs.
const REMINDER_LOOKBACK_HOURS = 24;

function getWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  return webpush;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - REMINDER_LOOKBACK_HOURS * 60 * 60 * 1000);

  const dueTasks = await prisma.task.findMany({
    where: {
      status: { not: "COMPLETED" },
      remindedAt: null,
      dueDate: { gte: windowStart, lte: now },
    },
    include: { user: { include: { pushSubscriptions: true } } },
  });

  const push = getWebPush();
  let sent = 0;

  for (const task of dueTasks) {
    for (const subscription of task.user.pushSubscriptions) {
      try {
        await push.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          JSON.stringify({
            title: "Task due",
            body: task.title,
            url: "/dashboard",
          }),
        );
        sent++;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: subscription.id } });
        }
      }
    }
    await prisma.task.update({ where: { id: task.id }, data: { remindedAt: now } });
  }

  return NextResponse.json({ checked: dueTasks.length, sent });
}
