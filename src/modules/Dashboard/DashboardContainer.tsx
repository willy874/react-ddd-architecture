import DashboardView from './DashboardView'

const data = [
  {
    score: 400,
    count: 100,
  },
  {
    score: 450,
    count: 200,
  },
  {
    score: 500,
    count: 300,
  },
  {
    score: 550,
    count: 1000,
  },
  {
    score: 600,
    count: 2000,
  },
  {
    score: 650,
    count: 4500,
  },
  {
    score: 700,
    count: 5000,
  },
  {
    score: 750,
    count: 6000,
  },
  {
    score: 800,
    count: 8000,
  },
  {
    score: 850,
    count: 9000,
  },
  {
    score: 900,
    count: 10000,
  },
  {
    score: 950,
    count: 11000,
  },
  {
    score: 1000,
    count: 12000,
  },
  {
    score: 1050,
    count: 13000,
  },
  {
    score: 1100,
    count: 14000,
  },
  {
    score: 1150,
    count: 14500,
  },
  {
    score: 1200,
    count: 15000,
  },
  {
    score: 1250,
    count: 15500,
  },
  {
    score: 1300,
    count: 16000,
  },
  {
    score: 1350,
    count: 12000,
  },
  {
    score: 1400,
    count: 4000,
  },
  {
    score: 1450,
    count: 3000,
  },
  {
    score: 1500,
    count: 2000,
  },
  {
    score: 1550,
    count: 1000,
  },
  {
    score: 1600,
    count: 100,
  },
]

const data2 = [
  {
    type: 'Reading',
    max: 400,
    min: 100,
    current: 320,
  },
  {
    type: 'Writing',
    max: 400,
    min: 100,
    current: 320,
  },
]

export default function Dashboard() {
  return (
    <DashboardView
      currentScore={1350}
      ranking={94}
      sat={data}
      performance={data2}
    />
  )
}
