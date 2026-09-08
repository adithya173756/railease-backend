import { db } from "./prisma/db";

type TrainSeed = {
  trainNumber: string;
  name: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: {
    code: string;
    name: string;
    fare: number;
    availableSeats: number;
    status: string;
  }[];
};

const trains: TrainSeed[] = [
  {
    trainNumber: "12728",
    name: "Godavari Express",
    source: "Hyderabad",
    destination: "Vijayawada",
    departure: "17:15",
    arrival: "23:00",
    duration: "5h 45m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 410,
        availableSeats: 54,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1020,
        availableSeats: 12,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12727",
    name: "Godavari Express",
    source: "Vijayawada",
    destination: "Hyderabad",
    departure: "05:30",
    arrival: "11:15",
    duration: "5h 45m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 410,
        availableSeats: 48,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1020,
        availableSeats: 10,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12706",
    name: "Secunderabad Intercity",
    source: "Secunderabad",
    destination: "Vijayawada",
    departure: "06:00",
    arrival: "12:20",
    duration: "6h 20m",
    classes: [
      {
        code: "CC",
        name: "AC Chair Car",
        fare: 720,
        availableSeats: 36,
        status: "AVAILABLE",
      },
      {
        code: "2S",
        name: "Second Sitting",
        fare: 210,
        availableSeats: 92,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12705",
    name: "Vijayawada Intercity",
    source: "Vijayawada",
    destination: "Secunderabad",
    departure: "14:00",
    arrival: "20:20",
    duration: "6h 20m",
    classes: [
      {
        code: "CC",
        name: "AC Chair Car",
        fare: 720,
        availableSeats: 30,
        status: "AVAILABLE",
      },
      {
        code: "2S",
        name: "Second Sitting",
        fare: 210,
        availableSeats: 88,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12740",
    name: "Visakha Express",
    source: "Secunderabad",
    destination: "Visakhapatnam",
    departure: "15:00",
    arrival: "07:30",
    duration: "16h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 560,
        availableSeats: 76,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1380,
        availableSeats: 18,
        status: "AVAILABLE",
      },
      {
        code: "2A",
        name: "AC 2 Tier",
        fare: 1920,
        availableSeats: 8,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12739",
    name: "Visakha Express",
    source: "Visakhapatnam",
    destination: "Secunderabad",
    departure: "20:00",
    arrival: "12:30",
    duration: "16h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 560,
        availableSeats: 64,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1380,
        availableSeats: 16,
        status: "AVAILABLE",
      },
      {
        code: "2A",
        name: "AC 2 Tier",
        fare: 1920,
        availableSeats: 6,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12760",
    name: "Charminar Express",
    source: "Hyderabad",
    destination: "Vijayawada",
    departure: "18:30",
    arrival: "00:25",
    duration: "5h 55m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 400,
        availableSeats: 62,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1010,
        availableSeats: 14,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12759",
    name: "Charminar Express",
    source: "Vijayawada",
    destination: "Hyderabad",
    departure: "04:45",
    arrival: "10:40",
    duration: "5h 55m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 400,
        availableSeats: 58,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1010,
        availableSeats: 13,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12764",
    name: "Padmavathi Express",
    source: "Tirupati",
    destination: "Secunderabad",
    departure: "17:00",
    arrival: "08:30",
    duration: "15h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 540,
        availableSeats: 70,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1320,
        availableSeats: 20,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12763",
    name: "Padmavathi Express",
    source: "Secunderabad",
    destination: "Tirupati",
    departure: "18:00",
    arrival: "09:30",
    duration: "15h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 540,
        availableSeats: 66,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1320,
        availableSeats: 18,
        status: "AVAILABLE",
      },
    ],
  },

  {
    trainNumber: "12784",
    name: "Kacheguda Express",
    source: "Kacheguda",
    destination: "Vijayawada",
    departure: "07:30",
    arrival: "14:10",
    duration: "6h 40m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 390,
        availableSeats: 58,
        status: "AVAILABLE",
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 980,
        availableSeats: 15,
        status: "AVAILABLE",
      },
    ],
  },
];

async function main() {
  for (const trainData of trains) {
    let train = await db.orm.public.Train
      .where({
        trainNumber: trainData.trainNumber,
      })
      .first();

    if (!train) {
      train = await db.orm.public.Train.create({
        trainNumber: trainData.trainNumber,
        name: trainData.name,
        source: trainData.source,
        destination: trainData.destination,
        departure: trainData.departure,
        arrival: trainData.arrival,
        duration: trainData.duration,
      });
    }

    for (const classData of trainData.classes) {
      const existingClass =
        await db.orm.public.TrainClass
          .where({
            trainId: train.id,
            code: classData.code,
          })
          .first();

      if (!existingClass) {
        await db.orm.public.TrainClass.create({
          code: classData.code,
          name: classData.name,
          fare: classData.fare,
          availableSeats:
            classData.availableSeats,
          status: classData.status,
          trainId: train.id,
        });
      }
    }
  }

  console.log(
    `✅ Added ${trains.length} RailEase demo trains.`
  );
}

main().catch((error) => {
  console.error(
    "❌ Train seed failed:",
    error
  );
});