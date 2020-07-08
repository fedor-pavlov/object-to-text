# object-to-text
Recursive nested text replacer that converts any data objects into strings using templates.

# Examples
## very simple example
```javascript
const { toText } = requrie('object-to-text')

let data = { someProperty: "World" }
let text = toText(data, "Hello {someProperty}")
// text === "Hello World"
```


## simple example
```javascript
const { toText } = requrie('object-to-text')

let data = { someProperty: "World", cities: ["London", "New York", "Paris", "Moscow", "Tokyo"] }
let text = toText(data, "Hello {someProperty}!\nHere's a list of some must-see cities: {cities:\n - {$}}")

/* text === "Hello World!
Here's a list of some must-see citites:
 - London
 - New York
 - Paris
 - Moscow
 - Tokyo"
*/
```

a bit better variant of that example:

```javascript
const { toText } = requrie('object-to-text')

let data = {

    someProperty: "World",
    cities: [
        {name: "London",    code: "LND" },
        {name: "New York",  code: "NYC" },
        {name: "Paris",     code: "PRS" },
        {name: "Moscow",    code: "MSC" },
        {name: "Tokyo",     code: "TKY" }
    ]
}

let text = toText(data, "Hello {someProperty}!\nHere's a list of some must-see cities: {cities:\n - {name}}")

/* text === "Hello World!
Here's a list of some must-see citites:
 - London
 - New York
 - Paris
 - Moscow
 - Tokyo"
*/
```