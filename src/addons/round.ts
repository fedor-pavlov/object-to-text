import { Context } from "../index";

export default function(context: Context, params?: string) {

    return Math.round(parseFloat(context.$)).toString()
}