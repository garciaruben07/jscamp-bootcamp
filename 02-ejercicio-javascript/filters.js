/* Aquí va la lógica para filtrar los resultados de búsqueda */

const searchForm = document.querySelector('#empleos-search-form')
const jobsList = document.querySelector('.jobs-listings')

const filterJobs = () => {
  const filters = new FormData(searchForm)
  const technology = filters.get('technology')
  const location = filters.get('location')
  const experienceLevel = filters.get('experience-level')
  const search = filters.get('search').trim().toLowerCase()

  const jobCards = jobsList.querySelectorAll('.job-listing-card')

  jobCards.forEach((card) => {
    const title = card.querySelector('h3').textContent.toLowerCase()
    const technologies = card.dataset.technology.split(' ')

    const matchesTechnology = technology === '' || technologies.includes(technology)
    const matchesLocation = location === '' || card.dataset.modalidad === location
    const matchesExperienceLevel = experienceLevel === '' || card.dataset.nivel === experienceLevel
    const matchesSearch = title.includes(search)

    const isVisible = matchesTechnology && matchesLocation && matchesExperienceLevel && matchesSearch

    card.classList.toggle('is-hidden', !isVisible)
  })
}

searchForm.addEventListener('input', filterJobs)
