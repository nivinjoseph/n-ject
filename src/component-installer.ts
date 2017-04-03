import { Registry } from "./registry";

// public
export interface ComponentInstaller
{
    install(registry: Registry): void;
}