import fs from 'node:fs'

const extractIngredients = () => {
  try {
    const datasetJson: Array<string> = JSON.parse(
      fs.readFileSync('./extractedIngredients.json', 'utf-8'),
    )

    const uniqueIngredients: Set<string> = new Set()

    for (const ingredient of datasetJson) {
      uniqueIngredients.add(ingredient)
    }

    const sortedAndCapitalizedIngredients = [...uniqueIngredients]
      .sort((a, b) => a.localeCompare(b))
      .map((ingredient) =>
        ingredient
          .split(' ')
          .map((word) =>
            word
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          )
          .join(' '),
      )

    fs.writeFileSync(
      './ingredients.json',
      JSON.stringify(sortedAndCapitalizedIngredients, null, 2),
    )
    console.log('Ingredients extracted and saved successfully!')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

extractIngredients()
