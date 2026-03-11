import formatTimeToString from '../utils/formatTimeToString'

const general = {
  timeFormats: {
    days: {
      1: () => `deň`,
      2: () => `dni`,
      5: () => `dní`,
    },
    hours: {
      1: () => `hodina`,
      2: () => `hodiny`,
      5: () => `hodín`,
    },
    minutes: {
      1: () => `minúta`,
      2: () => `minúty`,
      5: () => `minút`,
    },
    seconds: {
      1: () => `sekunda`,
      2: () => `sekundy`,
      5: () => `sekúnd`,
    },
  },

  dateFormats: {
    months: {
      [`01`]: () => `január`,
      [`02`]: () => `február`,
      [`03`]: () => `marec`,
      [`04`]: () => `apríl`,
      [`05`]: () => `máj`,
      [`06`]: () => `jún`,
      [`07`]: () => `júl`,
      [`08`]: () => `august`,
      [`09`]: () => `september`,
      [`10`]: () => `október`,
      [`11`]: () => `november`,
      [`12`]: () => `december`,
    }
  },

  functionWords: {
    and: () => `a`,
  },

  errors: {
    turnstile: {
      unavailable: () => `nemožno kontaktovať Turnstile. prosím skúste to znova.`,
      noToken: () => `Turnstile token nebol poskytnutý. prosím skúste to znova.`,
      invalidResponse: () => `neplatná Turnstile odpoveď. prosím skúste to znova.`,
      keyUsedOrExpired: () => `Turnstile kľúč už bol použitý alebo vypršal. prosím skúste to znova.`,
    },
  },

  adjectives: () => [
    "rozkošný", "dobrodružný", "prijateľný", "ostražitý", "živý", "pobavený", 
    "nahnevaný", "otrávený", "otravný", "znepokojený", "arogantný", "zahanbený", 
    "atraktívny", "priemerný", "strašný", "zlý", "krásny", "lepší", 
    "zmätený", "čierny", "modrý", "modrooký", "červenajúci", "znudený", 
    "rozumný", "odvážny", "rozbitný", "jasný", "zaneprázdnený", "pokojný", "opatrný", 
    "obozretný", "pôvabný", "veselý", "čistý", "jasný", "šikovný", 
    "oblačný", "nemotorný", "farebný", "bojovný", "pohodlný", "ustarostený", 
    "odsúdený", "zmätený", "spolupracujúci", "odvážny", "bláznivý", "strašidelný", 
    "preplnený", "zvedavý", "roztomilý", "nebezpečný", "tmavý", "oslnivý", 
    "nehybný", "nádherný", "ťažký", "odlišný", "rozrušený", "rozosmiaty", 
    "pochybovačný", "fádny", "nudný", "nedočkavý", "ľahký", "povznesený", "elegantný", 
    "zahanbený", "očarujúci", "povzbudivý", "energetický", "nadšený", 
    "závistlivý", "nadšený", "drahý", "bujný", "férový", "verný", 
    "slávny", "ozdobný", "fantastický", "rýchly", "špinavý", "jemný", "pochabý", 
    "krehký", "slabý", "zbesilý", "priateľský", "vystrašený", "vtipný", 
    "jemný", "nadaný", "očarujúci", "žiariaci", "slávny", "dobrý", 
    "nádherný", "pôvabný", "zarmútený", "bizarný", "mrzutý", "pohľadný", 
    "šťastný", "zdravý", "užitočný", "bezmocný", "zábavný", "domácky", 
    "hrozný", "hladný", "zranený", "chorý", "dôležitý", "nemožný", 
    "lacný", "nevinný", "všímavý", "inteligentný", "zaujatý", 
    "svrbiaci", "žiarlivý", "nervózny", "veselý", "radostný", "láskavý", "lenivý", 
    "ľahký", "živý", "osamelý", "dlhý", "pôvabný", "šťastný", "veľkolepý", 
    "hmlistý", "moderný", "nehybný", "blatistý", "kašovitý", "tajomný", 
    "odporný", "neposlušný", "nervózny", "milý", "bláznivý", "poslušný", "odporný", 
    "zvláštny", "otvorený", "poburujúci", "vynikajúci", "spanikárený", "dokonalý", 
    "prostý", "príjemný", "vyrovnaný", "zdvorilý", "mocný", "vzácny", 
    "pichľavý", "hrdý", "zmätený", "staromódny", "skutočný", "uľavený", "odpudivý", 
    "bohatý", "strašidelný", "sebecký", "lesklý", "plachý", "hlúpy", "ospalý", "usmievavý", 
    "zahmlený", "boľavý", "iskrivý", "veľkolepý", "bezchybný", "búrlivý", 
    "divný", "hlúpy", "úspešný", "super", "talentovaný", "krotký", "nežný", 
    "napätý", "hrozný", "vďačný", "premýšľavý", "bezohľadný", "unavený", 
    "tvrdý", "trápiaci", "nezaujatý", "nevzhľadný", "nezvyčajný", "rozrušený", 
    "napätý", "rozľahlý", "víťazný", "živý", "túlajúci", "unavený", 
    "zlý", "udivený", "divoký", "vtipný", "ustarostený", "znepokojujúci", "nesprávny", 
    "bláznivý", "horlivý"
  ],

  nouns: () => ({
    "herec": "m", "lietadlo": "n", "letisko": "n", "alarm": "m", "aligátor": "m", "abeceda": "f",
    "sanitka": "f", "zviera": "n", "odpoveď": "f", "mravec": "m", "jablko": "n", "spotrebič": "m",
    "zástera": "f", "oblúk": "m", "rameno": "n", "armáda": "f", "šíp": "m", "popolník": "m", "asteroid": "m",
    "autor": "m", "avokádo": "n", "dieťa": "n", "chrbát": "m", "balón": "m", "banán": "m", "skupina": "f",
    "banka": "f", "holič": "m", "základňa": "f", "košík": "m", "basketbal": "m", "netopier": "m", "kúpeľ": "m",
    "pláž": "f", "medveď": "m", "brada": "f", "posteľ": "f", "včela": "f", "hovädzie": "n", "chrobák": "m", "zvonec": "m",
    "opasok": "m", "lavička": "f", "bareta": "f", "bobuľa": "f", "bicykel": "m", "bicykel": "m", "vták": "m",
    "narodeniny": "m", "hryz": "m", "blok": "m", "čln": "m", "kniha": "f", "topánka": "f", "hranica": "f",
    "fľaša": "f", "hranica": "f", "krabica": "f", "chlapec": "m", "brzda": "f", "chlieb": "m", "most": "m",
    "divoký kôň": "m", "brat": "m", "kefa": "f", "bublina": "f", "vedro": "n", "budova": "f",
    "žiarovka": "f", "zajačik": "m", "autobus": "m", "motýľ": "m", "gombík": "m", "kapusta": "f", "kaktus": "m",
    "koláč": "m", "kalkulačka": "f", "kalendár": "m", "ťava": "f", "kamera": "f", "tábor": "m", "sviečka": "f",
    "kanoe": "n", "plátno": "n", "čiapka": "f", "titulok": "m", "auto": "n", "karta": "f", "tesár": "m",
    "kočiar": "m", "mrkva": "f", "vozík": "m", "hrad": "m", "mačka": "f", "dobytok": "m", "zeler": "m",
    "violončelo": "n", "cement": "m", "reťaz": "f", "stolička": "f", "krieda": "f", "kanál": "m", "syr": "m",
    "čerešňa": "f", "šach": "m", "kura": "n", "deti": "n", "šimpanz": "m", "brada": "f",
    "kostol": "m", "mesto": "n", "mušľa": "f", "hodiny": "f", "látka": "f", "oblak": "m", "ďatelina": "f",
    "klub": "m", "tréner": "m", "uhlie": "n", "pobrežie": "n", "kabát": "m", "pavučina": "f", "cievka": "f", "obojok": "m",
    "farba": "f", "kométa": "f", "kompas": "m", "počítač": "m", "kondicionér": "m", "šnúra": "f",
    "kork": "m", "kukurica": "f", "pohovka": "f", "krajina": "f", "krava": "f", "krab": "m", "trhlina": "f", "debna": "f",
    "pastelka": "f", "cvrček": "m", "krokodíl": "m", "vrana": "f", "koruna": "f", "kôrka": "f", "šálka": "f",
    "záves": "m", "vankúš": "m", "valec": "m", "pes": "m", "osol": "m", "dvere": "f", "drak": "m",
    "odtok": "m", "zásuvka": "f", "šaty": "f", "kvapka": "f", "kačica": "f", "prach": "m", "orol": "m", "ucho": "n",
    "zem": "f", "vajce": "n", "baklažán": "m", "lakeť": "m", "slon": "m", "motor": "m", "oko": "n",
    "tvár": "f", "továreň": "f", "víla": "f", "rodina": "f", "ventilátor": "m", "farma": "f", "pierko": "n",
    "hostina": "f", "plot": "m", "pole": "n", "vlajka": "f", "kvet": "m", "flauta": "f", "mucha": "f", "hmla": "f",
    "les": "m", "vidlička": "f", "fontána": "f", "žaba": "f", "ovocie": "n", "nábytok": "m", "garáž": "f",
    "záhrada": "f", "brána": "f", "drahokam": "m", "duch": "m", "žirafa": "f", "sklo": "n", "rukavica": "f",
    "koza": "f", "zlato": "n", "hus": "f", "gorila": "f", "hrozno": "n", "tráva": "f", "gitara": "f",
    "vlasy": "m", "hala": "f", "klobúk": "m", "vrtuľník": "m", "prilba": "f", "med": "m", "roh": "m",
    "kôň": "m", "nemocnica": "f", "dom": "m", "ostrov": "m", "bunda": "f", "nádoba": "f", "medúza": "f",
    "kengura": "f", "kanvica": "f", "kľúč": "m", "klávesnica": "f", "kráľ": "m", "kuchyňa": "f", "šarkan": "m",
    "mačiatko": "n", "lampa": "f", "list": "m", "knižnica": "f", "maják": "m", "lev": "m", "jašterica": "f",
    "zámok": "m", "obed": "m", "magnet": "m", "mapa": "f", "maska": "f", "melón": "m", "opica": "f", "mesiac": "m",
    "vrch": "m", "myš": "f", "ústa": "n", "klinec": "m", "náhrdelník": "m", "ihla": "f", "hniezdo": "n",
    "nos": "m", "zápisník": "m", "oceán": "m", "pomaranč": "m", "sova": "f", "farba": "f", "nohavice": "f",
    "papier": "m", "papagáj": "m", "ceruzka": "f", "klavír": "m", "vankúš": "m", "pizza": "f", "planéta": "f",
    "rastlina": "f", "vrecko": "n", "zemiak": "m", "väznica": "f", "tekvica": "f", "králik": "m", "dážď": "m",
    "dúha": "f", "prsteň": "m", "rieka": "f", "robot": "m", "raketa": "f", "koreň": "m", "lano": "n",
    "plachta": "f", "škola": "f", "nožnice": "f", "more": "n", "topánka": "f", "obloha": "f", "slimák": "m", "had": "m",
    "sneh": "m", "mydlo": "n", "ponožka": "f", "lyžica": "f", "hviezda": "f", "slnko": "n", "stôl": "m", "tiger": "m",
    "paradajka": "f", "zub": "m", "vlak": "m", "strom": "m", "dáždnik": "m", "údolie": "n", "váza": "f",
    "vozeň": "m", "stena": "f", "veľryba": "f", "koleso": "n", "okno": "n", "krídlo": "n", "vlk": "m", "červ": "m",
    "zebra": "f", "zoo": "f"
  }),

  generateName: () => {
    const adjectives = general.adjectives()
    const nouns = Object.keys(general.nouns())
    const genders = general.nouns()

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    const gender = genders[randomNoun];

    let finalAdjective = randomAdjective;

    // Handle Slovak grammar
    if (gender === "f") {
      finalAdjective = randomAdjective.replace(/[ýí]$/, "á");
    } else if (gender === "n") {
      finalAdjective = randomAdjective.replace(/[ýí]$/, "é");
    }

    // Capitalize first letters and return
    const cappedAdjective = finalAdjective.charAt(0).toUpperCase() + finalAdjective.slice(1);
    const cappedNoun = randomNoun.charAt(0).toUpperCase() + randomNoun.slice(1);

    return `${cappedAdjective} ${cappedNoun}`;
  }
}

