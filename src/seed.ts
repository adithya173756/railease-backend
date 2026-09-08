import { db } from "./prisma/db";

type StationSeed = {
  code: string;
  name: string;
  city: string;
  state: string;
};

const stations: StationSeed[] = [
  // =========================
  // ANDHRA PRADESH - 30
  // =========================

  {
    code: "BZA",
    name: "Vijayawada Junction",
    city: "Vijayawada",
    state: "Andhra Pradesh",
  },
  {
    code: "VSKP",
    name: "Visakhapatnam Junction",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
  },
  {
    code: "TPTY",
    name: "Tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
  },
  {
    code: "RJY",
    name: "Rajahmundry",
    city: "Rajahmundry",
    state: "Andhra Pradesh",
  },
  {
    code: "GNT",
    name: "Guntur Junction",
    city: "Guntur",
    state: "Andhra Pradesh",
  },
  {
    code: "NLR",
    name: "Nellore",
    city: "Nellore",
    state: "Andhra Pradesh",
  },
  {
    code: "OGL",
    name: "Ongole",
    city: "Ongole",
    state: "Andhra Pradesh",
  },
  {
    code: "VZM",
    name: "Vizianagaram Junction",
    city: "Vizianagaram",
    state: "Andhra Pradesh",
  },
  {
    code: "SLO",
    name: "Samalkot Junction",
    city: "Samalkot",
    state: "Andhra Pradesh",
  },
  {
    code: "RU",
    name: "Renigunta Junction",
    city: "Renigunta",
    state: "Andhra Pradesh",
  },
  {
    code: "EE",
    name: "Eluru",
    city: "Eluru",
    state: "Andhra Pradesh",
  },
  {
    code: "TEL",
    name: "Tenali Junction",
    city: "Tenali",
    state: "Andhra Pradesh",
  },
  {
    code: "GTL",
    name: "Guntakal Junction",
    city: "Guntakal",
    state: "Andhra Pradesh",
  },
  {
    code: "PSA",
    name: "Palasa",
    city: "Palasa",
    state: "Andhra Pradesh",
  },
  {
    code: "ATP",
    name: "Anantapur",
    city: "Anantapur",
    state: "Andhra Pradesh",
  },
  {
    code: "KDP",
    name: "Cuddapah",
    city: "Kadapa",
    state: "Andhra Pradesh",
  },
  {
    code: "KUR",
    name: "Kurnool City",
    city: "Kurnool",
    state: "Andhra Pradesh",
  },
  {
    code: "NDL",
    name: "Nandyal Junction",
    city: "Nandyal",
    state: "Andhra Pradesh",
  },
  {
    code: "AKP",
    name: "Anakapalle",
    city: "Anakapalle",
    state: "Andhra Pradesh",
  },
  {
    code: "TUNI",
    name: "Tuni",
    city: "Tuni",
    state: "Andhra Pradesh",
  },
  {
    code: "BVRM",
    name: "Bhimavaram Junction",
    city: "Bhimavaram",
    state: "Andhra Pradesh",
  },
  {
    code: "NDD",
    name: "Nidadavolu Junction",
    city: "Nidadavolu",
    state: "Andhra Pradesh",
  },
  {
    code: "TDD",
    name: "Tadepalligudem",
    city: "Tadepalligudem",
    state: "Andhra Pradesh",
  },
  {
    code: "GDV",
    name: "Gudivada Junction",
    city: "Gudivada",
    state: "Andhra Pradesh",
  },
  {
    code: "MCLA",
    name: "Machilipatnam",
    city: "Machilipatnam",
    state: "Andhra Pradesh",
  },
  {
    code: "CCT",
    name: "Kakinada Town Junction",
    city: "Kakinada",
    state: "Andhra Pradesh",
  },
  {
    code: "GDR",
    name: "Gudur Junction",
    city: "Gudur",
    state: "Andhra Pradesh",
  },
  {
    code: "CLX",
    name: "Chirala",
    city: "Chirala",
    state: "Andhra Pradesh",
  },
  {
    code: "RU",
    name: "Renigunta",
    city: "Tirupati",
    state: "Andhra Pradesh",
  },
  {
    code: "SKD",
    name: "Srikalahasti",
    city: "Srikalahasti",
    state: "Andhra Pradesh",
  },

  // =========================
  // TELANGANA - 30
  // =========================

  {
    code: "HYB",
    name: "Hyderabad Deccan",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    code: "SC",
    name: "Secunderabad Junction",
    city: "Secunderabad",
    state: "Telangana",
  },
  {
    code: "KCG",
    name: "Kacheguda",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    code: "KZJ",
    name: "Kazipet Junction",
    city: "Kazipet",
    state: "Telangana",
  },
  {
    code: "WL",
    name: "Warangal",
    city: "Warangal",
    state: "Telangana",
  },
  {
    code: "KMT",
    name: "Khammam",
    city: "Khammam",
    state: "Telangana",
  },
  {
    code: "NZB",
    name: "Nizamabad",
    city: "Nizamabad",
    state: "Telangana",
  },
  {
    code: "RDM",
    name: "Ramagundam",
    city: "Ramagundam",
    state: "Telangana",
  },
  {
    code: "MCI",
    name: "Mancherial",
    city: "Mancherial",
    state: "Telangana",
  },
  {
    code: "BN",
    name: "Bhongir",
    city: "Bhongir",
    state: "Telangana",
  },
  {
    code: "NLDA",
    name: "Nalgonda",
    city: "Nalgonda",
    state: "Telangana",
  },
  {
    code: "MRGA",
    name: "Miryalaguda",
    city: "Miryalaguda",
    state: "Telangana",
  },
  {
    code: "PBNR",
    name: "Peddapalli",
    city: "Peddapalli",
    state: "Telangana",
  },
  {
    code: "MBNR",
    name: "Mahbubnagar",
    city: "Mahbubnagar",
    state: "Telangana",
  },
  {
    code: "GWD",
    name: "Gadwal",
    city: "Gadwal",
    state: "Telangana",
  },
  {
    code: "KMC",
    name: "Kamareddi",
    city: "Kamareddi",
    state: "Telangana",
  },
  {
    code: "BASR",
    name: "Basar",
    city: "Basar",
    state: "Telangana",
  },
  {
    code: "ADB",
    name: "Adilabad",
    city: "Adilabad",
    state: "Telangana",
  },
  {
    code: "ZB",
    name: "Zahirabad",
    city: "Zahirabad",
    state: "Telangana",
  },
  {
    code: "VKB",
    name: "Vikarabad Junction",
    city: "Vikarabad",
    state: "Telangana",
  },
  {
    code: "TDU",
    name: "Tandur",
    city: "Tandur",
    state: "Telangana",
  },
  {
    code: "SHNR",
    name: "Shadnagar",
    city: "Shadnagar",
    state: "Telangana",
  },
  {
    code: "JCL",
    name: "Jangaon",
    city: "Jangaon",
    state: "Telangana",
  },
  {
    code: "MABD",
    name: "Mahbubabad",
    city: "Mahbubabad",
    state: "Telangana",
  },
  {
    code: "DKJ",
    name: "Dornakal Junction",
    city: "Dornakal",
    state: "Telangana",
  },
  {
    code: "BDCR",
    name: "Bhadrachalam Road",
    city: "Kothagudem",
    state: "Telangana",
  },
  {
    code: "MJF",
    name: "Medchal",
    city: "Medchal",
    state: "Telangana",
  },
  {
    code: "LPI",
    name: "Lingampalli",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    code: "BMT",
    name: "Begumpet",
    city: "Hyderabad",
    state: "Telangana",
  },
];

async function main() {
  for (const station of stations) {
    await db.orm.public.Station
      .where({
        code: station.code,
      })
      .first()
      .then(async (existing) => {
        if (existing) {
          await db.orm.public.Station
            .where({
              id: existing.id,
            })
            .update({
              name: station.name,
              city: station.city,
              state: station.state,
            });
        } else {
          await db.orm.public.Station.create({
            code: station.code,
            name: station.name,
            city: station.city,
            state: station.state,
          });
        }
      });
  }

  console.log(
    `✅ Seeded ${stations.length} Andhra Pradesh + Telangana stations.`
  );
}

main().catch((error) => {
  console.error("❌ Station seed failed:", error);
});