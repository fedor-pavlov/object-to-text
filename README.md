# object-to-text
Recursive nested text replacer that converts any data objects into strings using templates.

# Examples
## very simple example

const { toText } = requrie('object-to-text')

let data = { someProperty: "world" }
let text = toText(data, "Hello {someProperty}")
// text === "Hello World"



## simple example

const { toText } = requrie('object-to-text')

let data = { someProperty: "world", cities: ["London", "New York", "Paris", "Moscow", "Tokyo"] }
let text = toText(data, "Hello {someProperty}!\nHere's some must see cities: {cities:\n - {$}}")
// text === "Hello World
Here's some must see citites:
 - London
 - New York
 - Paris
 - Moscow
 - Tokyo"