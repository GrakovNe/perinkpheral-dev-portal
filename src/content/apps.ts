// The official applications as the landing page shows them: the icon each
// brings in its manifest, 11 rows of 11 cells, '#' for ink.

export type App = { name: string; title: string; text: string; icon: string[] }

export const APPS: App[] = [
  {
    name: 'weather',
    title: 'Weather',
    text: 'Now and the next days, for your city.',
    icon: ['...#.......', '.#...#.....', '...##......', '#.####.....', '..####.###.', '...#.######', '.....######', '...########', '..#########', '..#########', '...#######.'],
  },
  {
    name: 'calendar',
    title: 'Calendar',
    text: 'Upcoming events and reminders from your calendar.',
    icon: ['..#.....#..', '.#########.', '.#########.', '.#.......#.', '.#.#.#.#.#.', '.#.......#.', '.#.#.#.#.#.', '.#.......#.', '.#.#.#...#.', '.#.......#.', '.#########.'],
  },
  {
    name: 'stocks',
    title: 'Stocks',
    text: 'Prices and day charts for the tickers you follow.',
    icon: ['...........', '.........#.', '........##.', '.......#.#.', '..#...#..#.', '.#.#.#...#.', '#...#....#.', '#........#.', '#........#.', '##########.', '...........'],
  },
  {
    name: 'ha',
    title: 'Home Assistant',
    text: 'Your smart home sensors on one screen.',
    icon: ['.....#.....', '....###....', '...#####...', '..#######..', '.#########.', '###########', '.##.....##.', '.##.###.##.', '.##.###.##.', '.##.###.##.', '.#########.'],
  },
  {
    name: 'clock',
    title: 'Clock',
    text: 'Large time and date, readable across the room.',
    icon: ['...#####...', '..#.....#..', '.#...#...#.', '#....#....#', '#....#....#', '#....###..#', '#.........#', '#.........#', '.#.......#.', '..#.....#..', '...#####...'],
  },
  {
    name: 'sun',
    title: 'Sun and Moon',
    text: 'Sunrise, sunset, day length and moon phase.',
    icon: ['...........', '.....#.....', '.#.......#.', '...........', '....###....', '...#...#...', '##.#...#.##', '...#...#...', '###########', '...........', '...........'],
  },
  {
    name: 'timer',
    title: 'Timer',
    text: 'A countdown that alerts you in any app.',
    icon: ['.#########.', '.#########.', '..#.....#..', '...#...#...', '....#.#....', '.....#.....', '....#.#....', '...#...#...', '..#..#..#..', '.#########.', '.#########.'],
  },
  {
    name: 'stopwatch',
    title: 'Stopwatch',
    text: 'Start and stop with a button.',
    icon: ['....###....', '.....#.....', '...#####...', '..#.....#..', '.#...#...#.', '.#...#...#.', '.#...###.#.', '.#.......#.', '.#.......#.', '..#.....#..', '...#####...'],
  },
]
