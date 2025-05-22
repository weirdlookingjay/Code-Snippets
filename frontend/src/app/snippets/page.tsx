export default function SnippetsPage() {
  return (
    <section className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Code Snippets</h1>
      <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">No snippets yet. Click &quot;New Snippet&quot; to create your first snippet.</div>
      </div>
    </section>
  );
}
