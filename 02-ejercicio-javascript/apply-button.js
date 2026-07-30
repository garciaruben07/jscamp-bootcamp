/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */

const jobsList = document.querySelector('.jobs-listings')

jobsList.addEventListener('click', (event) => {
  const applyButton = event.target.closest('.button-apply-job')

  if (!applyButton) return

  const jobTitle = applyButton.closest('.job-listing-card').querySelector('h3').textContent

  applyButton.textContent = '¡Aplicado!'
  applyButton.setAttribute('aria-label', `Ya has aplicado a la oferta de ${jobTitle}`)
  applyButton.classList.add('is-applied')
  applyButton.disabled = true
})
