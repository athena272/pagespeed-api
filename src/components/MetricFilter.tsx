import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface MetricFilterProps {
    selected: string;
    onChange: (metric: string) => void;
}

export default function MetricFilter({ selected, onChange }: MetricFilterProps) {
    const options = [
        { label: 'Desempenho', value: 'performance' },
        { label: 'Acessibilidade', value: 'accessibility' },
        { label: 'Práticas', value: 'best-practices' },
        { label: 'SEO', value: 'seo' }
    ];

    return (
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
            <InputLabel id="metric-select-label">Selecionar métrica</InputLabel>
            <Select
                labelId="metric-select-label"
                value={selected}
                label="Selecionar métrica"
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                        {o.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}