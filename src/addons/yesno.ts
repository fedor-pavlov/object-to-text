import { Context } from "../index";

export default function(context: Context, params?: string) {

    let options = params?.split(',')
    return Array.isArray(options) && options[context.$if ? 0 : 1]
}