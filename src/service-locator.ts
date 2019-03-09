// public
export interface ServiceLocator
{
    resolve<T extends object>(key: string): T;
}