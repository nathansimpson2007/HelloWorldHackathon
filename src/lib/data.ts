
export type Resource = {
  name: string;
  type: 'Lecture Hall' | 'Lab' | 'Study Area' | 'Restroom' | 'Dining' | 'Printer' | 'Recreation' | 'Utility';
};

export type StudyArea = {
  id: string;
  name:string;
};

export type MenuItem = {
  name: string;
  station: string;
};

export type Building = {
  id: number;
  name: string;
  slug: string;
  history: string;
  hours: string;
  imageSeed: string;
  type: 'academic' | 'residential' | 'recreational' | 'dining' | 'other' | 'commercial' | 'administrative' | 'health' | 'landmarks' | 'parking';
  coords: [number, number];
  resources: Resource[];
  studyAreas: StudyArea[];
  floorPlanImages?: string[];
  menu?: MenuItem[];
};

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Target',
    slug: 'target',
    history:
      'A retail store located near campus, offering a wide range of products including groceries, electronics, and home goods.',
    hours: '8am-10pm',
    imageSeed: 'target',
    type: 'commercial',
    coords: [40.424130677984, -86.90820390803387],
    resources: [],
    studyAreas: [],
  },
  {
    id: 2,
    name: 'Purdue University Student Health (PUSH)',
    slug: 'push',
    history:
      "Provides medical services, wellness programs, and health education to Purdue students.",
    hours: '8am-5pm',
    imageSeed: 'push',
    type: 'health',
    coords: [40.430395917306384, -86.91604679474194],
    resources: [],
    studyAreas: [],
  },
  {
    id: 3,
    name: 'Hovde Hall of Administration',
    slug: 'hovde-hall',
    history:
      'The central administrative building of Purdue University, housing the offices of the President, Provost, and other key administrators.',
    hours: '8am-5pm',
    imageSeed: 'hovde-hall',
    type: 'administrative',
    coords: [40.42823525631721, -86.91442321218972],
    resources: [
    ],
    studyAreas: [
    ],
  },
  {
    id: 4,
    name: 'University Book Store',
    slug: 'university-book-store',
    history:
      'The official bookstore for Purdue University, providing textbooks, apparel, and other university merchandise.',
    hours: '9am-7pm',
    imageSeed: 'university-book-store',
    type: 'commercial',
    coords: [40.42427442179067, -86.9101781033241],
    resources: [],
    studyAreas: [],
  },
  {
    id: 5,
    name: 'Windsor Dining Court',
    slug: 'windsor-dining',
    history: 'One of the many popular dining courts on campus, offering a wide variety of food choices in a buffet style.',
    hours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    imageSeed: 'windsor-dining',
    type: 'dining',
    coords: [40.42692126717524, -86.92104543237775],
    resources: [
      { name: 'Main Dining Area', type: 'Dining' },
      { name: 'First Floor Restrooms', type: 'Restroom' },
    ],
    studyAreas: [
       { id: 'windsor-dining-tables', name: 'Dining Tables' },
    ],
    menu: [
      { station: 'Homestyle', name: 'Boilermaker Chili' },
      { station: 'Grill', name: 'Grilled Chicken Sandwich' },
      { station: 'Pizzeria', name: 'Assorted Pizzas' },
      { station: 'Salad Bar', name: 'Fresh Salad Bar' },
    ]
  },
  {
    id: 6,
    name: 'Cordova Recreational Sports Center',
    slug: 'corec',
    history: 'The main fitness center on campus, offering multiple gymnasiums, a climbing wall, an Olympic-sized swimming pool, and various courts for different sports. It is a hub for student health and wellness.',
    hours: 'Mon-Fri: 5:30 AM - 11:00 PM, Sat-Sun: 8:00 AM - 10:00 PM',
    imageSeed: 'corec',
    type: 'recreational',
    coords: [40.428311119387104, -86.92235023558634],
    resources: [
      { name: 'Main Gym', type: 'Recreation' },
      { name: 'Aquatics Center', type: 'Recreation' },
      { name: 'Climbing Wall', type: 'Recreation' },
      { name: 'Gaming Room', type: 'Recreation' },
    ],
    studyAreas: [
      { id: 'corec-lounge', name: 'Entrance Lounge' },
    ],
  },
  {
    id: 7,
    name: 'Windsor Residential Hall',
    slug: 'windsor-hall',
    history: 'A group of five residential halls for women, known for its beautiful architecture and close-knit community. Located near the heart of campus, it provides convenient access to academic buildings and dining options.',
    hours: 'Open 24/7 for residents',
    imageSeed: 'windsor-hall',
    type: 'residential',
    coords: [40.42629740605619, -86.92097372795162],
    resources: [
      { name: 'Student Lounges', type: 'Study Area' },
      { name: 'Laundry Rooms', type: 'Utility' },
    ],
    studyAreas: [
      { id: 'windsor-hall-lounge', name: 'Main Lounge' },
      { id: 'windsor-hall-study-rooms', name: 'Floor Study Rooms' },
    ],
  },
  {
    id: 8,
    name: 'Earhart Dining Court',
    slug: 'earhart-dining',
    history: 'A popular dining court on the west side of campus, known for its diverse menu and spacious seating areas. It serves thousands of students daily.',
    hours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    imageSeed: 'earhart-dining',
    type: 'dining',
    coords: [40.425636828666576, -86.925147418208],
    resources: [
      { name: 'Main Dining Area', type: 'Dining' },
      { name: 'Lower Level Restrooms', type: 'Restroom' },
    ],
    studyAreas: [
       { id: 'earhart-dining-tables', name: 'Dining Tables' },
    ],
    menu: [
      { station: 'Wok', name: 'General Tso\'s Chicken' },
      { station: 'Deli', name: 'Custom Sandwiches' },
      { station: 'Pizzeria', name: 'Pepperoni Pizza' },
      { station: 'Desserts', name: 'Ice Cream & Cookies' },
    ]
  },
  {
    id: 9,
    name: 'Earhart Residential Hall',
    slug: 'earhart-hall',
    history: 'A modern residential hall on the west side of campus, offering comfortable living spaces and a vibrant community for students.',
    hours: 'Open 24/7 for residents',
    imageSeed: 'earhart-hall',
    type: 'residential',
    coords: [40.425743223857324, -86.92482259878814],
    resources: [
      { name: 'Student Lounges', type: 'Study Area' },
      { name: 'Laundry Rooms', type: 'Utility' },
    ],
    studyAreas: [
      { id: 'earhart-hall-lounge', name: 'Main Lounge' },
      { id: 'earhart-hall-study-rooms', name: 'Floor Study Rooms' },
    ],
  },
  {
    id: 10,
    name: 'Lawson On-the-GO!',
    slug: 'lawson-on-the-go',
    history: 'A quick-stop cafe located in the Lawson Computer Science Building, offering coffee, snacks, and grab-and-go meals.',
    hours: 'Mon-Fri: 7:30 AM - 5:00 PM',
    imageSeed: 'lawson-on-the-go',
    type: 'dining',
    coords: [40.4275263927613, -86.91698471484223],
    resources: [],
    studyAreas: [],
  },
  {
    id: 11,
    name: 'Lawson Computer Science Building',
    slug: 'lawson-cs-building',
    history: 'Home to the Computer Science department, this building features state-of-the-art labs, classrooms, and collaborative spaces for students and faculty.',
    hours: 'Mon-Fri: 7:00 AM - 10:30 PM',
    imageSeed: 'lawson-cs-building',
    type: 'academic',
    coords: [40.42783210787582, -86.91697848833108],
    resources: [
      { name: 'LWSN B155', type: 'Lecture Hall' },
      { name: 'LWSN B131', type: 'Lab' },
    ],
    studyAreas: [
      { id: 'lawson-atrium', name: 'Lawson Atrium' },
      { id: 'lawson-commons', name: 'Lawson Commons' },
    ],
  },
  {
    id: 12,
    name: 'Wilmeth Active Learning Center (WALC)',
    slug: 'walc',
    history:
      "The Wilmeth Active Learning Center, opened in 2017, integrates library services with active learning classrooms. It is one of the most popular study spots on campus, featuring a variety of seating options, reading rooms and group study rooms. The many classrooms are designed to serve as additional study spaces when not in session.",
    hours: 'Open 24/7',
    imageSeed: 'walc',
    type: 'academic',
    coords: [40.427366571442725, -86.91318063203238],
    floorPlanImages: [
      '/buildings/floor-plans/WALC/WALC_1.jpg',
      '/buildings/floor-plans/WALC/WALC_2.jpg',
      '/buildings/floor-plans/WALC/WALC_3.jpg',
      '/buildings/floor-plans/WALC/WALC_4.jpg'
    ],
    resources: [
      { name: 'Au Bon Pain Cafe', type: 'Dining' },
      { name: 'ITaP Printers', type: 'Printer' },
      { name: 'Data Visualization Lab', type: 'Lab' },
      { name: 'WALC B058 — 102 seats', type: 'Lecture Hall' },
      { name: 'WALC B066 — 84 seats', type: 'Lecture Hall' },
      { name: 'WALC B074 — 102 seats', type: 'Lecture Hall' },
      { name: 'WALC B091 — 72 seats', type: 'Lecture Hall' },
      { name: 'WALC B093 — 72 seats', type: 'Lecture Hall' },
      { name: 'WALC 1018 — 180 seats', type: 'Lecture Hall' },
      { name: 'WALC 1055 — 329 seats', type: 'Lecture Hall' },
      { name: 'WALC 1087 — 108 seats', type: 'Lecture Hall' },
      { name: 'WALC 1121 — 72 seats', type: 'Lecture Hall' },
      { name: 'WALC 1132 — 108 seats', type: 'Lecture Hall' },
      { name: 'WALC 2007 — 90 seats', type: 'Lecture Hall' },
      { name: 'WALC 2051 — 72 seats', type: 'Lecture Hall' },
      { name: 'WALC 2087 — 126 seats', type: 'Lecture Hall' },
      { name: 'WALC 2088 — 66 seats', type: 'Lecture Hall' },
      { name: 'WALC 2121 — 40 seats', type: 'Lecture Hall' },
      { name: 'WALC 2124 — 54 seats', type: 'Lecture Hall' },
      { name: 'WALC 2127 — 45 seats', type: 'Lecture Hall' },
      { name: 'WALC 3084 — 40 seats', type: 'Lecture Hall' },
      { name: 'WALC 3087 — 126 seats', type: 'Lecture Hall' },
      { name: 'WALC 3090 — 60 seats', type: 'Lecture Hall' },
      { name: 'WALC 3121 — 40 seats', type: 'Lecture Hall' },
      { name: 'WALC 3122 — 54 seats', type: 'Lecture Hall' },
      { name: 'WALC 3127 — 45 seats', type: 'Lecture Hall' },
      { name: 'WALC 3132 — 40 seats', type: 'Lecture Hall' },
      { name: 'WALC 3138 — 50 seats', type: 'Lecture Hall' },
      { name: 'WALC 3148 — 40 seats', type: 'Lecture Hall' },
      { name: 'WALC 3154 — 50 seats', type: 'Lecture Hall' },
    ],
    studyAreas: [
      { id: 'walc-reading-room', name: '2nd Floor Reading Room' },
      { id: 'walc-group-study', name: 'Group Study Rooms' },
      { id: 'walc-individual-desks', name: 'Individual Desks (Floors 2-4)' },
    ],
  },
  {
    id: 13,
    name: 'Purdue Memorial Union',
    slug: 'pmu',
    history:
      'A historic landmark, the Purdue Memorial Union serves as the community center of the university. It offers dining, recreation, study spaces, and hosts numerous events. The ground floor was recently renovated into a modern food court.',
    hours: 'Mon-Sun: 6:00 AM - 12:00 AM',
    imageSeed: 'pmc',
    type: 'recreational',
    coords: [40.4247221974453, -86.91066275491045],
    resources: [
      { name: 'Atlas Family Marketplace', type: 'Dining' },
      { name: 'Boilermaker Billiards', type: 'Recreation' },
      { name: 'Main Information Desk', type: 'Printer' },
      { name: 'Gaming Room', type: 'Recreation' },
      { name: 'Bowling Alley', type: 'Recreation' },
    ],
    studyAreas: [
      { id: 'pmu-great-hall', name: 'Great Hall' },
      { id: 'pmu-fireplace-lounges', name: 'Fireplace Lounges' },
      { id: 'pmu-south-tower', name: 'South Tower Reading Rooms' },
    ],
  },
  {
    id: 14,
    name: 'Stewart Center',
    slug: 'stewart-center',
    history:
      'Stewart Center is a primary hub for student services and academic support. It contains a library, computer labs, large lecture halls, and the Purdue box office.',
    hours: 'Mon-Fri: 7:00 AM - 11:00 PM',
    imageSeed: 'stewart-center',
    type: 'academic',
    coords: [40.425055070016015, -86.91293860304113],
    resources: [
      { name: 'STEW 183', type: 'Lecture Hall' },
      { name: 'ITaP Lab', type: 'Lab' },
      { name: 'Ground Floor Restrooms', type: 'Restroom' },
    ],
    studyAreas: [
      { id: 'stew-hsse-library', name: 'HSSE Library' },
      { id: 'stew-underground', name: 'Underground Lounges' },
    ],
  },
  {
    id: 15,
    name: 'Neil Armstrong Hall of Engineering',
    slug: 'neil-armstrong-hall',
    history:
      'Opened in 2007, this building is named after Purdue alumnus Neil Armstrong, the first person to walk on the Moon. It serves as a gateway to the engineering campus and houses various administrative offices and labs.',
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM',
    imageSeed: 'neil-armstrong-hall',
    type: 'academic',
    coords: [40.43101264434171, -86.91488821940945],
    resources: [
      { name: 'ARMS 1010', type: 'Lecture Hall' },
      { name: 'ARMS B061', type: 'Lab' },
      { name: 'First Floor Restrooms', type: 'Restroom' },
    ],
    studyAreas: [
      { id: 'arms-atrium', name: 'Main Atrium' },
      { id: 'arms-upper-lounges', name: 'Upper Floor Lounges' },
    ],
  },
  {
    id: 16,
    name: 'Engineering Fountain',
    slug: 'engineering-fountain',
    history: 'A popular landmark and meeting spot located in the heart of the engineering campus.',
    hours: '24/7',
    imageSeed: 'engineering-fountain',
    type: 'landmarks',
    coords: [40.42865834705861, -86.91379024545822],
    resources: [],
    studyAreas: [],
  },
  {
    id: 17,
    name: 'Purdue Bell Tower',
    slug: 'purdue-bell-tower',
    history: 'A 160-foot tall bell tower located in the heart of Purdue University\'s campus in West Lafayette, Indiana. It was a gift from the class of 1948 and is one of the most recognizable landmarks of the university.',
    hours: '24/7',
    imageSeed: 'purdue-bell-tower',
    type: 'landmarks',
    coords: [40.42728623668679, -86.91406851181529],
    resources: [],
    studyAreas: [],
  },
  {
    id: 18,
    name: 'University Street Parking Garage (PGU)',
    slug: 'university-street-parking-garage',
    history: 'A multi-level parking garage providing parking for students, faculty, staff, and visitors.',
    hours: '24/7',
    imageSeed: 'university-street-parking-garage',
    type: 'parking',
    coords: [40.42659257853021, -86.91728429809281],
    resources: [],
    studyAreas: [],
  }
];

    