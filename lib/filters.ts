// Popular enthusiast cars and mods data

export interface CarFilter {
  id: string;
  name: string;
  make: string;
  model: string;
  years?: string;
  searchTerms: string[]; // For visor.vin searches
}

export interface ModFilter {
  id: string;
  name: string;
  category: string;
  searchTerms: string[];
}

export const POPULAR_CARS: CarFilter[] = [
  // Nissan
  {
    id: 'nissan-350z',
    name: 'Nissan 350Z',
    make: 'Nissan',
    model: '350Z',
    years: '2003-2009',
    searchTerms: ['nissan 350z', '350z', 'fairlady z z33'],
  },
  {
    id: 'nissan-370z',
    name: 'Nissan 370Z',
    make: 'Nissan',
    model: '370Z',
    years: '2009-2020',
    searchTerms: ['nissan 370z', '370z', 'fairlady z z34'],
  },
  {
    id: 'nissan-skyline-gtr',
    name: 'Nissan Skyline GT-R',
    make: 'Nissan',
    model: 'Skyline GT-R',
    years: '1989-2002',
    searchTerms: ['nissan skyline gtr', 'r32 gtr', 'r33 gtr', 'r34 gtr'],
  },
  {
    id: 'nissan-gtr-r35',
    name: 'Nissan GT-R (R35)',
    make: 'Nissan',
    model: 'GT-R',
    years: '2007-Present',
    searchTerms: ['nissan gtr r35', 'r35 gtr', 'nissan gt-r'],
  },
  {
    id: 'nissan-240sx',
    name: 'Nissan 240SX',
    make: 'Nissan',
    model: '240SX',
    years: '1989-1998',
    searchTerms: ['nissan 240sx', '240sx', 's13', 's14', 'silvia'],
  },

  // Toyota
  {
    id: 'toyota-supra-mk4',
    name: 'Toyota Supra (MK4)',
    make: 'Toyota',
    model: 'Supra',
    years: '1993-2002',
    searchTerms: ['toyota supra mk4', 'supra mk4', 'a80 supra', '2jz supra'],
  },
  {
    id: 'toyota-supra-mk5',
    name: 'Toyota Supra (MK5)',
    make: 'Toyota',
    model: 'Supra',
    years: '2019-Present',
    searchTerms: ['toyota supra mk5', 'supra mk5', 'a90 supra', 'gr supra'],
  },
  {
    id: 'toyota-86',
    name: 'Toyota 86 / GR86',
    make: 'Toyota',
    model: '86',
    years: '2012-Present',
    searchTerms: ['toyota 86', 'gt86', 'gr86', 'frs', 'brz'],
  },
  {
    id: 'toyota-mr2',
    name: 'Toyota MR2',
    make: 'Toyota',
    model: 'MR2',
    years: '1984-2007',
    searchTerms: ['toyota mr2', 'mr2 spyder', 'mr2 turbo'],
  },

  // Honda
  {
    id: 'honda-s2000',
    name: 'Honda S2000',
    make: 'Honda',
    model: 'S2000',
    years: '1999-2009',
    searchTerms: ['honda s2000', 's2000 ap1', 's2000 ap2'],
  },
  {
    id: 'honda-civic-si',
    name: 'Honda Civic Si',
    make: 'Honda',
    model: 'Civic Si',
    years: '1999-Present',
    searchTerms: ['honda civic si', 'civic si', 'civic type r'],
  },
  {
    id: 'honda-nsx',
    name: 'Honda NSX',
    make: 'Honda',
    model: 'NSX',
    years: '1990-2005',
    searchTerms: ['honda nsx', 'acura nsx', 'nsx na1', 'nsx na2'],
  },
  {
    id: 'honda-integra',
    name: 'Honda Integra / Acura Integra',
    make: 'Honda',
    model: 'Integra',
    years: '1986-2001',
    searchTerms: ['honda integra', 'acura integra', 'integra type r', 'dc2'],
  },

  // Mazda
  {
    id: 'mazda-rx7',
    name: 'Mazda RX-7',
    make: 'Mazda',
    model: 'RX-7',
    years: '1978-2002',
    searchTerms: ['mazda rx7', 'rx7 fd', 'rx7 fc', 'rotary'],
  },
  {
    id: 'mazda-rx8',
    name: 'Mazda RX-8',
    make: 'Mazda',
    model: 'RX-8',
    years: '2003-2012',
    searchTerms: ['mazda rx8', 'rx8', 'renesis'],
  },
  {
    id: 'mazda-miata',
    name: 'Mazda MX-5 Miata',
    make: 'Mazda',
    model: 'MX-5',
    years: '1989-Present',
    searchTerms: ['mazda miata', 'mx5', 'mx-5', 'na miata', 'nb miata', 'nd miata'],
  },

  // Subaru
  {
    id: 'subaru-wrx',
    name: 'Subaru WRX / STI',
    make: 'Subaru',
    model: 'WRX',
    years: '2002-Present',
    searchTerms: ['subaru wrx', 'wrx sti', 'impreza wrx', 'sti'],
  },
  {
    id: 'subaru-brz',
    name: 'Subaru BRZ',
    make: 'Subaru',
    model: 'BRZ',
    years: '2012-Present',
    searchTerms: ['subaru brz', 'brz', 'frs', '86'],
  },

  // Mitsubishi
  {
    id: 'mitsubishi-evo',
    name: 'Mitsubishi Lancer Evolution',
    make: 'Mitsubishi',
    model: 'Lancer Evolution',
    years: '1992-2016',
    searchTerms: ['mitsubishi evo', 'lancer evolution', 'evo 8', 'evo 9', 'evo x'],
  },
  {
    id: 'mitsubishi-3000gt',
    name: 'Mitsubishi 3000GT / GTO',
    make: 'Mitsubishi',
    model: '3000GT',
    years: '1990-2001',
    searchTerms: ['mitsubishi 3000gt', '3000gt vr4', 'gto twin turbo'],
  },

  // Others
  {
    id: 'ford-mustang',
    name: 'Ford Mustang',
    make: 'Ford',
    model: 'Mustang',
    years: '1964-Present',
    searchTerms: ['ford mustang', 'mustang gt', 'mustang gt500', '5.0 mustang'],
  },
  {
    id: 'chevy-corvette',
    name: 'Chevrolet Corvette',
    make: 'Chevrolet',
    model: 'Corvette',
    years: '1953-Present',
    searchTerms: ['chevrolet corvette', 'corvette c5', 'corvette c6', 'corvette c7', 'corvette c8'],
  },
  {
    id: 'bmw-m3',
    name: 'BMW M3',
    make: 'BMW',
    model: 'M3',
    years: '1986-Present',
    searchTerms: ['bmw m3', 'm3 e46', 'm3 e92', 'm3 f80', 'm3 g80'],
  },
];

