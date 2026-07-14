export default function InvalidLinkPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="card max-w-md p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600">
          !
        </div>
        <h1 className="text-xl font-semibold mb-2">Invalid or expired link</h1>
        <p className="text-slate-500">
          This review link is no longer valid. Please contact the person who invited you for a new one.
        </p>
      </div>
    </main>
  );
}
