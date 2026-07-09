function SettingsScreen({ state, setState }) {
  const { Button, PillToggle } = window.PreggDesignSystem_bd552d;
  const sectionStyle = { borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: '#fff', padding: 20 };
  const h2Style = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-600)', margin: '0 0 8px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>Settings</h1>

      <section style={sectionStyle}>
        <h2 style={h2Style}>🔔 Notifications</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--emerald-600)', margin: 0 }}>Notifications are enabled. You'll be alerted while the app is open.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Weight unit</h2>
        <PillToggle options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} value={state.weightUnit} onChange={(u) => setState((s) => ({ ...s, weightUnit: u }))} />
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Backup & restore</h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 12px' }}>
          Your data is saved to your account and follows you when you sign in elsewhere. Export a copy anytime as an extra backup.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary">⭳ Export</Button>
          <Button variant="secondary">⭱ Import</Button>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Account</h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 12px' }}>Signed in as jane@example.com</p>
        <Button variant="secondary">⎋ Log out</Button>
      </section>
    </div>
  );
}

window.PreggKit.SettingsScreen = SettingsScreen;
