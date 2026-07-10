  import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

    import { Pie, Bar, Line } from "react-chartjs-2";
    import "./DashboardCharts.css";

    ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
    );

    function DashboardCharts({ persons }) {
    const missing = persons.filter(
        (p) => p.status === "Missing"
    ).length;

    const found = persons.filter(
        (p) => p.status === "Found"
    ).length;

    const totalCases = persons.length;

    const male = persons.filter(
        (p) => p.gender === "Male"
    ).length;

    const female = persons.filter(
        (p) => p.gender === "Female"
    ).length;

    const other = persons.filter(
        (p) => p.gender === "Other"
    ).length;

    const statusData = {
        labels: ["Missing", "Found"],
        datasets: [
        {
            data: [missing, found],
            backgroundColor: [
            "#ef4444",
            "#22c55e",
            ],
        },
        ],
    };

    const genderData = {
        labels: ["Male", "Female", "Other"],
        datasets: [
        {
            label: "Persons",
            data: [male, female, other],
            backgroundColor: [
            "#3b82f6",
            "#ec4899",
            "#a855f7",
            ],
        },
        ],
    };

 const monthlyData = persons.reduce((months, person) => {
  const month = new Date(person.createdAt).getMonth();
  months[month]++;
  return months;
}, Array(12).fill(0));


    const registrationData = {
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
   datasets: [
  {
    label: "Registrations",
    data: monthlyData,
    borderColor: "#60A5FA",
    backgroundColor: "#60A5FA",
    tension: 0.4,
    fill: true,
  },
],
    };

    return (
        <div className="charts-container">
        <div className="chart-card">
            <h2>Status Distribution</h2>

            <Pie data={statusData} />
        </div>

        <div className="chart-card">
            <h2>Gender Distribution</h2>

        <Bar
    data={genderData}
    options={{
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false,
        },
        },
        scales: {
        x: {
            beginAtZero: true,
            ticks: {
            precision: 0,
            },
        },
        },
    }}
    />

           
        </div>

        <div className="chart-card full-width">
    <h2>Cases Registered Per Month</h2>

    <Line
        data={registrationData}
        options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            display: false,
            },
        },
        scales: {
            y: {
            beginAtZero: true,
            ticks: {
                precision: 0,
            },
            },
        },
        }}
    />
    </div>

     {totalCases < 5 && (
    <p className="chart-note">
        Register more cases to unlock richer analytics.
    </p>
    )}
        </div>
    );
    }

    export default DashboardCharts;