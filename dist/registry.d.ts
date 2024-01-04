export interface Registry {
    registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerInstance(key: string, instance: any, ...aliases: Array<string>): Registry;
}
//# sourceMappingURL=registry.d.ts.map