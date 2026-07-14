export default function ReviewDonePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="card max-w-md p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
          ✓
        </div>
        <h1 className="text-xl font-semibold mb-2">All done</h1>
        <p className="text-slate-500">
          Thanks for reviewing — there are no more responses waiting for your feedback right now.
        </p>
      </div>
    </main>
  );
}
