export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Notion Clone
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Advanced note-taking app with hierarchical organization
        </p>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-700">
            Welcome to your Notion clone. This is the foundation of your advanced note-taking application.
          </p>
        </div>
      </main>
    </div>
  );
}