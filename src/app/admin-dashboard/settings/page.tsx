export default function SettingsPage() {
  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings & Rules</h1>
        <p className="text-muted-foreground">
          Configure system settings and rules
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">
          Settings and rules content will be displayed here
        </p>
      </div>
    </div>
  );
}
