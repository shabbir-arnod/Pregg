function bpCategory(systolic, diastolic) {
  if (systolic >= 140 || diastolic >= 90) return { label: 'High', tone: 'high' };
  if (systolic >= 130 || diastolic >= 85) return { label: 'Elevated', tone: 'elevated' };
  return { label: 'Normal', tone: 'normal' };
}

function BloodPressureScreen({ state, setState }) {
  const { Button, TrendChart, Badge, Modal, Input, IconButton } = window.PreggDesignSystem_bd552d;
  const { formatDisplayDate } = window.PreggKit;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({ systolic: '', diastolic: '', pulse: '' });

  const latest = state.bp[state.bp.length - 1];
  const cat = bpCategory(latest.systolic, latest.diastolic);

  function addReading(e) {
    e.preventDefault();
    if (!form.systolic || !form.diastolic) return;
    setState((s) => ({
      ...s,
      bp: [...s.bp, { id: 'b' + Date.now(), date: window.PreggKit.todayISO(), time: '09:00', systolic: Number(form.systolic), diastolic: Number(form.diastolic), pulse: Number(form.pulse) || undefined }],
    }));
    setForm({ systolic: '', diastolic: '', pulse: '' });
    setModalOpen(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Blood Pressure</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>+ Log reading</Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: '16px 20px' }}>
        <span style={{ fontSize: 24 }}>♥</span>
        <div>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
            {latest.systolic}/{latest.diastolic} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--text-muted)' }}>mmHg</span>
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>Latest · {formatDisplayDate(latest.date)}</p>
        </div>
        <Badge tone={cat.tone} style={{ marginLeft: 'auto' }}>{cat.label}</Badge>
      </div>

      <section style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: 16 }}>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-500)', margin: '0 0 12px' }}>Trend</h2>
        <TrendChart
          data={state.bp.map((r) => ({ date: r.date, systolic: r.systolic, diastolic: r.diastolic }))}
          series={[{ key: 'systolic', label: 'Systolic', color: '#7c4a68' }, { key: 'diastolic', label: 'Diastolic', color: '#8b5cf6' }]}
        />
      </section>

      <section>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-500)', margin: '0 0 8px' }}>History</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0 }}>
          {state.bp.slice().reverse().map((r) => {
            const c = bpCategory(r.systolic, r.diastolic);
            return (
              <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: '12px 16px', listStyle: 'none' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: 'var(--text-heading)', margin: 0 }}>{r.systolic}/{r.diastolic} mmHg{r.pulse ? ` · ${r.pulse} bpm` : ''}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>{formatDisplayDate(r.date)} · {r.time}</p>
                </div>
                <Badge tone={c.tone}>{c.label}</Badge>
              </li>
            );
          })}
        </ul>
      </section>

      {modalOpen && (
        <Modal title="Log blood pressure" onClose={() => setModalOpen(false)}>
          <form onSubmit={addReading} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Input type="number" placeholder="Systolic" value={form.systolic} onChange={(e) => setForm((f) => ({ ...f, systolic: e.target.value }))} />
              <Input type="number" placeholder="Diastolic" value={form.diastolic} onChange={(e) => setForm((f) => ({ ...f, diastolic: e.target.value }))} />
              <Input type="number" placeholder="Pulse" value={form.pulse} onChange={(e) => setForm((f) => ({ ...f, pulse: e.target.value }))} />
            </div>
            <Button type="submit" variant="primary" fullWidth>Save reading</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

window.PreggKit.BloodPressureScreen = BloodPressureScreen;
