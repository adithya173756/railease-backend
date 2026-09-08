export interface Train {
  trainNumber: string;
  name: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: TrainClass[];
}

export interface TrainClass {
  code: string;
  name: string;
  fare: number;
  availableSeats: number;
  status: "AVAILABLE" | "RAC" | "WAITLIST";
}

export const trains: Train[] = [
  {
    trainNumber: "20833",
    name: "Vande Bharat Express",
    source: "Vijayawada",
    destination: "Hyderabad",
    departure: "06:15",
    arrival: "10:30",
    duration: "4h 15m",
    classes: [
      {
        code: "CC",
        name: "AC Chair Car",
        fare: 1200,
        availableSeats: 42,
        status: "AVAILABLE"
      },
      {
        code: "EC",
        name: "Executive Chair Car",
        fare: 2200,
        availableSeats: 8,
        status: "AVAILABLE"
      }
    ]
  },

  {
    trainNumber: "12703",
    name: "Falaknuma Express",
    source: "Vijayawada",
    destination: "Hyderabad",
    departure: "08:30",
    arrival: "14:00",
    duration: "5h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 420,
        availableSeats: 76,
        status: "AVAILABLE"
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1050,
        availableSeats: 21,
        status: "AVAILABLE"
      },
      {
        code: "2A",
        name: "AC 2 Tier",
        fare: 1450,
        availableSeats: 4,
        status: "AVAILABLE"
      }
    ]
  },

  {
    trainNumber: "17015",
    name: "Visakha Express",
    source: "Vijayawada",
    destination: "Hyderabad",
    departure: "21:00",
    arrival: "05:30",
    duration: "8h 30m",
    classes: [
      {
        code: "SL",
        name: "Sleeper",
        fare: 390,
        availableSeats: 0,
        status: "WAITLIST"
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 980,
        availableSeats: 0,
        status: "RAC"
      }
    ]
  },

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
        status: "AVAILABLE"
      },
      {
        code: "3A",
        name: "AC 3 Tier",
        fare: 1020,
        availableSeats: 12,
        status: "AVAILABLE"
      }
    ]
  }
];