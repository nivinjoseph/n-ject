import { Disposable } from "@nivinjoseph/n-util";

// public
export interface ServiceLocator extends Disposable
{
    resolve<T extends object>(key: string): T;
    createScope(): ServiceLocator;
}