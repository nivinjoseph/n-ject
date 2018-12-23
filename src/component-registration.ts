import { Lifestyle } from "./lifestyle.js"; 
import { given } from "@nivinjoseph/n-defensive";
import "reflect-metadata";
import { injectSymbol } from "./inject";

// internal
export class ComponentRegistration
{
    private readonly _key: string;
    private readonly _component: Function;
    private readonly _lifestyle: Lifestyle;
    private readonly _dependencies: Array<string>;
    private readonly _aliases: ReadonlyArray<string>;


    public get key(): string { return this._key; }
    public get component(): Function { return this._component; }
    public get lifestyle(): Lifestyle { return this._lifestyle; }
    public get dependencies(): ReadonlyArray<string> { return this._dependencies; }
    public get aliases(): ReadonlyArray<string> { return this._aliases; }


    public constructor(key: string, component: Function, lifestyle: Lifestyle, ...aliases: string[])
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.getDependencies();
        this._aliases = [...aliases.map(t => t.trim())];
    }

    
    private getDependencies(): string[]
    {
        if (this._lifestyle === Lifestyle.Instance)
            return new Array<string>();    
        
        // if (Reflect.hasOwnMetadata(injectSymbol, this._component))
        //     return Reflect.getOwnMetadata(injectSymbol, this._component);
        // else
        //     return this.detectDependencies();    
        
        return Reflect.hasOwnMetadata(injectSymbol, this._component)
            ? Reflect.getOwnMetadata(injectSymbol, this._component)
            : new Array<string>();
    }

    
    // Borrowed from AngularJS implementation
    // private detectDependencies(): Array<string>
    // {
    //     const FN_ARG_SPLIT = /,/;
    //     const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;

    //     let dependencies = new Array<string>();

    //     let argDecl = this.extractArgs(this._component);
    //     argDecl[1].split(FN_ARG_SPLIT).forEach(arg =>
    //     {
    //         arg.replace(FN_ARG, (all, underscore, name) =>
    //         {
    //             dependencies.push(name);
    //             return undefined;
    //         });
    //     });

    //     return dependencies;
    // }

    // private stringifyFn(fn: Function): string
    // {
    //     return Function.prototype.toString.call(fn);
    // }

    // private extractArgs(fn: Function): RegExpMatchArray
    // {
    //     const ARROW_ARG = /^([^(]+?)=>/;
    //     const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
    //     const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

    //     let fnText = this.stringifyFn(fn).replace(STRIP_COMMENTS, "");
    //     let args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
    //     return args;
    // }
}