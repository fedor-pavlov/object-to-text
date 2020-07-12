import { Context } from "../index"

export default function(context: Context, propertyName: string | undefined) {

    return propertyName && context.$lenOf(propertyName) || ""
}