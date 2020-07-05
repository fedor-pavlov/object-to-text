import { Context } from "../index";

export default function(context: Context, params?: string) {

    return (params || "\t").repeat(context.$level)
}