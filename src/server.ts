import express, {
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

type AuthenticatedRequest = Request & {
  userId?: number;
};

const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token."
      });
    }

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration error."
      });
    }

    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as {
      userId: number;
      email: string;
    };

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token."
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token."
    });
  }
};

app.get(
  "/api/auth/me",
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required."
        });
      }

      const user =
        await db.orm.public.User
          .where({
            id: req.userId
          })
          .first();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error(
        "Auth user lookup error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch user profile."
      });
    }
  }
);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to RailEase API",
    status: "running"
  });
});

app.get("/api/stations/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.json({
        success: true,
        count: 0,
        stations: [],
      });
    }

    const stations = await db.orm.public.Station
      .where((station) =>
        station.name.ilike(`%${query}%`)
      )
      .all();

    return res.json({
      success: true,
      count: stations.length,
      stations,
    });
  } catch (error) {
    console.error(
      "Station search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to search stations.",
    });
  }
});

app.get("/api/trains/search", async (req, res) => {
  try {
    const from = String(req.query.from || "").trim();
    const to = String(req.query.to || "").trim();
    const date = String(req.query.date || "").trim();

    const sort = String(req.query.sort || "").trim();
    const classCode = String(
      req.query.classCode || ""
    ).trim();

    const minSeatsValue = String(
      req.query.minSeats || ""
    ).trim();

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide from, to and journey date.",
      });
    }

    // Validate date format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date.",
      });
    }

    const selectedDate = new Date(
      `${date}T00:00:00`
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date.",
      });
    }

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message:
          "Journey date cannot be in the past.",
      });
    }

    // Validate minimum seats
    let minSeats = 0;

    if (minSeatsValue) {
      minSeats = Number(minSeatsValue);

      if (
        Number.isNaN(minSeats) ||
        minSeats < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid minimum seat value.",
        });
      }
    }

    const extractCode = (value: string) => {
      const match = value.match(
        /\(([A-Z0-9]+)\)$/
      );

      return match ? match[1] : null;
    };

    const fromCode = extractCode(from);
    const toCode = extractCode(to);

    let source = from;
    let destination = to;

    if (fromCode) {
      const station =
        await db.orm.public.Station
          .where({
            code: fromCode,
          })
          .first();

      if (station) {
        source = station.city;
      }
    }

    if (toCode) {
      const station =
        await db.orm.public.Station
          .where({
            code: toCode,
          })
          .first();

      if (station) {
        destination = station.city;
      }
    }

    const trains =
      await db.orm.public.Train
        .include("classes")
        .where((train) =>
          train.source.ilike(source)
        )
        .where((train) =>
          train.destination.ilike(destination)
        )
        .all();

    // Get availability for selected date
    const availability =
      await db.orm.public.TrainAvailability
        .where({
          journeyDate: date,
        })
        .all();

    const availabilityMap = new Map<number, any>(
      availability.map((item) => [
        Number(item.trainClassId),
        item,
      ]as [number, any])
    );

    let results: any[]= trains.map((train) => ({
      ...train,

      classes: train.classes.map(
        (trainClass: any) => {
          const dateAvailability =
            availabilityMap.get(
              trainClass.id
            );

          return {
            ...trainClass,
            availableSeats:
              dateAvailability?.availableSeats ??
              0,
            status:
              dateAvailability?.status ??
              "NOT_AVAILABLE",
          };
        }
      ),
    }));

    // Filter by class
    if (classCode) {
      results = results
        .map((train) => ({
          ...train,
          classes: train.classes.filter(
            (trainClass: any) =>
              trainClass.code === classCode
          ),
        }))
        .filter(
          (train) =>
            train.classes.length > 0
        );
    }

    // Filter by minimum available seats
    if (minSeats > 0) {
      results = results.filter((train) =>
        train.classes.some(
          (trainClass: any) =>
            trainClass.availableSeats >=
            minSeats
        )
      );
    }

    // Sorting
    if (sort === "departure") {
      results.sort((a, b) =>
        a.departure.localeCompare(
          b.departure
        )
      );
    }

    if (sort === "fare") {
      results.sort((a, b) => {
        const fareA =
          a.classes.length > 0
            ? Math.min(
                ...a.classes.map(
                  (item: any) => item.fare
                )
              )
            : Infinity;

        const fareB =
          b.classes.length > 0
            ? Math.min(
                ...b.classes.map(
                  (item: any) => item.fare
                )
              )
            : Infinity;

        return fareA - fareB;
      });
    }

    if (sort === "duration") {
      results.sort((a, b) =>
        a.duration.localeCompare(
          b.duration
        )
      );
    }

    return res.json({
      success: true,
      count: results.length,
      journeyDate: date,
      filters: {
        sort: sort || null,
        classCode: classCode || null,
        minSeats,
      },
      trains: results,
    });
  } catch (error) {
    console.error(
      "Train search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to search trains.",
    });
  }
});

