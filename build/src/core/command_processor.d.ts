/**
 * Processes a resource content through the command pipe.
 */
export declare const createCommandProcessor: (cmdNameRegexp: RegExp) => (previousResult: string[], commands: string) => string[];
