export function TempContent() {
  return (
    <div className="max-w-2xl mx-auto">
      {Array.from({ length: 20 }).map((_, index) => (
        <section key={index} className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Section {index + 1}</h2>
          <p className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>
      ))}
    </div>
  );
} 