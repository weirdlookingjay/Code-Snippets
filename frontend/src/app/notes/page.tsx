export default function NotesPage() {
  return (
    <section className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Notes</h1>
      <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">No notes yet. Click &quot;New Note&quot; to create your first note.</div>
      </div>
    </section>
  );
}
