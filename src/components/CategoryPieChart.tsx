import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface CategoryPieChartProps {
    label: string;
    score: number;
}

const COLORS = ['#10b981', '#e5e7eb']; // verde e cinza claro

export default function CategoryPieChart({ label, score }: CategoryPieChartProps) {
    const data = [
        { name: label, value: score },
        { name: 'Faltando', value: 100 - score }
    ];

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <p className="text-center font-semibold mt-2">{label}: {score}</p>
        </div>
    );
}