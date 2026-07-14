export default function InvalidLinkPage() {
  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Invalid or expired link</h1>
      <p className="text-gray-600">
        This review link is no longer valid. Please contact the person who invited you for a new one.
      </p>
    </main>
  );
}
