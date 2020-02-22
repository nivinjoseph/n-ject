import { Disposable } from "./disposable";

// public
export interface ServiceLocator extends Disposable
{
    resolve<T extends object>(key: string): T;
    createScope(): ServiceLocator;
}