export const FacilitiesResourcesPage = () => {
  const resources = [];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-900">Facilities & Resources</h2>
        <p className="text-gray-600 mt-2">Browse campus spaces and resource availability.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Resource</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {resources.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No facilities/resources data available.
                </td>
              </tr>
            )}
            {resources.map((resource) => (
              <tr key={resource.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{resource.name}</td>
                <td className="px-6 py-4 text-gray-600">{resource.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      resource.availability === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {resource.availability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
