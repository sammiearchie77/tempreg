const car = [
    {
        name: 'Benz',
        year: 2015,
        model: 'G Class',
        color: 'White'
    },
    {
        name: 'Lexus',
        year: 2018,
        model: 'ES 350',
        color: 'White'
    },
    {
        name: 'Benz',
        year: 2019,
        model: 'GLK 350',
        color: 'Gold'
    },
    {
        name: 'Benz',
        year: 2015,
        model: 'C 350',
        color: 'White'
    },
    {
        name: 'Toyota',
        year: 2018,
        model: 'Carmy',
        color: 'White'
    },
    {
        name: 'Toyota',
        year: 2018,
        model: 'Corolla',
        color: 'White'
    },
    {
        name: 'Lexus',
        year: 2018,
        model: 'RX 350',
        color: 'White'
    },
]

// creating event listener 
const searchInpt = document.querySelector('.input');
searchInpt.addEventListener("input", e => {
    let value = e.target.value
    if(value && value.trim().length > 0){
        value = value.trim().toLowerCase()

        // returning only the res of setList if the value of the search incl in the car name 
        setList(car.filter(car => {
            return car.name.includes(value)
        }))
    } else {
        return "Search not certain";
    }
})

// clear btn 
const clearBtn = document.getElementById('clear');

clearBtn.addEventListener("click", () => {

})

// showing res on the page 
const setList = resData => {
    for (const car of resData){
        // create li element for each res 
        const resItem = document.createElement('li')
        // adding a class to each item of the res 
        resItem.classList.add('res-item')
        // grabbing the name of the current point of the loop and adding the name as the list item's text
        const text = document.createTextNode(car.name)
        // appending the text to res item 
        resItem.appendChild(text)
        // appending the res item to the list 
        list.appendChild(resItem)
    }
}