export const POPULAR_MODS: ModFilter[] = [
  // Engine / Performance
  {
    id: 'turbo-kit',
    name: 'Turbo Kit',
    category: 'Engine',
    searchTerms: ['turbo kit', 'turbocharger kit', 'twin turbo', 'single turbo'],
  },
  {
    id: 'supercharger',
    name: 'Supercharger Kit',
    category: 'Engine',
    searchTerms: ['supercharger kit', 'supercharger', 'roots blower', 'centrifugal supercharger'],
  },
  {
    id: 'cold-air-intake',
    name: 'Cold Air Intake',
    category: 'Engine',
    searchTerms: ['cold air intake', 'cai', 'intake system', 'air filter kit'],
  },
  {
    id: 'intercooler',
    name: 'Intercooler',
    category: 'Engine',
    searchTerms: ['intercooler', 'fmic', 'front mount intercooler', 'upgraded intercooler'],
  },
  {
    id: 'ecu-tune',
    name: 'ECU Tune / Tuner',
    category: 'Engine',
    searchTerms: ['ecu tune', 'tuner', 'cobb accessport', 'hondata', 'ecutek'],
  },
  {
    id: 'fuel-injectors',
    name: 'Fuel Injectors',
    category: 'Engine',
    searchTerms: ['fuel injectors', 'high flow injectors', 'performance injectors'],
  },
  {
    id: 'fuel-pump',
    name: 'Fuel Pump',
    category: 'Engine',
    searchTerms: ['fuel pump', 'high pressure fuel pump', 'walbro fuel pump'],
  },

  // Exhaust
  {
    id: 'cat-back-exhaust',
    name: 'Cat-Back Exhaust',
    category: 'Exhaust',
    searchTerms: ['cat back exhaust', 'exhaust system', 'performance exhaust'],
  },
  {
    id: 'turbo-back-exhaust',
    name: 'Turbo-Back Exhaust',
    category: 'Exhaust',
    searchTerms: ['turbo back exhaust', 'full exhaust', 'downpipe back'],
  },
  {
    id: 'headers',
    name: 'Headers',
    category: 'Exhaust',
    searchTerms: ['headers', 'exhaust manifold', 'performance headers', 'long tube headers'],
  },
  {
    id: 'downpipe',
    name: 'Downpipe',
    category: 'Exhaust',
    searchTerms: ['downpipe', 'catless downpipe', 'high flow downpipe'],
  },

  // Suspension
  {
    id: 'coilovers',
    name: 'Coilovers',
    category: 'Suspension',
    searchTerms: ['coilovers', 'coilover suspension', 'adjustable suspension', 'bc racing coilovers'],
  },
  {
    id: 'lowering-springs',
    name: 'Lowering Springs',
    category: 'Suspension',
    searchTerms: ['lowering springs', 'performance springs', 'sport springs'],
  },
  {
    id: 'sway-bars',
    name: 'Sway Bars',
    category: 'Suspension',
    searchTerms: ['sway bars', 'anti roll bars', 'stabilizer bars'],
  },
  {
    id: 'strut-tower-brace',
    name: 'Strut Tower Brace',
    category: 'Suspension',
    searchTerms: ['strut tower brace', 'strut bar', 'front brace'],
  },

  // Brakes
  {
    id: 'big-brake-kit',
    name: 'Big Brake Kit',
    category: 'Brakes',
    searchTerms: ['big brake kit', 'bbk', 'performance brakes', 'brembo brakes'],
  },
  {
    id: 'brake-pads',
    name: 'Performance Brake Pads',
    category: 'Brakes',
    searchTerms: ['performance brake pads', 'racing brake pads', 'ceramic brake pads'],
  },
  {
    id: 'brake-rotors',
    name: 'Performance Rotors',
    category: 'Brakes',
    searchTerms: ['performance rotors', 'slotted rotors', 'drilled rotors', 'brake discs'],
  },

  // Wheels & Tires
  {
    id: 'wheels',
    name: 'Wheels / Rims',
    category: 'Wheels',
    searchTerms: ['wheels', 'rims', 'forged wheels', 'racing wheels', 'lightweight wheels'],
  },
  {
    id: 'tires',
    name: 'Performance Tires',
    category: 'Wheels',
    searchTerms: ['performance tires', 'racing tires', 'summer tires', 'track tires'],
  },
  {
    id: 'wheel-spacers',
    name: 'Wheel Spacers',
    category: 'Wheels',
    searchTerms: ['wheel spacers', 'hub spacers', 'bolt on spacers'],
  },

  // Exterior
  {
    id: 'body-kit',
    name: 'Body Kit',
    category: 'Exterior',
    searchTerms: ['body kit', 'aero kit', 'widebody kit', 'bumper kit'],
  },
  {
    id: 'spoiler',
    name: 'Spoiler / Wing',
    category: 'Exterior',
    searchTerms: ['spoiler', 'rear wing', 'gt wing', 'trunk spoiler'],
  },
  {
    id: 'carbon-fiber-hood',
    name: 'Carbon Fiber Hood',
    category: 'Exterior',
    searchTerms: ['carbon fiber hood', 'carbon hood', 'cf hood'],
  },

  // Interior
  {
    id: 'racing-seats',
    name: 'Racing Seats',
    category: 'Interior',
    searchTerms: ['racing seats', 'bucket seats', 'recaro seats', 'sparco seats'],
  },
  {
    id: 'steering-wheel',
    name: 'Steering Wheel',
    category: 'Interior',
    searchTerms: ['steering wheel', 'racing steering wheel', 'quick release steering wheel'],
  },
  {
    id: 'shift-knob',
    name: 'Shift Knob',
    category: 'Interior',
    searchTerms: ['shift knob', 'weighted shift knob', 'short shifter'],
  },

  // Electronics
  {
    id: 'gauges',
    name: 'Performance Gauges',
    category: 'Electronics',
    searchTerms: ['performance gauges', 'boost gauge', 'oil pressure gauge', 'wideband'],
  },
  {
    id: 'blow-off-valve',
    name: 'Blow Off Valve',
    category: 'Electronics',
    searchTerms: ['blow off valve', 'bov', 'bypass valve', 'turbo bov'],
  },
];

// Organize mods by category
export const MOD_CATEGORIES = [
  'Engine',
  'Exhaust',
  'Suspension',
  'Brakes',
  'Wheels',
  'Exterior',
  'Interior',
  'Electronics',
];
