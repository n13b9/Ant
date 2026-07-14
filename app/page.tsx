export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center p-6">
      <div className="card max-w-md p-10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
          ✦
        </div>
        <h1 className="text-2xl font-semibold mb-2">Interview Portal</h1>
        <p className="text-slate-500 leading-relaxed">
          Reviewers should use the invite link they were sent. Admins can sign in at{" "}
          <a href="/admin" className="text-indigo-600 font-medium hover:underline">
            /admin
          </a>
          .
        </p>
      </div>
    </main>
  );
}
