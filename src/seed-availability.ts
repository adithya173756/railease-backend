import { db } from "./prisma/db";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

async function main() {
  const trains =
    await db.orm.public.TrainClass.all();

  const today = new Date();

  for (let day = 0; day < 30; day++) {
    const date = new Date(today);

    date.setDate(
      today.getDate() + day
    );

    const journeyDate =
      formatDate(date);

    for (const trainClass of trains) {
      const existing =
        await db.orm.public.TrainAvailability
          .where({
            trainClassId: trainClass.id,
            journeyDate,
          })
          .first();

      if (!existing) {
        await db.orm.public.TrainAvailability.create({
          journeyDate,
          availableSeats:
            trainClass.availableSeats,
          status: "AVAILABLE",
          trainClassId: trainClass.id,
        });
      }
    }
  }

  console.log(
    "✅ Created 30 days of train availability."
  );
}

main().catch((error) => {
  console.error(
    "❌ Availability seed failed:",
    error
  );
});