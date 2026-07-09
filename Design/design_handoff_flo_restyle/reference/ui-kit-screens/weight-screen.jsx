function WeightScreen({ state, setState }) {
  const { Button, TrendChart, Badge, Modal, Input, PillToggle } = window.PreggDesignSystem_bd552d;
  const { formatDisplayDate } = window.PreggKit;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [weight, setWeight] = React.useState('');

  const first = state.weight[0];
  const latest = state.weight[state.weight.length - 1];
  const change = (latest.weight - first.weight).toFixed(1);

  function addReading(e) {
    e.preventDefault();
    if (!weight) return;
    setState((s) => ({ ...s, weight: [...s.weight, { id: 'w' + Date.now(), date: window.PreggKit.todayISO(), weight: Number(weight) }] }));
    setWeight('');
    setModalOpen(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Weight</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>+ Log weight</Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PillToggle options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} value={state.weightUnit} onChange={(u) => setState((s) => ({ ...s, weightUnit: u }))} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: '16px 20px' }}>
        <span style={{ fontSize: 24 }}>⚖</span>
        <div>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
            {latest.weight} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--text-muted)' }}>{state.weightUnit}</span>
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>Latest · {formatDisplayDate(latest.date)}</p>
        </div>
        <Badge tone={change > 0 ? 'elevated' : 'info'} style={{ marginLeft: 'auto' }}>
          {change > 0 ? '+' : ''}{change} {state.weightUnit} total
        </Badge>
      </div>

      <section style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: 16 }}>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-500)', margin: '0 0 12px' }}>Trend</h2>
        <TrendChart data={state.weight.map((r) => ({ date: r.date, weight: r.weight }))} series={[{ key: 'weight', label: `Weight (${state.weightUnit})`, color: '#7c4a68' }]} />
      </section>

      {modalOpen && (
        <Modal title="Log weight" onClose={() => setModalOpen(false)}>
          <form onSubmit={addReading} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input type="number" step="0.1" placeholder={`Weight (${state.weightUnit})`} value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Button type="submit" variant="primary" fullWidth>Save entry</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

window.PreggKit.WeightScreen = WeightScreen;
