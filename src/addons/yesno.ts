import { Context } from "../index";

export default function(context: Context, params?: string) {

    console.log("\n\nYESNO:")
    console.log("context.$ =", context.$)
    console.log("context.$if =", context.$if)
    console.log("choice index =", context.$if ? 0 : 1)
    console.log("params =", params)
    console.log("options =", params?.split(','))

    let options = params?.split(',')
    console.log("options is array=", Array.isArray(options))
    return Array.isArray(options) && options[context.$if ? 0 : 1]
}