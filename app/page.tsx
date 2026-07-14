export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center p-6">
      <h1 className="text-2xl font-semibold mb-2">Interview Portal</h1>
      <p className="text-gray-600 max-w-md">
        Reviewers should use the invite link they were sent. Admins can sign in at{" "}
        <a href="/admin" className="text-blue-600 underline">
          /admin
        </a>
        .
      </p>
    </main>
  );
}
