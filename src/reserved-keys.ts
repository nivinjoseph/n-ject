export class ReservedKeys
{
    public static readonly serviceLocator = "ServiceLocator";
    
    
    public static readonly all: ReadonlyArray<string> = [ReservedKeys.serviceLocator]; 
    
    /**
     * static
     */
    private constructor() {}
}