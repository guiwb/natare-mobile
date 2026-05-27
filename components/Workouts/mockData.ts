import dayjs from 'dayjs';

export type WorkoutStatus = 'scheduled' | 'completed' | 'missed';

export type Workout = {
  id: string;
  name: string;
  icon: string;
  status: WorkoutStatus;
  datetime: Date;
  distance?: number;
  duration: number;
};

const d = (daysOffset: number, hour: number, minute = 0): Date =>
  dayjs().add(daysOffset, 'day').hour(hour).minute(minute).second(0).toDate();

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Nado de resistência',
    icon: 'swim',
    status: 'scheduled',
    datetime: d(0, 18, 0),
    distance: 2.5,
    duration: 60,
  },
  {
    id: '2',
    name: 'Condicionamento',
    icon: 'dumbbell',
    status: 'scheduled',
    datetime: d(1, 7, 0),
    distance: 1,
    duration: 45,
  },
  {
    id: '3',
    name: 'Tiros de velocidade',
    icon: 'swim',
    status: 'completed',
    datetime: d(-1, 17, 30),
    distance: 1.8,
    duration: 40,
  },
  {
    id: '4',
    name: 'Nado regenerativo',
    icon: 'swim',
    status: 'missed',
    datetime: d(-7, 9, 0),
    distance: 1.5,
    duration: 30,
  },
  {
    id: '5',
    name: 'Águas abertas',
    icon: 'swim',
    status: 'completed',
    datetime: d(-3, 6, 30),
    distance: 3.2,
    duration: 75,
  },
  {
    id: '6',
    name: 'Core e alongamento',
    icon: 'human',
    status: 'missed',
    datetime: d(-14, 8, 0),
    duration: 30,
  },
  {
    id: '7',
    name: 'Nado em ritmo',
    icon: 'swim',
    status: 'scheduled',
    datetime: d(3, 16, 0),
    distance: 2.0,
    duration: 50,
  },
  {
    id: '8',
    name: 'Circuito de força',
    icon: 'dumbbell',
    status: 'completed',
    datetime: d(-10, 10, 0),
    duration: 60,
  },
];
