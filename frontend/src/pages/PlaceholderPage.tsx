export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-300">{description}</p>
    </section>
  );
}