app.get("/api/trains/:trainNumber", async (req, res) => {
  try {
    const trainNumber = req.params.trainNumber;

    const train = await db.orm.public.Train
      .include("classes")
      .where({
        trainNumber
      })
      .first();

    if (!train) {
      return res.status(404).json({
        success: false,
        message: "Train not found."
      });
    }

    return res.json({
      success: true,
      train
    });
  } catch (error) {
    console.error("Train details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch train details."
    });
  }
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const trains = await db.orm.public.Train.all();

    return res.json({
      success: true,
      count: trains.length,
      trains
    });
  } catch (error) {
    console.error("Database error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed."
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide email and password."
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const user =
      await db.orm.public.User
        .where({
          email: normalizedEmail
        })
        .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password."
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        String(password),
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password."
      });
    }

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration error."
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      jwtSecret,
      {
        expiresIn: "7d"
      }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login."
    });
  }
});

app.post(
  "/api/bookings",
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required."
        });
      }

      const userId = req.userId;

      const {
        trainNumber,
        journeyDate,
        passengerName,
        passengerAge,
        passengerGender,
        classCode
      } = req.body;

      const cleanTrainNumber =
  String(trainNumber || "").trim();

const cleanJourneyDate =
  String(journeyDate || "").trim();

const cleanPassengerName =
  String(passengerName || "").trim();

const cleanPassengerGender =
  String(passengerGender || "")
    .trim()
    .toUpperCase();

const cleanClassCode =
  String(classCode || "")
    .trim()
    .toUpperCase();

const age = Number(passengerAge);

const datePattern =
  /^\d{4}-\d{2}-\d{2}$/;

if (
  !cleanTrainNumber ||
  !cleanJourneyDate ||
  !cleanPassengerName ||
  !cleanPassengerGender ||
  !cleanClassCode
) {
  return res.status(400).json({
    success: false,
    message:
      "Please provide all booking details."
  });
}

if (!datePattern.test(cleanJourneyDate)) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid journey date."
  });
}

const selectedDate = new Date(
  `${cleanJourneyDate}T00:00:00`
);

if (
  Number.isNaN(
    selectedDate.getTime()
  )
) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid journey date."
  });
}

const today = new Date();

today.setHours(
  0,
  0,
  0,
  0
);

if (selectedDate < today) {
  return res.status(400).json({
    success: false,
    message:
      "Journey date cannot be in the past."
  });
}

if (
  cleanPassengerName.length < 2 ||
  cleanPassengerName.length > 100
) {
  return res.status(400).json({
    success: false,
    message:
      "Passenger name must be between 2 and 100 characters."
  });
}

if (
  !Number.isInteger(age) ||
  age < 1 ||
  age > 120
) {
  return res.status(400).json({
    success: false,
    message:
      "Passenger age must be between 1 and 120."
  });
}

const allowedGenders = [
  "MALE",
  "FEMALE",
  "OTHER"
];

if (
  !allowedGenders.includes(
    cleanPassengerGender
  )
) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid passenger gender."
  });
}

const allowedClasses = [
  "SL",
  "3A",
  "2A",
  "CC",
  "2S"
];

if (
  !allowedClasses.includes(
    cleanClassCode
  )
) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid train class."
  });
}

      const booking = await db.transaction(
        async (tx) => {
          const train =
            await tx.orm.public.Train
              .where({
                trainNumber:
                 cleanTrainNumber
              })
              .first();

          if (!train) {
            throw new Error(
              "TRAIN_NOT_FOUND"
            );
          }

          const trainClass =
            await tx.orm.public.TrainClass
              .where({
                trainId: train.id,
                code: cleanClassCode
              })
              .first();

          if (!trainClass) {
            throw new Error(
              "CLASS_NOT_FOUND"
            );
          }

          const availability =
            await tx.orm.public.TrainAvailability
              .where({
                trainClassId:
                  trainClass.id,
                journeyDate:
                  cleanJourneyDate
              })
              .first();

          if (!availability) {
            throw new Error(
              "AVAILABILITY_NOT_FOUND"
            );
          }

          if (
            availability.availableSeats <= 0
          ) {
            throw new Error(
              "NO_SEATS"
            );
          }

          const bookingNumber =
            `RE${Date.now()}`;

          const newBooking =
  await tx.orm.public.Booking.create({
    bookingNumber,
    journeyDate:
      cleanJourneyDate,
    passengerName:
      cleanPassengerName,
    passengerAge:
      age,
    passengerGender:
      cleanPassengerGender,
    classCode:
      cleanClassCode,
    fare: trainClass.fare,
    status: "CONFIRMED",
    trainId: train.id,
    userId
  });

await tx.orm.public.TrainAvailability
  .where({
    id: availability.id
  })
  .update({
    availableSeats:
      availability.availableSeats - 1
  });

          return newBooking;
        }
      );

      return res.status(201).json({
        success: true,
        message:
          "Booking created successfully.",
        booking
      });
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      if (
        error instanceof Error
      ) {
        if (
          error.message ===
          "TRAIN_NOT_FOUND"
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Train not found."
          });
        }

        if (
          error.message ===
          "CLASS_NOT_FOUND"
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Selected class not found."
          });
        }

        if (
          error.message ===
          "AVAILABILITY_NOT_FOUND"
        ) {
          return res.status(409).json({
            success: false,
            message:
              "No availability found for the selected journey date."
          });
        }

        if (
          error.message ===
          "NO_SEATS"
        ) {
          return res.status(409).json({
            success: false,
            message:
              "No seats available for the selected journey date."
          });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to create booking."
      });
    }
  }
);

