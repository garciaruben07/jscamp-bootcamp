export function SearchFormSection({ searchInput, filters, onSearchInputChange, onFilterChange }) {
  /* La búsqueda es en vivo: dejar que Enter envíe el formulario recargaría la página */
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form id="empleos-search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-bar">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          <input
            id="empleos-search-input"
            type="text"
            name="search-value"
            placeholder="Buscar trabajos, empresas o habilidades"
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
          />
        </div>

        <div className="search-filters">
          <select
            name="technology-value"
            id="filter-technology"
            value={filters.technology}
            onChange={(event) => onFilterChange('technology', event.target.value)}
          >
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <select
            name="location-value"
            id="filter-location"
            value={filters.location}
            onChange={(event) => onFilterChange('location', event.target.value)}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select
            name="experience-level-value"
            id="filter-experience-level"
            value={filters.level}
            onChange={(event) => onFilterChange('level', event.target.value)}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </form>

      <span id="filter-selected-value"></span>
    </section>
  )
}
