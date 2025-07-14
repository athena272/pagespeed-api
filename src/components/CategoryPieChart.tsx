import { Paper, Typography } from '@mui/material';
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
        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
            <div style={{ width: '100%', height: 220 }}>
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
            </div>
            <Typography variant="subtitle1" fontWeight={600} mt={2}>
                {label}: {score}
            </Typography>
        </Paper>
    );
}