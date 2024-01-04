import { ClassDefinition } from "@nivinjoseph/n-util";
export declare const injectionsKey: unique symbol;
export declare function inject<This extends ClassDefinition<any>>(...dependencies: [string, ...Array<string>]): InjectClassDecorator<This>;
export type InjectClassDecorator<This extends ClassDefinition<any>> = (value: This, context: ClassDecoratorContext<This>) => void;
//# sourceMappingURL=inject.d.ts.map