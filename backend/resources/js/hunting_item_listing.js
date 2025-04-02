window.addEventListener('DOMContentLoaded', () => {
    const itemDivs = Array.from(document.querySelectorAll('[id^="item-"]'))

    itemDivs.sort((a, b) => {
      const nameA = a.querySelector('span')?.textContent?.trim().toLowerCase() || ''
      const nameB = b.querySelector('span')?.textContent?.trim().toLowerCase() || ''
      return nameA.localeCompare(nameB)
    })

    const parent = itemDivs[0]?.parentNode
    if (parent) {
      itemDivs.forEach(div => parent.appendChild(div))
    }
  })