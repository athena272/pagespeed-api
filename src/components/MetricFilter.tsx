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
        <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Selecionar métrica:</label>
            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full max-w-xs"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}