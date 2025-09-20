
export type Resource = {
  name: string;
  type: 'Lecture Hall' | 'Lab' | 'Study Area' | 'Restroom' | 'Dining' | 'Printer';
};

export type StudyArea = {
  id: string;
  name:string;
};

export type Building = {
  id: number;
  name: string;
  slug: string;
  history: string;
  hours: string;
  imageSeed: string;
  type: 'academic' | 'residential' | 'other' | 'recreational';
  coords: [number, number];
  resources: Resource[];
  studyAreas: StudyArea[];
  floorPlanImages?: string[];
};

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Neil Armstrong Hall of Engineering',
    slug: 'neil-armstrong-hall',
    history:
      'Opened in 2007, this building is named after Purdue alumnus Neil Armstrong, the first person to walk on the Moon. It serves as a gateway to the engineering campus and houses various administrative offices and labs.',
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM',
    imageSeed: 'neil-armstrong-hall',
    type: 'academic',
    coords: [40.4287, -86.9137],
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
    id: 2,
    name: 'Wilmeth Active Learning Center (WALC)',
    slug: 'walc',
    history:
      'The Wilmeth Active Learning Center, opened in 2017, integrates library services with active learning classrooms. It is one of the most popular study spots on campus, featuring a variety of seating options and group study rooms.',
    hours: 'Open 24/7',
    imageSeed: 'walc',
    type: 'academic',
    coords: [40.4277, -86.9152],
    floorPlanImages: [
      '/buildings/floor-plans/WALC/WALC_1.jpg',
      '/buildings/floor-plans/WALC/WALC_2.jpg',
      '/buildings/floor-plans/WALC/WALC_3.jpg',
      '/buildings/floor-plans/WALC/WALC_4.jpg'
    ],
    resources: [
      { name: 'WALC 1055', type: 'Lecture Hall' },
      { name: 'Data Visualization Lab', type: 'Lab' },
      { name: '3rd Floor Printers', type: 'Printer' },
      { name: 'Au Bon Pain', type: 'Dining' },
    ],
    studyAreas: [
      { id: 'walc-reading-room', name: '2nd Floor Reading Room' },
      { id: 'walc-group-study', name: 'Group Study Rooms' },
      { id: 'walc-individual-desks', name: 'Individual Desks (Floors 2-4)' },
    ],
  },
  {
    id: 3,
    name: 'Purdue Memorial Union',
    slug: 'pmc',
    history:
      'A historic landmark, the Purdue Memorial Union serves as the community center of the university. It offers dining, recreation, study spaces, and hosts numerous events. The ground floor was recently renovated into a modern food court.',
    hours: 'Mon-Sun: 6:00 AM - 12:00 AM',
    imageSeed: 'pmc',
    type: 'other',
    coords: [40.4248, -86.9103],
    resources: [
      { name: 'Atlas Family Marketplace', type: 'Dining' },
      { name: 'Boilermaker Billiards', type: 'Restroom' },
      { name: 'Main Information Desk', type: 'Printer' },
    ],
    studyAreas: [
      { id: 'pmc-great-hall', name: 'Great Hall' },
      { id: 'pmc-fireplace-lounges', name: 'Fireplace Lounges' },
      { id: 'pmc-south-tower', name: 'South Tower Reading Rooms' },
    ],
  },
  {
    id: 4,
    name: 'Stewart Center',
    slug: 'stewart-center',
    history:
      'Stewart Center is a primary hub for student services and academic support. It contains a library, computer labs, large lecture halls, and the Purdue box office.',
    hours: 'Mon-Fri: 7:00 AM - 11:00 PM',
    imageSeed: 'stewart-center',
    type: 'academic',
    coords: [40.4243, -86.9122],
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
    id: 5,
    name: 'Windsor Dining Court',
    slug: 'windsor-dining',
    history: 'One of the many popular dining courts on campus, offering a wide variety of food choices in a buffet style.',
    hours: 'Mon-Sun: 7:00 AM - 9:00 PM',
    imageSeed: 'windsor-dining',
    type: 'other',
    coords: [40.4258, -86.9208],
    resources: [
      { name: 'Main Dining Area', type: 'Dining' },
      { name: 'First Floor Restrooms', type: 'Restroom' },
    ],
    studyAreas: [
       { id: 'windsor-dining-tables', name: 'Dining Tables' },
    ],
  },
  {
    id: 6,
    name: 'Cordova Recreational Sports Center',
    slug: 'corec',
    history: 'The main fitness center on campus, offering multiple gymnasiums, a climbing wall, an Olympic-sized swimming pool, and various courts for different sports. It is a hub for student health and wellness.',
    hours: 'Mon-Fri: 5:30 AM - 11:00 PM, Sat-Sun: 8:00 AM - 10:00 PM',
    imageSeed: 'corec',
    type: 'recreational',
    coords: [40.4248, -86.9224],
    resources: [
      { name: 'Main Gym', type: 'Study Area' },
      { name: 'Aquatics Center', type: 'Restroom' },
      { name: 'Climbing Wall', type: 'Study Area' },
    ],
    studyAreas: [
      { id: 'corec-lounge', name: 'Entrance Lounge' },
    ],
  },
  {
    id: 7,
    name: 'Windsor Hall',
    slug: 'windsor-hall',
    history: 'A group of five residential halls for women, known for its beautiful architecture and close-knit community. Located near the heart of campus, it provides convenient access to academic buildings and dining options.',
    hours: 'Open 24/7 for residents',
    imageSeed: 'windsor-hall',
    type: 'residential',
    coords: [40.4263, -86.9209],
    resources: [
      { name: 'Student Lounges', type: 'Study Area' },
      { name: 'Laundry Rooms', type: 'Restroom' },
    ],
    studyAreas: [
      { id: 'windsor-hall-lounge', name: 'Main Lounge' },
      { id: 'windsor-hall-study-rooms', name: 'Floor Study Rooms' },
    ],
  },
];
