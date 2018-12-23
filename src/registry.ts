// public
export interface Registry
{
    registerTransient(key: string, component: Function, ...aliases: string[]): Registry;
    registerScoped(key: string, component: Function, ...aliases: string[]): Registry;
    registerSingleton(key: string, component: Function, ...aliases: string[]): Registry;
    registerInstance(key: string, instance: any, ...aliases: string[]): Registry;
}