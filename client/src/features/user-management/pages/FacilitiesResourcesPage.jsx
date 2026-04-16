import '../styles/SectionPages.css';

export const FacilitiesResourcesPage = () => {
  const resources = [];

  return (
    <section className="section-page">
      <div className="section-header">
        <h2>Facilities & Resources</h2>
        <p>Browse campus spaces and resource availability.</p>
      </div>

      <div className="content-card">
        <table className="section-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 && (
              <tr>
                <td colSpan={3}>No facilities/resources data available.</td>
              </tr>
            )}
            {resources.map((resource) => (
              <tr key={resource.name}>
                <td>{resource.name}</td>
                <td>{resource.type}</td>
                <td>
                  <span className={`status-chip ${resource.availability === 'Available' ? 'ok' : 'warn'}`}>
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
