import XRegExp from "xregexp";
import systemCallbacks from "./addons";





export interface CallbacksCollection {

    [key: string]: ReplaceCallback
}

export interface Context {

    $           : string;
    $parent     : Context;
    $root       : Context;
    $property   : string | undefined;
    $level      : number;
    $iteration  : number;
    call        : (func: string, params: string | undefined) => string;
    value       : (property: string | undefined) => string;
    create      : (property: string | undefined) => Context;
    mutate      : (mutations: MutationStack) => string;
}

type TextBuilder = (input: any) => string;

type Mutator = (context: Context) => string;

type MutationStack = [Mutator];

type ReplaceCallback = (context: Context, params?: string) => any;





const rx_property = XRegExp.tag('xi')`
    ^\s*
        (?<property>    [$a-z\d-_]+)\s*     # context
    $`

const rx_function = XRegExp.tag('xi')`
    ^\s*
        (?<func>        [$a-z\d-_]+)\s*     # function
       \((?<param>      [^()]*)\)\s*        # params
    $`;

const rx_template = XRegExp.tag('xis')`
    ^\s*
        (?<context>    [$a-z\d-_]+)\s*:     # context
        (?<template>    .*)                 # params
    $`





const supportedContexVariables = ['$', '$property', '$level', '$iteration'];





function createContex(data: any, callbacks?: CallbacksCollection): Context {

    function _flat(value: any): string {

        return Array.isArray(value) ? value.join() : value && value.toString()
    }

    function _safecall(func: ReplaceCallback, context: Context, params?: string): any {

        try {

            return func(context, params)
        }
        catch(err) {

            return err;
        }
    }

    function _create(parent: Context | null, data: any, callbacks: CallbacksCollection, property?: string, iteration?: number): Context {

        let ctx = Object.create(null) as Context;

        if (typeof data === 'function') {

            data = _safecall(data, parent || ctx)
        }

        Object.defineProperty(ctx, "$", {

            configurable    : false,
            enumerable      : true,
            get             : () => _flat(data)
        })

        Object.defineProperty(ctx, "$parent", {

            configurable    : false,
            enumerable      : true,
            writable        : false,
            value           : parent
        })

        Object.defineProperty(ctx, "$root", {

            configurable    : false,
            enumerable      : false,
            writable        : false,
            value           : parent && parent.$root || ctx
        })

        Object.defineProperty(ctx, "$property", {

            configurable    : false,
            enumerable      : true,
            writable        : false,
            value           : property
        })

        Object.defineProperty(ctx, "$level", {

            configurable    : false,
            enumerable      : true,
            writable        : false,
            value           : parent && property ? parent.$level + (parent.$property !== property ? 1 : 0): 0
        })

        Object.defineProperty(ctx, "$iteration", {

            configurable    : false,
            enumerable      : false,
            get             : () => iteration || 0
        })

        Object.defineProperty(ctx, "value", {

            configurable    : false,
            enumerable      : false,
            writable        : false,
            value           : (property: string) => {

                return _flat(data[property])
            }
        })

        Object.defineProperty(ctx, "call", {

            configurable    : false,
            enumerable      : false,
            writable        : false,
            value           : (func: string, params: string) => {

                let f = callbacks[func];
                if (typeof f === 'function') return _flat(_safecall(f, ctx, params));

                f = data[func];
                if (typeof f === 'function') return _flat(_safecall(f, ctx, params));

                return `{{error: function "${func}" is not found in callbacks or object "${ctx.$property}" itself}}`
            }
        })

        Object.defineProperty(ctx, "create", {

            configurable    : false,
            enumerable      : false,
            writable        : false,
            value           : (property: string | undefined) => property && _create(ctx, data[property], callbacks, property) || ctx
        })

        Object.defineProperty(ctx, "mutate", {

            configurable    : false,
            enumerable      : false,
            writable        : false,
            value           : (mutations: MutationStack) => { 

                if (data === undefined) return ''
                if (data === null)      return ''

                return Array.isArray(data)
                    ? data.map(i => mutations.map(f => f(_create(ctx, i, callbacks, ctx.$property, ctx.$iteration + 1))).join('')).join('')
                    : mutations.map(f => f(ctx)).join('')
            }
        })

        return ctx;
    }

    return _create(null, data, callbacks && Object.assign(Object.create(null), systemCallbacks, callbacks) || systemCallbacks);
}





class Template {

    static echo(value: string): Mutator {

        return () => value
    }

    static context(name: string): Mutator {

        return (context: Context) => supportedContexVariables.includes(name) && (context as any)[name]
    }

    static property(name: string): Mutator {

        if (name[0] === '$') {

            return supportedContexVariables.includes(name)
                ? Template.context(name)
                : Template.error(`Context variable ${name} is not supported. Supported variables are: ${supportedContexVariables}`)
        }

        return (context: Context) => context.value(name)
    }

    static call(funcName : string, param : string | undefined, new_context: string | undefined): Mutator {

        return (context: Context) => context.create(new_context).call(funcName, param)
    }

    static error(text: string): Mutator {

        return () => `{{error: "${text}"}}`
    }

    static route(text: string): Mutator {

        let match = null;

        if (match = XRegExp.exec(text, rx_property)) {

            return Template.property(match.property)
        }

        if (match = XRegExp.exec(text, rx_function)) {

            return Template.call(match.func, match.param, undefined)
        }

        if (match = XRegExp.exec(text, rx_template)) {

            let func = XRegExp.exec(match.template, rx_function)

            return func
                ? Template.call(func.func, func.param, match.context)
                : Template.compile(match.template, match.context)
        }

        return Template.error(text);
    }

    static compile(template: string, new_context?: string): Mutator {

        let mutations: any = XRegExp.matchRecursive(template, '{', '}', 'g', { valueNames: ['echo', null, 'route', null] })
            mutations = mutations && mutations.map((t: any) => (Template as any)[`${t.name}`](t.value)) || [ () => template ]

        return (context: Context) => context.create(new_context).mutate(mutations)
    }
}





export function textBuilder(template: string, callbacks?: CallbacksCollection): TextBuilder {

    let exec = Template.compile(template)
    return (data: any) => exec(createContex(data, callbacks))
}

export function toText(data: any, template: string, callbacks?: CallbacksCollection): string {

    let exec = textBuilder(template, callbacks)
    return exec(data)
}