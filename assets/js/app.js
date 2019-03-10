/**
 * Gets all grid cells in multi dimensional array (8x8).
 *
 * @return {HTMLNode[][]}
 */
function getGrid () {
  const grid = []

  // For each row, push all cells into the resulting array.
  document.querySelectorAll('.wrapper .row').forEach((row) => {
    grid.push(
        // We have to convert the NodeList to an array.
      Array.from(row.querySelectorAll('.cell')),
    )
  })

  return grid
}

/**
 * Fetches new digit from API and updates the grid with new pixel colours.
 *
 * @param {HTMLNode[][]} grid Array of cells
 * @return {Promise<void>}
 */
function fetchDigit (grid) {
  // Prepares new request object that is instance of XMLHttpRequest.
  const request = new XMLHttpRequest()

  /**
   * Promise is a object that will have a value in future as the value is not
   * available at the present time.
   */
  const job = new Promise((resolve) => {
    // Once the request fetches the response from our server, we resolve (fulfill)
    // the promise, informing any part of the code that has a pointer to the
    // job object that the value is ready.
    request.addEventListener('load', () => resolve(request.response))
  })

  // Firing the request.
  request.open('GET', 'http://localhost:8080/digit', true)
  request.send()

  // Parsing the string into JSON.
  return job.then(JSON.parse)
    // Destructing the response object into its properties.
    .then(({ pixels, target }) => {
      // For each row in the grid, get all cells and update the colour.
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          /**
           * We have to find the pixel index as the pixels array is not multi
           * dimensional and it has indicies 0 - 63.
           *
           * cellIndex = <0; 7>
           * rowIndex = <0; 7>
           *
           * We can reason about the rowIndex as of an offset.
           */
          const pixelIndex = cellIndex + 8 * rowIndex
          // We have to convert the colour from 0 being white to 15 being white.
          let pixel = Math.abs(pixels[pixelIndex] - 16)
          // Getting the hex value of the decimal that ranges <0; 15>.
          pixel = (pixel === 16 ? 15 : pixel).toString(16)

          // Updating the background colour of the iterated cell.
          cell.style = `background-color: #${pixel}${pixel}${pixel}`
          // Updating the target string.
          document.getElementById('target').innerText = target
        })
      })
    })
}

/**
 * @var grid Is a multi dimensional 8x8 array
 */
const grid = getGrid()

// On load, fetch initial digit.
fetchDigit(grid)

// When the refresh button is clicked, fetch a new digit.
document.getElementById('request-new-digit')
  .addEventListener('click', () => fetchDigit(grid))
