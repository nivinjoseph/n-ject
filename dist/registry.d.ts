export interface Registry {
    registerTransient(key: string, component: Function): Registry;
    registerScoped(key: string, component: Function): Registry;
    registerSingleton(key: string, component: Function): Registry;
    registerInstance(key: string, instance: any): Registry;
}
