/* Aquí va la lógica para mostrar los resultados de búsqueda */

const jobsList = document.querySelector('.jobs-listings')

fetch('./data.json')
  .then((response) => {
    if (!response.ok) throw new Error(`No se pudo cargar data.json (${response.status})`)

    return response.json()
  })
  .then((jobs) => {
    jobs.forEach((job) => {
      const listItem = document.createElement('li')
      const article = document.createElement('article')

      article.className = 'job-listing-card'
      article.dataset.technology = job.data.technology.join(' ')
      article.dataset.modalidad = job.data.modalidad
      article.dataset.nivel = job.data.nivel
      article.innerHTML = `
        <div>
          <h3>${job.titulo}</h3>
          <small>${job.empresa} <span aria-hidden="true">|</span> ${job.ubicacion}</small>
          <p>${job.descripcion}</p>
        </div>
        <button
          class="button-apply-job"
          aria-label="Aplicar a la oferta de ${job.titulo} en ${job.empresa}"
        >
          Aplicar
        </button>
      `

      listItem.appendChild(article)
      jobsList.appendChild(listItem)
    })
  })
  .catch((error) => {
    jobsList.innerHTML = '<li><p>No se pudieron cargar los empleos. Vuelve a intentarlo más tarde.</p></li>'
    console.error(error)
  })
