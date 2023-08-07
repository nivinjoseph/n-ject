import { given } from "@nivinjoseph/n-defensive";
import { ClassDefinition } from "@nivinjoseph/n-util";


export class Injector
{
    private readonly _dependencyMap = new Map<ClassDefinition<any>, Array<string>>();

    public get dependencyMap(): Map<ClassDefinition<any>, Array<string>> { return this._dependencyMap; }


    public inject<This extends ClassDefinition<any>>(...dependencies: [string, ...Array<string>]): InjectClassDecorator<This>
    {
        const decorator: InjectClassDecorator<This> = (value, context) =>
        {
            given(context, "context")
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                .ensure(t => t.kind === "class", "inject should only be used on classes");

            this._dependencyMap.set(value, dependencies);
        };

        return decorator;
    }
}

type InjectClassDecorator<This extends ClassDefinition<any>> = (
    value: This,
    context: ClassDecoratorContext<This>
) => void;


const injector = new Injector();
export const inject = injector.inject.bind(injector);
export const dependencyMap = injector.dependencyMap;