app.post("/api/auth/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email and password."
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters."
      });
    }

    const existingUser =
      await db.orm.public.User
        .where({
          email: normalizedEmail
        })
        .first();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists."
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const user =
      await db.orm.public.User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash
      });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account."
    });
  }
});

app.get("/api/bookings/:bookingNumber", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
  return res.status(401).json({
    success: false,
    message: "Authentication required."
  });
}
    const bookingNumber = String(
      req.params.bookingNumber
    )

    const booking = await db.orm.public.Booking
      .where({
        bookingNumber,
        userId: req.userId
      })
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error("Booking lookup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking."
    });
  }
});

app.patch(
  "/api/bookings/:bookingNumber/cancel",
  requireAuth,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required."
        });
      }

      const bookingNumber = String(
        req.params.bookingNumber
      );

      const result = await db.transaction(
        async (tx) => {
          const booking =
            await tx.orm.public.Booking
              .where({
                bookingNumber,
                userId: req.userId
              })
              .first();

          if (!booking) {
            throw new Error(
              "BOOKING_NOT_FOUND"
            );
          }

          if (
            booking.status ===
            "CANCELLED"
          ) {
            throw new Error(
              "ALREADY_CANCELLED"
            );
          }

          const trainClass =
            await tx.orm.public.TrainClass
              .where({
                trainId:
                  booking.trainId,
                code:
                  booking.classCode
              })
              .first();

          if (!trainClass) {
            throw new Error(
              "CLASS_NOT_FOUND"
            );
          }

          const availability =
            await tx.orm.public.TrainAvailability
              .where({
                trainClassId:
                  trainClass.id,
                journeyDate:
                  booking.journeyDate
              })
              .first();

          if (!availability) {
            throw new Error(
              "AVAILABILITY_NOT_FOUND"
            );
          }

          await tx.orm.public.Booking
            .where({
              id: booking.id
            })
            .update({
              status: "CANCELLED"
            });

          await tx.orm.public.TrainAvailability
            .where({
              id: availability.id
            })
            .update({
              availableSeats:
                availability.availableSeats +
                1
            });

          return booking;
        }
      );

      return res.json({
        success: true,
        message:
          "Booking cancelled successfully.",
        booking: result
      });
    } catch (error) {
      console.error(
        "Booking cancellation error:",
        error
      );

      if (
        error instanceof Error
      ) {
        if (
          error.message ===
          "BOOKING_NOT_FOUND"
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Booking not found."
          });
        }

        if (
          error.message ===
          "ALREADY_CANCELLED"
        ) {
          return res.status(409).json({
            success: false,
            message:
              "Booking is already cancelled."
          });
        }

        if (
          error.message ===
          "CLASS_NOT_FOUND"
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Booking class not found."
          });
        }

        if (
          error.message ===
          "AVAILABILITY_NOT_FOUND"
        ) {
          return res.status(409).json({
            success: false,
            message:
              "Availability record not found for this journey date."
          });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to cancel booking."
      });
    }
  }
);

app.get("/api/bookings", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await db.orm.public.Booking
  .include("train")
  .where({
    userId: req.userId
  })
  .orderBy((booking) => booking.id.desc())
  .all();

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Bookings fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings."
    });
  }
});

const PORT = Number(
  process.env.PORT || 5000
);

app.listen(
  PORT,
  "0.0.0.0",
  () => {
  console.log(
    `RailEase backend running on port ${PORT}`
  );
});