const icons = {
  tempIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0" />
        </svg>
    `,

  pressureIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 14l4-4M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
    `,

  humidityIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7" />
        </svg>
    `,

  bluetoothConnectionIcon: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10l-5 5V2l5 5L7 17m11-5h3M3 12h3" />
        </svg>
    `
}

export default {
  general,
  icons,

  emails: {
    auth: {
      subject: () => `prihlasovací link`,
      text: (details) => `
        dobrý deň,

        môžete sa prihlásiť nasledujúcim kódom: ${details?.code}
        alebo nasledujúcim linkom: ${details?.link}

        ak ste tento email nevyžiadali, môžete ho kľudne ignorovať.

        ${process.env.APP_NAME}
      `,
    },
  },

  auth: {
    errors: {
      invalidEmail: () => `musíte zadať platný email.`,
      noVerificationToken: () => `nebol poskytnutý žiadny verifikačný token. prosím skúste to znova.`,
      verificationTokenUsedOrExpired: () => `verifikačný token už bol použitý alebo vypršal. prosím skúste to znova.`,
      invalidVerificationCode: () => `neplatný verifikačný kód. prosím skúste to znova.`,
      loginNeeded: () => `najprv sa prihláste prosím.`,

      ratelimits: {
        email: (details) => {
          if (!Number.parseInt(details?.duration)) return `príliš veľa žiadostí pre tento email. skúste to znova neskôr.`
          return `príliš veľa žiadostí pre tento email. skúste to znova o ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        ip: (details) => {
          if (!Number.parseInt(details?.duration)) return `poslali ste príliš veľa žiadostí. skúste to znova neskôr.`
          return `poslali ste príliš veľa žiadostí. skúste to znova o ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        code: () => `zadali ste príliš veľa zlých kódov. musíte požiadať o novú verifikáciu.`,
      },

      turnstile: general.errors.turnstile,
    },
  },

  settings: {
    errors: {
      invalidEmail: () => `musíte zadať platný email.`,
      emailTaken: (details) => `používateľ so zadaným emailom (${details?.newEmail}) už existuje.`,

      turnstile: general.errors.turnstile,
    },
  },

  stations: {
    errors: {
      noName: () => `musíte zadať meno.`,
      invalidOwner: () => `musíte zadať platný email vlastníka.`,
      ownerUserNotFound: (details) => `používateľ so zadaným emailom (${details?.newOwnerEmail}) neexistuje.`,

      turnstile: general.errors.turnstile,
    },

    history: {
      properties: {
        indoorTemp: () => `${icons.tempIcon()} vnutorná teplota`,
        indoorPressure: () => `${icons.pressureIcon()} vnutorný tlak`,
        indoorHumidity: () => `${icons.humidityIcon()} vnutorná vlhkosť`,

        outdoorConnected: () => `${icons.bluetoothConnectionIcon()} pripojenie externej jednotky`,
        outdoorTemp: () => `${icons.tempIcon()} vonkajšia teplota`,
        outdoorPressure: () => `${icons.pressureIcon()} vonkajší tlak`,
        outdoorHumidity: () => `${icons.humidityIcon()} vonkajšia vlhkosť`,
      },
    },
  },

  websocket: {
    keepalive: () => `beep`,
    dataSaved: (details) => `úspešne uložené dáta pre ${details?.meteostanica?.name}`,

    errors: {
      missingFields: () => `chýbajú dôležité polia: indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude`,
      invalidKey: (details) => `zadali ste neplatný websocket kľúč stanice (${details.key})`,
    },
  }
}