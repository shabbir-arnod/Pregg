function DashboardScreen({ state, onNavigate }) {
  const { CTARow, StatCard, TrendChart, Blob } = window.PreggDesignSystem_bd552d;
  const { getPregnancyWeek, getBabySize, getBabyEmoji, formatDisplayDate, todayISO } = window.PreggKit;
  const week = getPregnancyWeek();
  const todaysReminders = state.reminders;
  const doneCount = todaysReminders.filter((r) => r.done).length;
  const latestBP = state.bp[state.bp.length - 1];
  const latestWeight = state.weight[state.weight.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Hello 👋</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '2px 0 0' }}>{formatDisplayDate(todayISO())}</p>
      </div>

      <div
        onClick={() => onNavigate('baby')}
        style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: '16px 20px', cursor: 'pointer' }}
      >
        <Blob size={48}>{getBabyEmoji()}</Blob>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{`Week ${week} · Trimester 2`}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{`About the size of ${getBabySize()} · 112 days to go`}</div>
        </div>
        <span style={{ color: 'var(--slate-300)' }}>→</span>
      </div>

      <CTARow
        icon={<span style={{ fontSize: 18 }}>✓</span>}
        title="Today's reminders"
        subtitle={`${doneCount} of ${todaysReminders.length} done`}
        onClick={() => onNavigate('reminders')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <StatCard icon={<span style={{ color: 'var(--rose-400)' }}>♥</span>} label="Blood Pressure" value={`${latestBP.systolic}/${latestBP.diastolic}`} unit="mmHg" onClick={() => onNavigate('bp')}>
          <TrendChart
            data={state.bp.map((r) => ({ date: r.date, systolic: r.systolic, diastolic: r.diastolic }))}
            series={[{ key: 'systolic', label: 'Systolic', color: '#7c4a68' }, { key: 'diastolic', label: 'Diastolic', color: '#8b5cf6' }]}
            height={110}
          />
        </StatCard>
        <StatCard icon={<span style={{ color: 'var(--rose-400)' }}>⚖</span>} label="Weight" value={latestWeight.weight} unit={state.weightUnit} onClick={() => onNavigate('weight')}>
          <TrendChart data={state.weight.map((r) => ({ date: r.date, weight: r.weight }))} series={[{ key: 'weight', label: 'Weight', color: '#7c4a68' }]} height={110} />
        </StatCard>
      </div>
    </div>
  );
}

window.PreggKit.DashboardScreen = DashboardScreen;
