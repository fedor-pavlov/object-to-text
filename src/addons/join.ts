import { Context } from "../index";

export default function(context: Context, params?: string) {

    return context.join(params)
}